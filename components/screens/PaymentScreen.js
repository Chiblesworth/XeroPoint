import React, { Component } from 'react';
import { View, Text, TextInput, ScrollView, Alert, NativeEventEmitter } from 'react-native';
import { Header, Input, Button } from 'react-native-elements';
import Orientation from 'react-native-orientation';
import SwitchToggle from 'react-native-switch-toggle';
import RNAnyPay from 'react-native-any-pay';
import { StackActions, NavigationActions } from 'react-navigation';

import HeaderIcon from '../HeaderIcon';
import KeyedPaymentForm from '../KeyedPaymentForm';
import FeeSwitch from '../FeeSwitch';
import CreateCustomerOverlay from '../overlays/CreateCustomerOverlay';
import ApprovalOverlay from '../overlays/ApprovalOverlay';

import { feeCalculations } from '../../helpers/feeCalculations';
import { getRequestHeader } from '../../helpers/getRequestHeader';
import { storageGet } from '../../helpers/localStorage';
import { formatDate, formatTime } from '../../helpers/dateFormats';
import { showAlert } from '../../helpers/showAlert';

import { styles } from '../styles/PaymentStyles';

const AnyPay = RNAnyPay.AnyPay;
const eventEmitter = new NativeEventEmitter(RNAnyPay.AnyPay);
var transaction = null;

