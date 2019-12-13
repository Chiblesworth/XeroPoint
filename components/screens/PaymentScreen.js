import React, { Component } from 'react';
import { View, Text, TextInput, ScrollView, Alert, NativeEventEmitter } from 'react-native';
import { Header, Input, Button } from 'react-native-elements';
import Orientation from 'react-native-orientation';
import SwitchToggle from 'react-native-switch-toggle';
import RNAnyPay from 'react-native-any-pay';
import { StackActions, NavigationActions } from 'react-navigation';

import HeaderIcon from '../HeaderIcon';
import KeyedPaymentForm from '../KeyedPaymentForm';
import CreateCustomerOverlay from '../overlays/CreateCustomerOverlay';
import ApprovalOverlay from '../overlays/ApprovalOverlay';

import { feeCalculations } from '../../helpers/feeCalculations';
import { getRequestHeader } from '../../helpers/getRequestHeader';
import { storageGet, storageSet } from '../../helpers/localStorage';
import { formatDate, formatTime } from '../../helpers/dateFormats';
import { showAlert } from '../../helpers/showAlert';

import { styles } from '../styles/PaymentStyles';

const AnyPay = RNAnyPay.AnyPay;
var transaction = null;
const eventEmitter = new NativeEventEmitter(RNAnyPay.AnyPay);

