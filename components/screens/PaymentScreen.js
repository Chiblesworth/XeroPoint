import React, { Component } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, Alert } from 'react-native';
import { Header, Input, Button } from 'react-native-elements';
import Orientation from 'react-native-orientation';
import SwitchToggle from 'react-native-switch-toggle';
import { StackActions, NavigationActions } from 'react-navigation';
//Components/Overlays
import HeaderIcon from '../HeaderIcon';
import KeyedPaymentForm from '../KeyedPaymentForm';
import CreateCustomerOverlay from '../overlays/CreateCustomerOverlay';
import ApprovalOverlay from '../overlays/ApprovalOverlay';
//Helper Methods
import { feeCalculations } from '../../helperMethods/feeCalculations';
import { storageGet, storageSet } from '../../helperMethods/localStorage';
import { formatDate, formatTime } from '../../helperMethods/dateFormats';
import { stringToBoolean } from '../../helperMethods/stringToBoolean';

/*
    This resets the component of the main screen 
    Making the amount charged not carry over from screen to screen.
    Also resets any text inputs that were keyed in.
*/
const resetAction = StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({ routeName: 'Main' })],
});

export default class PaymentScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            amountCharged: this.props.navigation.state.params.amountCharged.replace(/[^0-9]/, ""),
            taxSwitchValue: false,
            serviceFeeSwitchValue: false,
            invoice: null,
            meno: null,
            tax: 0,
            serviceFee: 0,
            approvalVisible: false,
            approvalTitle: "",
            formatedDate: "",
            formatedTime: "",
            authCode: "",
            tipAdjustmentData: null,
            customOverlayVisible: false,
        }

        //These values will be set when the component mounts and will render based on switches
        this.amountWithTax = 0;
        this.amountWithService = 0;
        this.amountWithBoth = 0;

        /*
            These will be used as form logging how much taxes and fees the user
            collected in the day if we go that route. Waiting on Mr. Hess
            This will also be used for a combined total if both switches are true
        */
        this.taxDollarAmount = 0;
        this.serviceDollarAmount = 0;

        this.handleHeaderIconPress = this.handleHeaderIconPress.bind(this);
        this.handleSwitchPress = this.handleSwitchPress.bind(this);
        this.toggleTaxSwitch = this.toggleTaxSwitch.bind(this);
        this.toggleServiceSwitch = this.toggleServiceSwitch.bind(this);
        this.validateForm = this.validateForm.bind(this);
        this.getMerchantId = this.getMerchantId.bind(this);
        this.handleSearchCustomerButton = this.handleSearchCustomerButton.bind(this);
        this.showAlert = this.showAlert.bind(this);
        this.authorizePayment = this.authorizePayment.bind(this);
        this.determineAmount = this.determineAmount.bind(this);
        this.handleCustomerOverlay = this.handleCustomerOverlay.bind(this);
    }

    async componentWillMount() {
        let collectServiceFee = await storageGet("collectServiceFee");
        let collectTaxFee = await storageGet("collectTaxFee");

        collectServiceFee = await stringToBoolean(collectServiceFee);
        collectTaxFee = await stringToBoolean(collectTaxFee);

        console.log(this.props.navigation.state.params.refundSelected);
        //Don't want the service and tax fee to apply automatically for a refund
        if (this.props.navigation.state.params.refundSelected) {
            this.setState({
                serviceFeeSwitchValue: false,
                taxSwitchValue: false
            })
        }
        else {
            this.setState({
                serviceFeeSwitchValue: collectServiceFee,
                taxSwitchValue: collectTaxFee
            });
        }
    }

    async componentDidMount() {
        Orientation.lockToPortrait();
        let taxFee = await storageGet("taxFee");
        let serviceFee = await storageGet("serviceFee");
        let amountCharged = this.state.amountCharged;
        amountCharged = Number(amountCharged); //Makes sure it is a number being sent

        this.getMerchantId();

        this.setState({ tax: taxFee, serviceFee: serviceFee }, () => {
            this.amountWithTax = feeCalculations(amountCharged, taxFee);
            this.amountWithService = feeCalculations(amountCharged, serviceFee);
            this.amountWithBoth = feeCalculations(this.amountWithTax, serviceFee);
        })

    }

    async getMerchantId() {
        let merchantId = await storageGet("merchantId");

        this.setState({ merchantId: merchantId });
    }

    handleHeaderIconPress() {
        this.props.navigation.dispatch(resetAction);
    }

    async handleSwitchPress(switchHit) { //Using async here so values are being read as switched at the right times
        if (switchHit === "tax") {
            await this.toggleTaxSwitch();
        }
        else {
            await this.toggleServiceSwitch();
        }
    }

    toggleTaxSwitch() {
        this.setState({ taxSwitchValue: !this.state.taxSwitchValue });
    }

    toggleServiceSwitch() {
        this.setState({ serviceFeeSwitchValue: !this.state.serviceFeeSwitchValue });
    }

    validateForm(stateOfForm) {
        //Use number becasue cardAccount.number has spaces in it.
        //Don't know if MX Merchant has something on their backend to take care of that.
        if (stateOfForm.numberWithoutSpaces === "" || stateOfForm.cardAccount.expiryMonth === "" || stateOfForm.cardAccount.expiryYear === "") {
            this.showAlert("validation");
        }
        else if (stateOfForm.streetOn === true && stateOfForm.cardAccount.avsStreet === "") {
            this.showAlert("validation");
        }
        else if (stateOfForm.zipOn === true && stateOfForm.cardAccount.avsZip === "") {
            this.showAlert("validation");
        }
        else if (stateOfForm.cvvOn === true && stateOfForm.cardAccount.cvv === "") {
            this.showAlert("validation");
        }
        else {
            this.authorizePayment(stateOfForm);
        }
    }

    showAlert(typeOfAlert) {
        if (typeOfAlert === "validation") {
            Alert.alert(
                "Incomplete Fields",
                'Please fill out all fields above the "Charge" button to continue.'
            );
        }
        else if (typeOfAlert === "approval") {
            if (this.state.approvalVisible) {
                this.setState({ approvalVisible: !this.state.approvalVisible });

                if (this.props.navigation.state.params.refundSelected) {
                    this.props.navigation.dispatch(resetAction);
                }
                else {
                    this.props.navigation.navigate(
                        "Signature",
                        { tipAdjustmentData: this.state.tipAdjustmentData }
                    );
                }
            }
            else {
                let approvalTitle;

                if (this.props.navigation.state.params.refundSelected) {
                    approvalTitle = "Refund Approved!";
                }
                else {
                    approvalTitle = "Approved!";
                }

                this.setState({
                    approvalVisible: !this.state.approvalVisible,
                    approvalTitle: approvalTitle
                });
            }
        }
    }

    handleSearchCustomerButton() {
        this.props.navigation.navigate("SearchCustomer");
    }

    async authorizePayment(stateOfForm) {
        let encodedUser = await storageGet("encodedUser");
        let selectedCustomerId = await storageGet("selectedCustomerId");
        let amount = this.determineAmount();

        if (!!selectedCustomerId) {
            selectedCustomerId = Number(selectedCustomerId);
        }
        else {
            selectedCustomerId = "";
        }

        if (this.props.navigation.state.params.refundSelected) {
            amount = -Math.abs(amount);
        }

        let headers = {
            'Authorization': 'Basic ' + encodedUser,
            'Content-Type': 'application/json; charset=utf-8'
        }

        let data = {
            merchantId: stateOfForm.merchantId,
            tenderType: "Card",
            amount: amount,
            cardAccount: {
                number: stateOfForm.cardAccount.number,
                expiryMonth: stateOfForm.cardAccount.expiryMonth,
                expiryYear: stateOfForm.cardAccount.expiryYear,
                cvv: stateOfForm.cardAccount.cvv,
                avsZip: stateOfForm.cardAccount.avsZip,
                avsStreet: stateOfForm.cardAccount.avsStreet,
            },
            customer: {
                id: selectedCustomerId,
            },
            meta: this.state.memo,
            invoice: this.state.invoice
            
        }

        fetch("https://sandbox.api.mxmerchant.com/checkout/v3/payment", {
            method: "POST",
            headers: headers,
            body: JSON.stringify(data),
            dataType: "json"
        }).then(() => {
            fetch("https://sandbox.api.mxmerchant.com/checkout/v3/payment", {
                method: "GET",
                headers: headers
            }).then((response) => {
                return response.json();
            }).then((responseJson) => {
                let authorizedPaymentMade = responseJson.records[0];
                console.log(responseJson)
                let formatedDate = formatDate();
                let formatedTime = formatTime();

                let tipAdjustmentData = {
                    id: authorizedPaymentMade.id,
                    merchantId: authorizedPaymentMade.merchantId,
                    amount: authorizedPaymentMade.amount,
                    paymentToken: authorizedPaymentMade.paymentToken
                }

                this.setState({
                    formatedDate: formatedDate,
                    formatedTime: formatedTime,
                    authCode: authorizedPaymentMade.authCode,
                    tipAdjustmentData: tipAdjustmentData
                });

                this.showAlert("approval");
            })
        });
    }

    determineAmount() {
        //Determines total amount charged based on if service and tax fee are pressed.
        let amount = 0;

        if (this.state.taxSwitchValue && this.state.serviceFeeSwitchValue) {
            amount = this.amountWithBoth;
        }
        else if (this.state.taxSwitchValue && !this.state.serviceFeeSwitchValue) {
            amount = this.amountWithTax;
        }
        else if (!this.state.taxSwitchValue && this.state.serviceFeeSwitchValue) {
            amount = this.amountWithService;
        }
        else {
            amount = this.props.navigation.state.params.amountCharged.replace(/[^0-9]/, "");
        }

        amount = parseFloat(Math.round(amount * 100) / 100).toFixed(2);

        return amount;
    }

    handleCustomerOverlay() {
        this.setState({ customOverlayVisible: !this.state.customOverlayVisible })
    }

    render() {
        let serviceFee;
        let tax;
        let text;

        if (this.state.taxSwitchValue) {
            tax = <Text style={styles.feeText}>{this.state.tax}</Text>;
        }
        else {
            tax = <Text style={styles.feeText}>0</Text>;
        }

        if (this.state.serviceFeeSwitchValue) {
            serviceFee = <Text style={styles.feeText}>{this.state.serviceFee}</Text>;
        }
        else {
            serviceFee = <Text style={styles.feeText}>0</Text>;
        }

        if (this.props.navigation.state.params.refundSelected) {
            text = "REFUND";
        }
        else {
            text = "CHARGED";
        }

        return (
            <View style={styles.content}>
                <Header
                    style={styles.header}
                    backgroundColor='#808080'
                    containerStyle={{ borderBottomWidth: 0 }}
                    leftComponent={
                        <HeaderIcon
                            name="chevron-left"
                            type="entypo"
                            size={70}
                            handlePress={this.handleHeaderIconPress}
                        />
                    }
                />
                <View style={styles.chargedContainer}>
                    <Text style={styles.text}>{text} AMOUNT</Text>
                    <Text style={styles.amountText}>
                        ${this.determineAmount()}
                    </Text>
                </View>
                <ScrollView contentContainerStyle={styles.scrollView}>
                    <KeyedPaymentForm charge={this.validateForm} />
                    <View style={styles.spacer} />
                    <Button
                        type="solid"
                        title="Connect Card Reader"
                        containerStyle={styles.buttonContainer}
                        buttonStyle={styles.button}
                        titleStyle={styles.buttonTitle}
                    />
                    {/* Had to make a TextInput here because react
                    native elements doesn't support a textarea  */}
                    <View style={styles.spacer} />
                    <TextInput
                        style={styles.textarea}
                        multiline={true}
                        numberOfLines={4}
                        placeholder="Memo/Note"
                        placeholderTextColor="grey"
                        onChangeText={(text) => this.setState({ memo: text })}
                    />
                    <View style={styles.spacer2} />
                    <Input
                        placeholder="Invoice"
                        placeholderTextColor="grey"
                        inputContainerStyle={styles.inputContainer}
                        inputStyle={styles.input}
                        onChangeText={(text) => this.setState({ invoice: text })}
                    />
                    <View style={styles.spacer2} />
                    <View style={styles.row}>
                        <Button
                            type="solid"
                            title="Search Customer"
                            buttonStyle={styles.button}
                            titleStyle={styles.buttonTitle}
                            onPress={() => this.handleSearchCustomerButton()}
                        />
                        <View style={styles.rowDivider} />
                        <Button
                            type="solid"
                            title="Create Customer"
                            buttonStyle={styles.button}
                            titleStyle={styles.buttonTitle}
                            onPress={() => this.handleCustomerOverlay()}
                        />
                    </View>
                    <View style={styles.spacer2} />
                    <View style={styles.switchRow}>
                        <Text style={{ fontSize: 20, color: 'white', paddingRight: 10 }}>
                            Tax Fee
                        </Text>
                        <View style={[styles.smallRowDivider, { marginLeft: 53 }]} />
                        <SwitchToggle
                            switchOn={this.state.taxSwitchValue}
                            onPress={() => this.handleSwitchPress("tax")}
                            circleColorOff="white"
                            circleColorOn="white"
                            backgroundColorOn="blue"
                        />
                        <View style={styles.rowDivider} />
                        {tax}
                        <Text style={styles.feeText}>%</Text>
                    </View>
                    <View style={styles.spacer2} />
                    <View style={styles.switchRow}>
                        <Text style={{ fontSize: 20, color: 'white', paddingRight: 10 }}>
                            Service Fee
                        </Text>
                        <View style={styles.smallRowDivider} />
                        <SwitchToggle
                            switchOn={this.state.serviceFeeSwitchValue}
                            onPress={() => this.handleSwitchPress("service")}
                            circleColorOff="white"
                            circleColorOn="white"
                            backgroundColorOn="blue"
                        />
                        <View style={styles.rowDivider} />
                        {serviceFee}
                        <Text style={styles.feeText}>%</Text>
                    </View>
                </ScrollView>
                <ApprovalOverlay
                    visible={this.state.approvalVisible}
                    title={this.state.approvalTitle}
                    handleClose={this.showAlert}
                    determineAmount={this.determineAmount}
                    formatedDate={this.state.formatedDate}
                    formatedTime={this.state.formatedTime}
                    authCode={this.state.authCode}
                />
                <CreateCustomerOverlay
                    isVisible={this.state.customOverlayVisible}
                    closeOverlay={this.handleCustomerOverlay}
                    createCustomer={this.createCustomer}
                />
            </View>
        );
    }
}

