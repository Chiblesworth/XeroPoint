import React, { Component } from 'react';
import { View, Text, TextInput, ScrollView, NativeEventEmitter } from 'react-native';
import { Header, Input, Button } from 'react-native-elements';
import Orientation from 'react-native-orientation';
import RNAnyPay from 'react-native-any-pay';
import { StackActions, NavigationActions } from 'react-navigation';

import HeaderIcon from '../HeaderIcon';
import KeyedPaymentForm from '../KeyedPaymentForm';
import FeeSwitch from '../FeeSwitch';

import CreateCustomerOverlay from '../overlays/CreateCustomerOverlay';
import SearchCustomerOverlay from '../overlays/SearchCustomerOverlay';
import AuthorizationOverlay from '../overlays/AuthorizationOverlay';
import EmvProcessOverlay from '../overlays/EmvProcessOverlay';

import { feeCalculations } from '../../helpers/feeCalculations';
import { getRequestHeader } from '../../helpers/getRequestHeader';
import { storageGet } from '../../helpers/localStorage';
import { convertMilitaryToStandardTime } from '../../helpers/dateFormats';

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
            authorizationVisible: false,
            authorizationTitle: "",
            formatedDate: "",
            formatedTime: "",
            authCode: null,
            tipAdjustmentData: null,
            createCustomerOverlayVisible: false,
            emvOverlayVisible: false,
            searchCustomerOverlayVisible: false
        }
    }

    async componentDidMount() {
        Orientation.lockToPortrait();
        let taxFee = await storageGet("taxFee");
        let serviceFee = await storageGet("serviceFee");
        let collectServiceFee = await storageGet("collectServiceFee");
        let collectTaxFee = await storageGet("collectTaxFee");
        let connected =  await AnyPay.isReaderConnected();

        console.log("connected ", connected)

        collectServiceFee = JSON.parse(collectServiceFee);
        collectTaxFee = JSON.parse(collectTaxFee);

        eventEmitter.addListener('CardReaderEvent', this.handleCardReaderEvent.bind(this));
        eventEmitter.addListener('CardReaderConnected', this.handleCardReaderConnect.bind(this));
        eventEmitter.addListener('CardReaderDisconnected', this.handleCardReaderDisconnect.bind(this));

        (this.props.navigation.state.params.refundSelected)
            ? this.setState({serviceFeeSwitchValue: false, taxSwitchValue: false, cardReaderConnected: connected, tax: taxFee, serviceFee: serviceFee})
            : this.setState({serviceFeeSwitchValue: collectServiceFee, taxSwitchValue: collectTaxFee, cardReaderConnected: connected, tax: taxFee, serviceFee: serviceFee});
    }

    handleCardReaderEvent = (event) => {
        console.log(event);
        if(event.detail != "Approved"){
            this.setState({cardReaderEventText: (event.detail === null) ? event.message : event.detail});
        }
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

    handleHeaderIconPress = () => {
        this.props.navigation.dispatch(resetAction);
    }

    handleSearchCustomerButton = () => {
        this.props.navigation.navigate("SearchCustomer");
    }

    handleConnectReaderPress = async () => {    
        console.log("handleConnectReaderPress ", this.state.cardReaderConnected);
        (this.state.cardReaderConnected)
            ? AnyPay.disconnectReader()
            : AnyPay.connectBluetoothReader();
    }

    handleCreateCustomerOverlay = () => {
        this.setState({createCustomerOverlayVisible: !this.state.createCustomerOverlayVisible});
    }

    handleSearchCustomerOverlay = () => {
        this.setState({searchCustomerOverlayVisible: !this.state.searchCustomerOverlayVisible});
    }

    handleEmvOverlay =() => {
        this.setState({emvOverlayVisible: !this.state.emvOverlayVisible});
    }

    handleCreatedPayment = async (createdPayment) => {
        console.log(createdPayment);
        let createdDate = new Date(createdPayment.created);
        let dateCreated = createdDate.toDateString();
        let timeCreated = createdDate.toTimeString();
        let authCode, tipAdjustmentData;

        timeCreated = timeCreated.split(" ");
        timeCreated = convertMilitaryToStandardTime(timeCreated[0], true);

        if(createdPayment.status === "Approved"){
            tipAdjustmentData = {
                id: createdPayment.id,
                merchantId: createdPayment.merchantId,
                amount: createdPayment.amount,
                paymentToken: createdPayment.paymentToken
            }

            console.log(tipAdjustmentData);
        }
        console.log("PaymentScreen payment id is ");
        console.log(createdPayment.id);
        
        (createdPayment.authCode === undefined) 
            ? authCode = null 
            : authCode = createdPayment.authCode;

        this.setState({
            formatedDate: dateCreated,
            formatedTime: timeCreated,
            authCode: authCode,
            tipAdjustmentData: tipAdjustmentData
        });

        this.handleAuthorizationOverlay(createdPayment.status);
    }

    handleAuthorizationOverlay = (status) => {
        if(this.state.emvOverlayVisible){
            //Removes EMV overlay so not visible when this overlay appears.
            this.setState({emvOverlayVisible: !this.state.emvOverlayVisible});
        }

        if(this.state.authorizationVisible){
            this.setState({authorizationVisible: !this.state.authorizationVisible});
            console.log("HERE in handleAuthOVerlay");
            console.log(status);
            if(status === "Approved"){
                (this.props.navigation.state.params.refundSelected)
                ? this.props.navigation.dispatch(resetAction)
                : this.props.navigation.navigate("Signature", {tipAdjustmentData: this.state.tipAdjustmentData});
            }
        }
        else{
            this.setState({
                authorizationVisible: !this.state.authorizationVisible,
                authorizationTitle: status
            });
        }
    }

    toggleSwitch = (switchHit) => {
        (switchHit === "Tax Fee")
            ? this.setState({ taxSwitchValue: !this.state.taxSwitchValue })
            : this.setState({ serviceFeeSwitchValue: !this.state.serviceFeeSwitchValue });
    }

    startPaymentProcess = (cardAccount) => {
        (this.state.cardReaderConnected)
            ? this.startEmv()
            : this.authorizePayment(cardAccount);
    }

    startEmv = async () =>{
        try{
            let emvTransactionType, emvTransactionAmount;

            if(this.props.navigation.state.params.refundSelected){
                emvTransactionType = "REFUND";
                emvTransactionAmount = this.state.amountCharged;
            }
            else {
                emvTransactionType = "SALE";
                emvTransactionAmount = this.state.amountCharged;
            }

            //Will need to invoice, memo and customer fields somehow
            //Simple work around could be to pass them to the next screen and add them with the PUT the same way for the TIP!
            var emvObj = {
                type: emvTransactionType,
                totalAmount: emvTransactionAmount,
                currency: 'USD'
            }
            console.log(emvObj);

            this.handleEmvOverlay();

            transaction = await AnyPay.startEMVTransaction(emvObj).catch(e => console.log(e));
           // this.handleCreatedPayment(transaction.gatewayResponse.responseJson);

            (this.props.navigation.state.params.refundSelected)
              ? this.handleCreatedPayment(transaction)
              : this.handleCreatedPayment(transaction.gatewayResponse.responseJson);


            //   var emvObj = {
            //     type: "REFUND",
            //     // totalAmount: this.state.amountCharged,
            //     currency: 'USD'
            //   }
            //   this.handleEmvOverlay();

            //     transaction = await AnyPay.refundTransaction(emvObj, Number(this.state.amountCharged)).catch(e => console.log(e));
        }
        catch(e){
            console.log(e);
        }
    }

    authorizePayment = async (cardAccount) => {
        let merchantId = await storageGet("merchantId");
        let headers = await getRequestHeader();
        let selectedCustomerId = await storageGet("selectedCustomerId");
        let amount;

        (!!selectedCustomerId)
            ? selectedCustomerId = Number(selectedCustomerId)
            : selectedCustomerId = null;


        (this.props.navigation.state.params.refundSelected)
            ? amount = -Math.abs(this.determineAmount())
            : amount = this.determineAmount();
        console.log(amount);
        console.log(amount.toString());
        let data = {
            merchantId: merchantId,
            tenderType: "Card",
            amount: amount,
            cardAccount: {
                number: cardAccount.number,
                expiryMonth: cardAccount.expiryMonth,
                expiryYear: cardAccount.expiryYear,
                cvv: cardAccount.cvv,
                avsZip: cardAccount.avsZip,
                avsStreet: cardAccount.avsStreet,
            },
            customer: {
                id: selectedCustomerId,
            },
            meta: this.state.memo,
            invoice: this.state.invoice
            
        }
        console.log(data);

        fetch("https://sandbox.api.mxmerchant.com/checkout/v3/payment?echo=true", {
            method: "POST",
            headers: headers,
            body: JSON.stringify(data),
            dataType: "json"
        }).then((response) => {
            console.log(response);
            return response.json();
        }).then((createdPayment) => {
            this.handleCreatedPayment(createdPayment);
        });
    }

    determineAmount = () => {
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

    render() {
        let serviceFee, tax, text, textColor;

        (this.state.taxSwitchValue)
            ? tax = this.state.tax
            : tax = 0;

        (this.state.serviceFeeSwitchValue)
            ? serviceFee = this.state.serviceFee
            : serviceFee = 0;
        
        if(this.props.navigation.state.params.refundSelected){
            text = "REFUND";
            textColor = "#E50F0F";
        }
        else{
            text = "CHARGED";
            textColor = "#fff";
        }

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
                    <Text style={[styles.text, {color: textColor}]}>{text} AMOUNT</Text>
                    <Text style={[styles.amountText, {color: textColor}]}>
                        ${this.determineAmount()}
                    </Text>
                    {/* <Text style={styles.text}>{this.state.cardReaderConnected.toString()}</Text>
                    <Text style={styles.text}>{this.state.cardReaderEventText}</Text> */}
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
                            onPress={() => this.handleSearchCustomerOverlay()}
                        />
                        <View style={styles.rowDivider} />
                        <Button
                            type="solid"
                            title="Create Customer"
                            buttonStyle={styles.button}
                            titleStyle={styles.buttonTitle}
                            onPress={() => this.handleCreateCustomerOverlay()}
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
                <AuthorizationOverlay
                    visible={this.state.authorizationVisible}
                    title={this.state.authorizationTitle}
                    handleClose={this.handleAuthorizationOverlay}
                    determineAmount={this.determineAmount}
                    formatedDate={this.state.formatedDate}
                    formatedTime={this.state.formatedTime}
                    authCode={this.state.authCode}
                    isRefund={this.props.navigation.state.params.refundSelected}
                />
                <CreateCustomerOverlay
                    isVisible={this.state.createCustomerOverlayVisible}
                    closeOverlay={this.handleCreateCustomerOverlay}
                    createCustomer={this.createCustomer}
                />
                <EmvProcessOverlay
                    isVisible={this.state.emvOverlayVisible}
                    handleClose={this.handleEmvOverlay}
                    message={this.state.cardReaderEventText}
                />
                <SearchCustomerOverlay
                    isVisible={this.state.searchCustomerOverlayVisible}
                    handleClose={this.handleSearchCustomerOverlay}
                />
            </View>
        );
    }
}