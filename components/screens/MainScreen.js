import React, { Component } from 'react';
import { View, Text } from "react-native";
import { Header } from 'react-native-elements';
import accounting from 'accounting';
import Orientation from 'react-native-orientation';
import RNAnyPay from 'react-native-any-pay';

import NumberPad from '../ui/NumberPad';
import HeaderIcon from '../ui/HeaderIcon';

import { storageGet, storageSet, removeItem} from '../../helpers/localStorage';
import { showAlert } from '../../helpers/showAlert';

import { getMerchants } from '../../api_requests/getMerchants';

import { styles } from '../styles/MainStyles';

import base64 from 'react-native-base64';


const AnyPay = RNAnyPay.AnyPay;

export default class MainScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            buttonPressed: false,
            numbersPressed: "", //Holds string of numbers pressed for manipulation in formatNumbersPressed()
            amount: "0.00",
            amountFontColor: "#fff", //Color depends if refund is selected.
            refundSelected: false, //Will need to pass this as prop to the payment screen if checked as true
            numberPadDisabled: false
        }
    }

    componentWillMount() {
        Orientation.lockToPortrait();    
        removeItem("selectedCustomerId");
    }

    async componentDidMount(){
        //TODO: Refactor this later
        let merchantId = await storageGet("merchantId");
        merchantId = JSON.parse(merchantId);
        console.log(merchantId);

        if(merchantId === null){
            merchantId = await this.getMerchantId();
        }
        merchantId = await this.getMerchantId();
               
        // let consumerKey;
        // let secret;
        //let headers = await getRequestHeader();
        //console.log(encoded);
        //test
        let headers = {
            'Authorization': 'Basic ' + encoded,
            'Content-Type': 'application/json; charset=utf-8'
        }
        //Imp getApiKeys when moving to production use merchantId in production
        //https://sandbox.api.mxmerchant.com/checkout/v3/application?merchantId=${merchantId}
        fetch(`https://api.mxmerchant.com/checkout/v3/application?merchantId=418399799`, {
            method: "GET",
            headers: headers
        }).then((response) => {
            //console.log(response)
            return response.json();
        }).then(async (json) => {
            let consumerKey = json.records[0].apiKey;
            let secret = json.records[0].apiSecret;

            try{
                if(AnyPay.verifyPermissions()){
                    AnyPay.requestPermissions();

                    await AnyPay.initializeSDK();
                    var sdkVersion = await AnyPay.getSDKVersion();
                    console.log(sdkVersion);
                   // console.log(consumerKey)
                   // console.log(secret)
                    //console.log(merchantId)
                    await AnyPay.intializeTerminal({
                        consumerKey: consumerKey,
                        secret: secret,
                        merchantId: '418399799',
                        url: 'https://api.mxmerchant.com/checkout/v3/'

                    }).catch(err => console.log(err));
                  //  console.log("HERE0101");
                }
            }
            catch(e){
                console.log(e);
            }
        });
    }
    
    //Refactored componentDidMount()
    // async componentDidMount(){
    //     let consumerKey, secret;
    //     let merchantId = await storageGet("merchantId");
    //     merchantId = JSON.parse(merchantId);
    
    //     if(merchantId === null){
    //         merchantId = await this.getMerchantId();
    //     }
    
    //     let data = await getApiKeys(merchantId);
    //     console.log(data);
    
    //     consumerKey = data.records[0].apiKey;
    //     secret = data.records[0].apiSecret;
    
    //     try{
    //         if(AnyPay.verifyPermissions()){
    //             AnyPay.requestPermissions();
    
    //             await AnyPay.initializeSDK();
    //             var sdkVersion = await AnyPay.getSDKVersion();
    //             console.log(sdkVersion);
    
    //             await AnyPay.initializeTerminal({
    //                 consumerKey: consumerKey,
    //                 secret: secret,
    //                 merchantId: merchantId,
    //                 url: 'https://api.mxmerchant.com/checkout/v3/'
    //             }).catch((e) => {
    //                 showAlert("Error!", e);
    //             });
    //         }
    //     }
    //     catch(e){
    //         showAlert("Error!", e);
    //     }
    // }

    handleNumberPadPress = (value) => {
        let newNumbersPressed = "";

        if (Number(value) >= 0) {
            this.state.numbersPressed += value;
            this.formatNumbersPressed();
        }
        else if (value === "delete") {
            newNumbersPressed = this.state.numbersPressed.substr(0, this.state.numbersPressed.length - 1); //Chops last character off of string.
            this.setState({ numbersPressed: newNumbersPressed }, () => {
                this.formatNumbersPressed();
            });
        }
        else if (value === "refund") {
            this.handleRefundChange();
        }
    }

    formatNumbersPressed = () => {
        let numsPressed = Number(this.state.numbersPressed);
        numsPressed = accounting.formatMoney(parseFloat(numsPressed) / 100);
        
        let cleaned;
        if(numsPressed.charAt(0) === "$"){
            cleaned = numsPressed.slice(1);
            cleaned = cleaned.replace(/,/g, '');
        }

        (Number(cleaned) > 99999.99)
            ? this.setState({amount: "$99,999.99", numberPadDisabled: true},)
            : this.setState({ amount: numsPressed,numberPadDisabled: false });
    }

    handleRefundChange = () => {
        (this.state.refundSelected)
            ? this.setState({ refundSelected: false, amountFontColor: "#fff" })
            : this.setState({ refundSelected: true, amountFontColor: "#E50F0F" });
    }

    handleHeaderIconPress = (iconPushed) => {
        if (iconPushed === "dollar") {
            if (Number(this.state.amount) === 0 || this.state.amount === "$0.00") {
                showAlert("Warning", "Please enter an amount before proceeding.");
            }
            else {
                this.props.navigation.navigate(
                    "Payment",
                    {
                        amountCharged: this.state.amount,
                        refundSelected: this.state.refundSelected
                    }
                );
            }
        }
        else {
            this.props.navigation.toggleDrawer()
        }
    }

    getMerchantId = async () => {
        let data = await getMerchants();
        storageSet("merchantId", data.records[0].id.toString());

        return data.records[0].id.toString();
    }

    render() {
        return (
            <View style={styles.mainContainer}>
                <View style={styles.header}>
                    <Header
                        backgroundColor="#454343"
                        leftComponent={
                            <HeaderIcon
                                name="menu"
                                type="entypo"
                                size={50}
                                handlePress={this.handleHeaderIconPress}
                                underlayColor="#454343"
                            />
                        }
                        rightComponent={
                            <HeaderIcon
                                name="dollar"
                                type="font-awesome"
                                size={50}
                                handlePress={this.handleHeaderIconPress}
                                underlayColor="#454343"
                            />
                        }
                    />
                </View>
                <View style={styles.container}>
                    <View style={styles.mainScreenTextSection}>
                        {/* Text doesn't has styles this way b/c its easier to manipulate inside the class */}
                        <Text style={{ color: this.state.amountFontColor, fontSize: 70 }}>
                            {this.state.amount}
                        </Text>
                        <Text style={styles.refundText}>
                            {this.state.refundSelected ? 'Refund' : ''}
                        </Text>
                    </View>
                    <View style={styles.numberPad}>
                        <NumberPad handlePress={this.handleNumberPadPress} isDisabled={this.state.numberPadDisabled} />
                    </View>
                </View>
            </View>
        );
    }
}