//Styles
const styles = StyleSheet.create({
    content: {
        width: '100%',
        height: '100%',
        backgroundColor: '#808080'
    },
    header: {
        height: '10%',
        width: '100%'
    },
    spacer: {
        marginBottom: '4%'
    },
    spacer2: {
        marginBottom: '4%'
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%',
    },
    switchRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%'
    },
    rowDivider: {
        marginLeft: '10%'
    },
    smallRowDivider: {
        marginLeft: '4%'
    },
    chargedContainer: {
        alignItems: 'center',
        marginBottom: 10
    },
    text: {
        fontSize: 30,
        color: 'white'
    },
    feeText: {
        fontSize: 18,
        color: 'white',
        marginTop: 5
    },
    amountText: {
        fontSize: 70,
        color: 'white'
    },
    scrollView: {
        width: '100%',
        alignItems: 'center'
    },
    buttonContainer: {
        width: '80%',
        height: '5%'
    },
    button: {
        backgroundColor: '#C8C8C8'
    },
    buttonTitle: {
        fontSize: 16
    },
    textarea: {
        width: '80%',
        borderRadius: 15,
        backgroundColor: 'white',
        fontSize: 16
    },
    inputContainer: {
        width: '84%',
        marginLeft: '8%',
        borderRadius: 15,
        backgroundColor: 'white'
    },
    input: {
        fontSize: 16,
        paddingLeft: 20
    },
});