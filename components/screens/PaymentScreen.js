import React, { Component } from 'react';
import { View, Text, TextInput, ScrollView, NativeEventEmitter } from 'react-native';
import { Header, Input, Button } from 'react-native-elements';
import Orientation from 'react-native-orientation';
import RNAnyPay from 'react-native-any-pay';
import { StackActions, NavigationActions } from 'react-navigation';
import base64 from 'react-native-base64';

import HeaderIcon from '../ui/HeaderIcon';
import KeyedPaymentForm from '../ui/KeyedPaymentForm';
import FeeSwitch from '../ui/FeeSwitch';

import CreateCustomerOverlay from '../overlays/CreateCustomerOverlay';
import SearchCustomerOverlay from '../overlays/SearchCustomerOverlay';
import AuthorizationOverlay from '../overlays/AuthorizationOverlay';
import EmvProcessOverlay from '../overlays/EmvProcessOverlay';
import ConnectReaderOverlay from '../overlays/ConnectReaderOverlay';

import { postPayment } from '../../api_requests/postPayment';

import { feeCalculations } from '../../helpers/feeCalculations';
import { getRequestHeader } from '../../helpers/getRequestHeader';
import { storageGet, storageSet } from '../../helpers/localStorage';
import { convertMilitaryToStandardTime } from '../../helpers/dateFormats';
import { showAlert } from '../../helpers/showAlert';

import { styles } from '../styles/PaymentStyles';