eventEmitter.addListener('CardReaderError', (event) => {
    console.log(event); // "someValue"
});
eventEmitter.addListener('CardReaderEvent', (event) => {
    console.log(event); // "someValue"
});
eventEmitter.addListener('CardReaderConnected', (event) => {
    console.log(event); // "someValue"
})
/*
    This resets the component of the main screen 
    Making the amount charged not carry over from screen to screen.
    Also resets any text inputs that were keyed in.
*/
const resetAction = StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({ routeName: 'DrawerStack' })],
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

        this.handleHeaderIconPress = this.handleHeaderIconPress.bind(this);
        this.toggleSwitch = this.toggleSwitch.bind(this);
        this.validateForm = this.validateForm.bind(this);
        this.getMerchantId = this.getMerchantId.bind(this);
        this.handleSearchCustomerButton = this.handleSearchCustomerButton.bind(this);
        this.determineAlert = this.determineAlert.bind(this);
        this.authorizePayment = this.authorizePayment.bind(this);
        this.determineAmount = this.determineAmount.bind(this);
        this.handleCustomerOverlay = this.handleCustomerOverlay.bind(this);
        this.connectCardReader = this.connectCardReader.bind(this);
        this.startEmv = this.startEmv.bind(this);
        this.getApiKeys = this.getApiKeys.bind(this);
    }

    async componentWillMount() {
        let collectServiceFee = await storageGet("collectServiceFee");
        let collectTaxFee = await storageGet("collectTaxFee");

        collectServiceFee = JSON.parse(collectServiceFee);
        collectTaxFee = JSON.parse(collectTaxFee);

        (this.props.navigation.state.params.refundSelected)
            ? this.setState({serviceFeeSwitchValue: false, taxSwitchValue: false})
            : this.setState({serviceFeeSwitchValue: collectServiceFee, taxSwitchValue: collectTaxFee});
    }

    async componentDidMount() {
        Orientation.lockToPortrait();
        let taxFee = await storageGet("taxFee");
        let serviceFee = await storageGet("serviceFee");

        this.getMerchantId();
        this.getApiKeys();

        this.setState({ tax: taxFee, serviceFee: serviceFee });
    }

    async connectCardReader() {
        let connected = await AnyPay.isReaderConnected();
        console.log("Connected: " + connected);
        
        (connected)
            ? this.startEmv()
            : AnyPay.connectBluetoothReader();
    }

    async startEmv(){
        try{
            var emvObj = {
                type: 'SALE',
                address:'123 Main Street',
                postalCode: '30004',
                totalAmount: this.state.amountCharged,
                currency: 'USD'
              }
            console.log(emvObj)
            transaction = await AnyPay.startEMVTransaction(emvObj).catch(e => console.log(e))
            console.log(transaction);
        }
        catch(e){
            console.log(e);
        }
        // var keyedObj = {
        //     type: 'SALE',
        //     cardExpiryMonth: '10',
        //     cardExpiryYear: '20',
        //     address: '123 Main Street',
        //     postalCode: '30004',
        //     CVV2: '999',
        //     cardholderName: 'Jane Doe',
        //     cardNumber: '4012888888881881',
        //     totalAmount: '10.47',
        //     currency:'USD'
        // }
        // transaction = await AnyPay.startKeyedTransaction(keyedObj).catch(e => console.log(e));
        // console.log(transaction)
    }

    async getMerchantId() {
        let merchantId = await storageGet("merchantId");
        this.setState({ merchantId: merchantId });
    }

    handleHeaderIconPress() {
        this.props.navigation.dispatch(resetAction);
    }

    toggleSwitch(switchHit) {
        (switchHit === "tax")
            ? this.setState({ taxSwitchValue: !this.state.taxSwitchValue })
            : this.setState({ serviceFeeSwitchValue: !this.state.serviceFeeSwitchValue });
    }

    validateForm(stateOfForm) {
        //Use number becasue cardAccount.number has spaces in it.
        //Don't know if MX Merchant has something on their backend to take care of that.
        if (stateOfForm.numberWithoutSpaces === "" || stateOfForm.cardAccount.expiryMonth === "" || stateOfForm.cardAccount.expiryYear === "") {
            this.determineAlert("validation");
        }
        else if (stateOfForm.streetOn === true && stateOfForm.cardAccount.avsStreet === "") {
            this.determineAlert("validation");
        }
        else if (stateOfForm.zipOn === true && stateOfForm.cardAccount.avsZip === "") {
            this.determineAlert("validation");
        }
        else if (stateOfForm.cvvOn === true && stateOfForm.cardAccount.cvv === "") {
            this.determineAlert("validation");
        }
        else {
            this.authorizePayment(stateOfForm);
        }
    }

    determineAlert(typeOfAlert) {
        if (typeOfAlert === "validation") {
            showAlert("Incomplete Fields", 'Please fill out all fields above the "Charge" button to continue.');
        }
        else if (typeOfAlert === "approval") {
            if (this.state.approvalVisible) {
                this.setState({ approvalVisible: !this.state.approvalVisible });

                (this.props.navigation.state.params.refundSelected)
                    ? this.props.navigation.dispatch(resetAction)
                    : this.props.navigation.navigate("Signature", {tipAdjustmentData: this.state.tipAdjustmentData});
            }
            else {
                let approvalTitle;

                (this.props.navigation.state.params.refundSelected)
                    ? (approvalTitle = "Refund Approved!")
                    : approvalTitle = "Approved!";

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
        let headers = await getRequestHeader();
        let selectedCustomerId = await storageGet("selectedCustomerId");
        let amount;

        (!!selectedCustomerId)
            ? selectedCustomerId = Number(selectedCustomerId)
            : selectedCustomerId = "";


        (this.props.navigation.state.params.refundSelected)
            ? amount = -Math.abs(amount)
            : amount = this.determineAmount();

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
        }).then((response) => {
            fetch("https://sandbox.api.mxmerchant.com/checkout/v3/payment?limit=1", {
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

                this.determineAlert("approval");
            })
        });
    }

    determineAmount() {
        let amount = 0;

        if (this.state.taxSwitchValue && this.state.serviceFeeSwitchValue) {
            amount = feeCalculations(feeCalculations(Number(this.state.amountCharged), this.state.tax), this.state.serviceFee); //Tax fee is applied first.
        }
        else if (this.state.taxSwitchValue && !this.state.serviceFeeSwitchValue) {
            amount = feeCalculations(Number(this.state.amountCharged), this.state.tax);
        }
        else if (!this.state.taxSwitchValue && this.state.serviceFeeSwitchValue) {
            amount = feeCalculations(Number(this.state.amountCharged), this.state.serviceFee)
        }
        else {
            amount = this.state.amountCharged;
        }

        amount = parseFloat(Math.round(amount * 100) / 100).toFixed(2);
        return amount;
    }

    handleCustomerOverlay() {
        this.setState({ customOverlayVisible: !this.state.customOverlayVisible })
    }

    async getApiKeys(){
        let headers = await getRequestHeader();

        fetch(`https://sandbox.api.mxmerchant.com/checkout/v3/application?merchantId=${this.state.merchantId}`, {
            method: "GET",
            headers: headers
        }).then((response) => {
            console.log(response.json());
        })
    }

    render() {
        let serviceFee;
        let tax;
        let text;

        (this.state.taxSwitchValue)
            ? tax = this.state.tax
            : tax = 0;

        (this.state.serviceFeeSwitchValue)
            ? serviceFee = this.state.serviceFee
            : serviceFee = 0;
        
        (this.props.navigation.state.params.refundSelected)
            ? text = "REFUND"
            : text = "CHARGED";

        return (
            <View style={styles.content}>
                <Header
                    style={styles.header}
                    backgroundColor='#454343'
                    containerStyle={{ borderBottomWidth: 0 }}
                    leftComponent={
                        <HeaderIcon
                            name="chevron-left"
                            type="entypo"
                            size={50}
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
                        onPress={() => this.connectCardReader()}
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
                    <View style={styles.spacer} />
                    <Input
                        placeholder="Invoice"
                        placeholderTextColor="grey"
                        inputContainerStyle={styles.inputContainer}
                        inputStyle={styles.input}
                        onChangeText={(text) => this.setState({ invoice: text })}
                    />
                    <View style={styles.spacer} />
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
                    <View style={styles.spacer} />
                    <View style={styles.switchRow}>
                        <Text style={{ fontSize: 20, color: 'white', paddingRight: 10 }}>
                            Tax Fee
                        </Text>
                        <View style={[styles.smallRowDivider, { marginLeft: 53 }]} />
                        <SwitchToggle
                            switchOn={this.state.taxSwitchValue}
                            onPress={() => this.toggleSwitch("tax")}
                            circleColorOff="white"
                            circleColorOn="white"
                            backgroundColorOn="blue"
                        />
                        <View style={styles.rowDivider} />
                        <Text style={styles.feeText}>{tax}%</Text>
                    </View>
                    <View style={styles.spacer} />
                    <View style={styles.switchRow}>
                        <Text style={{ fontSize: 20, color: 'white', paddingRight: 10 }}>
                            Service Fee
                        </Text>
                        <View style={styles.smallRowDivider} />
                        <SwitchToggle
                            switchOn={this.state.serviceFeeSwitchValue}
                            onPress={() => this.toggleSwitch("service")}
                            circleColorOff="white"
                            circleColorOn="white"
                            backgroundColorOn="blue"
                        />
                        <View style={styles.rowDivider} />
                        <Text style={styles.feeText}>{serviceFee}%</Text>
                    </View>
                </ScrollView>
                <ApprovalOverlay
                    visible={this.state.approvalVisible}
                    title={this.state.approvalTitle}
                    handleClose={this.determineAlert}
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