eventEmitter.addListener('CardReaderError', (event) => {
    console.log(event); // "someValue"
});
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
            cardReaderConnected: false,
            cardReaderEventText: "",
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
        this.handleSearchCustomerButton = this.handleSearchCustomerButton.bind(this);
        this.determineAlert = this.determineAlert.bind(this);
        this.authorizePayment = this.authorizePayment.bind(this);
        this.determineAmount = this.determineAmount.bind(this);
        this.handleCustomerOverlay = this.handleCustomerOverlay.bind(this);
        this.handleConnectReaderPress = this.handleConnectReaderPress.bind(this);
        this.startEmv = this.startEmv.bind(this);
        this.startPaymentProcess = this.startPaymentProcess.bind(this);
    }

    async componentWillMount() {
        let collectServiceFee = await storageGet("collectServiceFee");
        let collectTaxFee = await storageGet("collectTaxFee");
        let connected =  await AnyPay.isReaderConnected();
        console.log("connected ", connected)

        collectServiceFee = JSON.parse(collectServiceFee);
        collectTaxFee = JSON.parse(collectTaxFee);

        (this.props.navigation.state.params.refundSelected)
            ? this.setState({serviceFeeSwitchValue: false, taxSwitchValue: false, cardReaderConnected: connected})
            : this.setState({serviceFeeSwitchValue: collectServiceFee, taxSwitchValue: collectTaxFee, cardReaderConnected: connected});
    }

    async componentDidMount() {
        Orientation.lockToPortrait();
        let taxFee = await storageGet("taxFee");
        let serviceFee = await storageGet("serviceFee");

        eventEmitter.addListener('CardReaderEvent', this.handleCardReaderEvent.bind(this));
        eventEmitter.addListener('CardReaderConnected', this.handleCardReaderConnect.bind(this));
        eventEmitter.addListener('CardReaderDisconnected', this.handleCardReaderDisconnect.bind(this));

        this.setState({ tax: taxFee, serviceFee: serviceFee});
    }

    handleCardReaderEvent = (event) => {
        console.log(event);
        this.setState({cardReaderEventText: (event.detail === null) ? event.message : event.detail});
    }

    handleCardReaderConnect = (event) => {
        console.log(event);
        AnyPay.isReaderConnected().then((connected) => {
            this.setState({cardReaderConnected: connected});
        });
    }

    handleCardReaderDisconnect = (event) => {
        console.log(event);
        AnyPay.isReaderConnected().then((connected) => {
            this.setState({cardReaderConnected: connected});
        });
    }

    async handleConnectReaderPress() {    
        console.log("handleConnectReaderPress ", this.state.cardReaderConnected);
        (this.state.cardReaderConnected)
            ? AnyPay.disconnectReader()
            : AnyPay.connectBluetoothReader();
    }

    async startEmv(){
        try{
            var emvObj = {
                type: 'SALE',
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
    }

    handleHeaderIconPress() {
        this.props.navigation.dispatch(resetAction);
    }

    toggleSwitch(switchHit) {
        (switchHit === "Tax Fee")
            ? this.setState({ taxSwitchValue: !this.state.taxSwitchValue })
            : this.setState({ serviceFeeSwitchValue: !this.state.serviceFeeSwitchValue });
    }

    startPaymentProcess(formState) {
        (this.state.cardReaderConnected)
            ? this.startEmv()
            : this.validateForm(formState);
    }

    validateForm(formState) {
        console.log(formState)
        if (formState.number === "" || formState.cardAccount.expiryMonth === "" || formState.cardAccount.expiryYear === "") {
            this.determineAlert("validation");
            /*
            number contains only numbers
            16 numbers only
            month must be number and 2 digits
            year must be number and 2 digits
            */
        }
        else if (formState.streetOn === true && formState.cardAccount.avsStreet === "") {
            this.determineAlert("validation");
        }
        else if (formState.zipOn === true && formState.cardAccount.avsZip === "") {
            this.determineAlert("validation"); //Check for 5 digits and only numbers
        }
        else if (formState.cvvOn === true && formState.cardAccount.cvv === "") {
            this.determineAlert("validation"); //cvv can only b3 3-4 numbers long
        }
        else {
            this.authorizePayment(formState);
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
        let merchantId = await storageGet("merchantId");
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
            merchantId: merchantId,
            tenderType: "Card",
            amount: amount,
            cardAccount: {
                // number: stateOfForm.cardAccount.number,
                // expiryMonth: stateOfForm.cardAccount.expiryMonth,
                // expiryYear: stateOfForm.cardAccount.expiryYear,
                number: "4242 4242 4242 4242",
                expiryMonth: "12",
                expiryYear: "21",
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

        fetch("https://sandbox.api.mxmerchant.com/checkout/v3/payment?echo=true", {
            method: "POST",
            headers: headers,
            body: JSON.stringify(data),
            dataType: "json"
        }).then((response) => {
            return response.json();
        }).then((createdPayment) => {
            let formattedDate = formatDate();
            let formattedTime = formatTime();

            let tipAdjustmentData = {
                id: createdPayment.id,
                merchantId: createdPayment.merchantId,
                amount: createdPayment.amount,
                paymentToken: createdPayment.paymentToken
            }
            //change formated to formatted
            this.setState({
                formatedDate: formattedDate,
                formatedTime: formattedTime,
                authCode: createdPayment.authCode,
                tipAdjustmentData: tipAdjustmentData
            });

            this.determineAlert("approval");
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
                    <Text style={styles.text}>{this.state.cardReaderConnected.toString()}</Text>
                    <Text style={styles.text}>{this.state.cardReaderEventText}</Text>
                </View>
                <ScrollView contentContainerStyle={styles.scrollView}>
                    <KeyedPaymentForm 
                        charge={this.startPaymentProcess}
                        connected={this.state.cardReaderConnected}
                    />
                    <View style={styles.spacer} />
                    <Button
                        type="solid"
                        title={(this.state.cardReaderConnected) ? "Disconnect Card Reader" : "Connect Card Reader"} 
                        containerStyle={styles.buttonContainer}
                        buttonStyle={styles.button}
                        titleStyle={styles.buttonTitle}
                        onPress={() => this.handleConnectReaderPress()}
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
                    <FeeSwitch 
                        toggle={this.toggleSwitch}
                        swtichTitle="Tax Fee"
                        switchOn={this.state.taxSwitchValue}
                        fee={tax}
                        marginLeftValue={53}
                    />
                    <View style={styles.spacer} />
                    <FeeSwitch
                        toggle={this.toggleSwitch}
                        swtichTitle="Service Fee"
                        switchOn={this.state.serviceFeeSwitchValue}
                        fee={serviceFee}
                        marginLeftValue={15}
                    />
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