const AnyPay = RNAnyPay.AnyPay;
const eventEmitter = new NativeEventEmitter(RNAnyPay.AnyPay);
var transaction = null;

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
            amountCharged: this.props.navigation.state.params.amountCharged.replace(/[^0-9 || ,]/, ""),
            cardReaderConnected: false,
            cardReaderEventText: "",
            taxSwitchValue: false,
            serviceFeeSwitchValue: false,
            invoice: null,
            memo: null,
            tax: 0,
            serviceFee: 0,
            authorizationOverlayVisible: false,
            authorizationTitle: "",
            formatedDate: "",
            formatedTime: "",
            authCode: null,
            tipAdjustmentData: null,
            createCustomerOverlayVisible: false,
            emvOverlayVisible: false,
            searchCustomerOverlayVisible: false,
            connectReaderOverlayVisible: false
        }
    }

    async componentDidMount() {
        console.log("Props");
        console.log(this.props.navigation.state.params.amountCharged);
        console.log("State");
        console.log(this.state.amountCharged);

        Orientation.lockToPortrait();
        let taxFee = await storageGet("taxFee");
        let serviceFee = await storageGet("serviceFee");
        let collectServiceFee = await storageGet("collectServiceFee");
        let collectTaxFee = await storageGet("collectTaxFee");
        let connected = await AnyPay.isReaderConnected();

        // Give default values
        if (taxFee === null) {
            storageSet("taxFee", "10");
            taxFee = 5;
        }

        if (serviceFee === null) {
            storageSet("serviceFee", "5");
            serviceFee = 5;
        }

        if (collectTaxFee === null) {
            storageSet("collectTaxFee", "false");
            collectTaxFee = false;
        }

        if (collectServiceFee === null) {
            storageSet("collectTaxFee", "true");
            collectServiceFee = true;
        }

        collectServiceFee = JSON.parse(collectServiceFee);
        collectTaxFee = JSON.parse(collectTaxFee);

        this.cardReaderEventListener = eventEmitter.addListener('CardReaderEvent', this.handleCardReaderEvent.bind(this));
        this.cardReaderConnectedListener = eventEmitter.addListener('CardReaderConnected', this.handleCardReaderConnect.bind(this));
        this.cardReaderDisconnectedListener = eventEmitter.addListener('CardReaderDisconnected', this.handleCardReaderDisconnect.bind(this));
        this.cardReaderErrorListener = eventEmitter.addListener('CardReaderError', this.handleCardReaderError.bind(this));

        (this.props.navigation.state.params.refundSelected)
            ? this.setState({ serviceFeeSwitchValue: false, taxSwitchValue: false, cardReaderConnected: connected, tax: taxFee, serviceFee: serviceFee })
            : this.setState({ serviceFeeSwitchValue: collectServiceFee, taxSwitchValue: collectTaxFee, cardReaderConnected: connected, tax: taxFee, serviceFee: serviceFee });
    }

    componentWillUnmount() {
        this.cardReaderConnectedListener.remove();
        this.cardReaderDisconnectedListener.remove();
        this.cardReaderEventListener.remove();
        this.cardReaderErrorListener.remove();
    }

    handleCardReaderEvent = (event) => {
        if (event.detail != "Approved") {
            this.setState({ cardReaderEventText: (event.detail === null) ? event.message : event.detail });
        }
    }

    handleCardReaderConnect = (event) => {
        AnyPay.isReaderConnected().then((connected) => {
            this.setState({
                cardReaderConnected: connected,
                connectReaderOverlayVisible: false
            });
        });
    }

    handleCardReaderDisconnect = (event) => {
        AnyPay.isReaderConnected().then((connected) => {
            this.setState({ cardReaderConnected: connected });
        });
    }

    handleCardReaderError = (event) => {
        this.setState({cardReaderEventText: (event.detail === null) ? event.message : event.detail})
    }

    handleHeaderIconPress = () => {
        this.props.navigation.dispatch(resetAction);
    }

    handleSearchCustomerButton = () => {
        this.props.navigation.navigate("SearchCustomer");
    }

    handleConnectReaderPress = async () => {
        (this.state.cardReaderConnected)
            ? AnyPay.disconnectReader()
            : this.handleConnectReaderOverlay();
    }

    handleConnectReaderOverlay = () => {
        this.setState({ connectReaderOverlayVisible: !this.state.connectReaderOverlayVisible });
    }

    handleCreateCustomerOverlay = () => {
        this.setState({ createCustomerOverlayVisible: !this.state.createCustomerOverlayVisible });
    }

    handleSearchCustomerOverlay = () => {
        this.setState({ searchCustomerOverlayVisible: !this.state.searchCustomerOverlayVisible });
    }

    handleEmvOverlay = () => {
        this.setState({ emvOverlayVisible: !this.state.emvOverlayVisible });
    }

    handleCreatedPayment = async (createdPayment) => {
        console.log(createdPayment);
        let createdDate = new Date(createdPayment.created);
        let dateCreated = createdDate.toDateString();
        let timeCreated = createdDate.toTimeString();
        let authCode, tipAdjustmentData;

        timeCreated = timeCreated.split(" ");
        timeCreated = convertMilitaryToStandardTime(timeCreated[0], true);

        if (createdPayment.status === "Approved") {
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
        
        // let selectedCustomerId = await storageGet("selectedCustomerId");
        // (!!selectedCustomerId)
        //     ? selectedCustomerId = Number(selectedCustomerId)
        //     : selectedCustomerId = null

        // if(selectedCustomerId !== null){
        //     let headers = {
        //         'Authorization': 'Basic ' + encoded,
        //         'Content-Type': 'application/json; charset=utf-8'
        //     }
        //     let data = {
        //         magstripe: createdPayment.cardAccount.emvData
        //     }

        //     fetch(`https://api.mxmerchant.com/checkout/v3/customercardaccount?id=${selectedCustomerId}&echo=true`, {
        //         method: "POST",
        //         headers: headers,
        //         body: JSON.stringify(data)
        //     }).then((response) => {
        //         console.log(response.json());
        //     });
        // }

        this.handleAuthorizationOverlay(createdPayment.status);
    }

    handleAuthorizationOverlay = (status) => {
        if (this.state.emvOverlayVisible) {
            // Removes EMV overlay so not visible when this overlay appears.
            this.setState({ emvOverlayVisible: !this.state.emvOverlayVisible });
        }

        if (this.state.authorizationOverlayVisible) {
            this.setState({ authorizationOverlayVisible: !this.state.authorizationOverlayVisible });
            console.log("HERE in handleAuthOVerlay");
            console.log(status);
            if (status === "Approved") {
                (this.props.navigation.state.params.refundSelected)
                    ? this.props.navigation.dispatch(resetAction)
                    : this.props.navigation.navigate("Signature", { tipAdjustmentData: this.state.tipAdjustmentData });
            }
        }
        else {
            this.setState({
                authorizationOverlayVisible: !this.state.authorizationOverlayVisible,
                authorizationTitle: status
            });
        }
    }

    toggleSwitch = (switchHit) => {
        (switchHit === "Service Fee")
            ? this.setState({ serviceFeeSwitchValue: !this.state.serviceFeeSwitchValue })
            : this.setState({ taxSwitchValue: !this.state.taxSwitchValue }) ;
    }

    startPaymentProcess = (cardAccount) => {
        (this.state.cardReaderConnected)
            ? this.startEmv()
            : this.authorizePayment(cardAccount);
    }

    startEmv = async () => {
        try {
            let emvTransactionType, emvTransactionAmount;

            if (this.props.navigation.state.params.refundSelected) {
                emvTransactionType = "REFUND";
                emvTransactionAmount = this.state.amountCharged;
            }
            else {
                emvTransactionType = "SALE";
                emvTransactionAmount = this.state.amountCharged;
            }

            let selectedCustomerId = await storageGet("selectedCustomerId");
            let selectedCustomerName =  await storageGet("selectedCustomerName");

            (!!selectedCustomerName)
                ? selectedCustomerName = selectedCustomerName
                : selectedCustomerName = null;

            // console.log(selectedCustomerId);
            // selectedCustomerId = selectedCustomerId.toString();
           // console.log(selectedCustomerId);

           console.log(selectedCustomerName);
            selectedCustomerName = selectedCustomerName.toString();
        //    console.log(selectedCustomerName);

            //Will need to invoice, memo and customer fields somehow
            //Simple work around could be to pass them to the next screen and add them with the PUT the same way for the TIP!
            var emvObj = {
                type: emvTransactionType,
                totalAmount: emvTransactionAmount,
                currency: 'USD',
                customFields: {
                    meta: this.state.memo,
                    invoice: this.state.invoice,
                    customerName: selectedCustomerName,
                    // customer: {
                    //     id: selectedCustomerId,
                    // }
                }
            }

            if(!!selectedCustomerId){
                selectedCustomerId = selectedCustomerId.toString();
                // emvObj.customFields.customer = {
                //     id: selectedCustomerId
                // }
                emvObj.customFields["customer.id"] = selectedCustomerId;
            }
            console.log(emvObj);

            this.handleEmvOverlay();

            transaction = await AnyPay.startEMVTransaction(emvObj).catch((e) => {
                showAlert("EMV Payment Error!", e);
            });
            console.log(transaction);
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
            //     console.log(transaction);
        }
        catch (e) {
            showAlert("EMV Payment Error!", e);
        }
    }

    authorizePayment = async (cardAccount) => {
        let merchantId = await storageGet("merchantId");
        let selectedCustomerId = await storageGet("selectedCustomerId");
        let amount;


        (this.props.navigation.state.params.refundSelected)
            ? amount = -Math.abs(this.determineAmount())
            : amount = this.determineAmount();

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
            meta: this.state.memo,
            invoice: this.state.invoice
        }

        if(!!selectedCustomerId){
            selectedCustomerId = Number(selectedCustomerId);
            data.customer = {
                id: selectedCustomerId
            }
        }
        console.log(data);

        let createdPayment = await postPayment(data);
        console.log(createdPayment);

        this.handleCreatedPayment(createdPayment);
    }

    determineAmount = () => {
        let amount = 0;
        let amountChargedWithoutCommas = parseFloat(this.state.amountCharged.replace(/,/g, "")); // Fixes an issue where numbers over $1000 weren't displaying because of the comma within string

        if (this.state.taxSwitchValue && this.state.serviceFeeSwitchValue) {
            amount = feeCalculations(feeCalculations(Number(amountChargedWithoutCommas), this.state.tax), this.state.serviceFee); //Tax fee is applied first.
        }
        else if (this.state.taxSwitchValue && !this.state.serviceFeeSwitchValue) {
            amount = feeCalculations(Number(amountChargedWithoutCommas), this.state.tax);
        }
        else if (!this.state.taxSwitchValue && this.state.serviceFeeSwitchValue) {
            amount = feeCalculations(Number(amountChargedWithoutCommas), this.state.serviceFee)
        }
        else {
            amount = amountChargedWithoutCommas;
        }

        amount = parseFloat(Math.round(amount * 100) / 100).toFixed(2);
        
        console.log("amount is ");
        console.log(amount);
        return amount;
    }

    connectViaAudio = () => {
        AnyPay.connectAudioReader();
        this.handleConnectReaderOverlay();
    }

    connectViaBluetooth = () => {
        AnyPay.connectBluetoothReader();
    }

    render() {
        let serviceFee, tax, text, textColor;

        (this.state.taxSwitchValue)
            ? tax = this.state.tax
            : tax = 0;

        (this.state.serviceFeeSwitchValue)
            ? serviceFee = this.state.serviceFee
            : serviceFee = 0;

        if (this.props.navigation.state.params.refundSelected) {
            text = "REFUND";
            textColor = "#E50F0F";
        }
        else {
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
                            underlayColor="#454343"
                        />
                    }
                />
                <View style={styles.chargedContainer}>
                    <Text style={[styles.text, { color: textColor }]}>{text} AMOUNT</Text>
                    <Text style={[styles.amountText, { color: textColor }]}>
                        ${this.determineAmount()}
                    </Text>
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
                        swtichTitle="Tax       "
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
                    visible={this.state.authorizationOverlayVisible}
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
                <ConnectReaderOverlay
                    isVisible={this.state.connectReaderOverlayVisible}
                    handleClose={this.handleConnectReaderOverlay}
                    AnyPay={RNAnyPay.AnyPay}
                    connectAudioReader={this.connectViaAudio}
                    connectBluetoothReader={this.connectViaBluetooth}
                />
            </View>
        );
    }
}