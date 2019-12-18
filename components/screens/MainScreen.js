import React, { Component } from 'react';
import { View, Text } from "react-native";
import { Header } from 'react-native-elements';
import accounting from 'accounting';
import Orientation from 'react-native-orientation';
import RNAnyPay from 'react-native-any-pay';

import NumberPad from '../NumberPad';
import HeaderIcon from '../HeaderIcon';

import { storageGet, storageSet} from '../../helpers/localStorage';
import { checkDefaultStorageValues } from '../../helpers/checkDefaultStorageValues';
import { showAlert } from '../../helpers/showAlert';
import { getRequestHeader } from '../../helpers/getRequestHeader';

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
            refundSelected: false //Will need to pass this as prop to the payment screen if checked as true
        }

        this.handleNumberPadPress = this.handleNumberPadPress.bind(this);
        this.formatNumbersPressed = this.formatNumbersPressed.bind(this);
        this.handleRefundChange = this.handleRefundChange.bind(this);
        this.handleHeaderIconPress = this.handleHeaderIconPress.bind(this);
        this.checkDefaults = this.checkDefaults.bind(this);
        this.getMerchantId = this.getMerchantId.bind(this);
    }

    async componentWillMount() {
        await checkDefaultStorageValues();
        Orientation.lockToPortrait();
        this.getMerchantId();       
        
    }

    async componentDidMount(){
        let merchantId = await storageGet("merchantId");
        // let consumerKey;
        // let secret;
        //let headers = await getRequestHeader();
        //console.log(encoded);
        let headers = {
            'Authorization': 'Basic ' + encoded,
            'Content-Type': 'application/json; charset=utf-8'
        }

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

    handleNumberPadPress(value) {
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

    formatNumbersPressed() {
        let numsPressed = Number(this.state.numbersPressed);
        numsPressed = accounting.formatMoney(parseFloat(numsPressed) / 100);

        this.setState({ amount: numsPressed });
    }

    handleRefundChange() {
        (this.state.refundSelected)
            ? this.setState({ refundSelected: false, amountFontColor: "white" })
            : this.setState({ refundSelected: true, amountFontColor: "red" });
    }

    handleHeaderIconPress(iconPushed) {
        if (iconPushed === "dollar") {
            if (Number(this.state.amount) === 0 || this.state.amount === "$0.00") {
                showAlert("Warning", "Please enter an amount before proceeding.");
            }
            else {
                this.checkDefaults();
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

    async checkDefaults() {
        //This is used to check if default fee values exist, else it sets defaults.
        let key;
        let serviceFee = await storageGet("serviceFee");
        let taxFee = await storageGet("taxFee");

        if (serviceFee === null) {
            key = "serviceFee";
            storageSet(key, 5);
        }
        if (taxFee === null) {
            key = "taxFee";
            storageSet(key, 10);
        }
    }

    async getMerchantId() {
        let data = await getMerchants();
        storageSet(data.records[0].id.toString());
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
                            />
                        }
                        rightComponent={
                            <HeaderIcon
                                name="dollar"
                                type="font-awesome"
                                size={50}
                                handlePress={this.handleHeaderIconPress}
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
                        <NumberPad handlePress={this.handleNumberPadPress} />
                    </View>
                </View>
            </View>
        );
    }
}