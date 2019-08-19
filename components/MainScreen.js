import React, { Component } from 'react';
import { View, Text, Alert, StyleSheet } from "react-native";
import NumberPad from './NumberPad';
import accounting from 'accounting';
import { Header } from 'react-native-elements';
import HeaderIcon from './HeaderIcon';
import { storageGet, storageSet } from './localStorage';
import AsyncStorage from '@react-native-community/async-storage';
import Orientation from 'react-native-orientation';


export default class MainScreen extends Component {
    constructor(props){
        super(props);

        this.state = {
            buttonPressed: false,
            numbersPressed: "", //Holds string of numbers pressed for manipulation in formatNumbersPressed()
            amount: "0.00",
            amountFontColor: "white", //Color depends if refund is selected.
            refundSelected: false //Will need to pass this as prop to the payment screen if checked as true
        }

        this.handleNumberPadPress = this.handleNumberPadPress.bind(this);
        this.formatNumbersPressed = this.formatNumbersPressed.bind(this);
        this.handleRefundChange = this.handleRefundChange.bind(this);
        this.handleHeaderIconPress = this.handleHeaderIconPress.bind(this);
        this.showAlert = this.showAlert.bind(this);
        this.checkDefaults = this.checkDefaults.bind(this);
        this.getMerchantId = this.getMerchantId.bind(this);
    }

    componentDidMount(){
        Orientation.lockToPortrait();
        this.getMerchantId();
    }

    handleNumberPadPress(valueGotBack) {
        let newNumbersPressed = "";

        if(Number(valueGotBack) >= 0){
            this.state.numbersPressed += valueGotBack;

            this.formatNumbersPressed();
        }
        else if(valueGotBack === "delete"){
            //Chops last character off of string.
            newNumbersPressed = this.state.numbersPressed.substr(0, this.state.numbersPressed.length - 1);

            this.setState({numbersPressed: newNumbersPressed}, () => {
                this.formatNumbersPressed();
            })
        }
        else if(valueGotBack === "refund"){
            this.handleRefundChange();
        }
    }

    formatNumbersPressed() {
        let numsPressed = Number(this.state.numbersPressed);

        numsPressed = accounting.formatMoney(parseFloat(numsPressed) / 100);
        
        this.setState({amount: numsPressed});
    }

    handleRefundChange() {
        if(this.state.refundSelected){
            this.setState({refundSelected: false, amountFontColor: "white"});
        }
        else{
            this.setState({refundSelected: true, amountFontColor: "red"});
        }
    }

    handleHeaderIconPress(iconPushed) {
        if(iconPushed === "dollar"){
            if(Number(this.state.amount) === 0 || this.state.amount === "$0.00"){
                this.showAlert();
            }
            else{
                this.checkDefaults();
                this.props.navigation.navigate(
                    "Payment",
                    {amountCharged: this.state.amount}
                );
            }
        }
        else{
            this.props.navigation.toggleDrawer()
        }
    }

    showAlert() {
        Alert.alert(
            "Warning",
            "Please enter an amount before proceeding."
        );
    }

    async checkDefaults() {
        //This is used to check if default fee values exist, else it sets defaults.
        let key;
        let serviceFee = await storageGet("serviceFee");
        let taxFee = await storageGet("taxFee");

        if(serviceFee === null){
            key = "serviceFee";
            storageSet(key, 5);
        }
        if(taxFee === null){
            key = "taxFee";
            storageSet(key, 10);
        }
    }

    getMerchantId() {       //FIX API CALL ASYNC  
        AsyncStorage.getItem("encodedUser").then((encoded) => {
            let headers = {
                'Authorization' : 'Basic ' + encoded,
                'Content-Type' : 'application/json; charset=utf-8'
            }

            fetch("https://sandbox.api.mxmerchant.com/checkout/v3/merchant", {
                method: 'get',
                headers: headers
            }).then((response) => {
                return response.json(); //Get response into JSON format
            }).then((Json) => {
                let merchantId = Json.records[0].id.toString();

                AsyncStorage.setItem("merchantId", merchantId);
            });
        });
    }

    render() {
        return (
            <View style={styles.mainContainer}>
                <View style={styles.header}>
                    <Header 
                        backgroundColor="#808080"
                        leftComponent={
                            <HeaderIcon 
                                name="menu"
                                type="entypo"
                                size={70}
                                handlePress={this.handleHeaderIconPress} 
                            />
                        }
                        rightComponent={
                            <HeaderIcon 
                                name="dollar"
                                type="font-awesome"
                                size={65}
                                handlePress={this.handleHeaderIconPress}
                            />
                        }
                    />
                </View>
                <View style={styles.container}>
                    <View style={styles.mainScreenTextSection}>
                        {/* Text doesn't has styles this way b/c its easier to manipulate inside the class */}
                        <Text style={{color: this.state.amountFontColor, fontSize: 70}}>
                            {this.state.amount}
                        </Text>
                        <Text style={styles.refundText}>
                            {this.state.refundSelected ? 'Refund' : ''}
                        </Text>
                    </View>
                    <View style={styles.numberPad}>
                        <NumberPad handlePress={this.handleNumberPadPress}/>
                    </View>
                </View>
            </View>
        );
    }
}

//Styles
const styles = StyleSheet.create({
    mainContainer: {
        height: '100%',
        backgroundColor: '#808080'
    },
    container: {
		justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#808080'
    },
    header: {
        width: '100%',
        height: 70
    },
    mainScreenTextSection: {
        marginBottom: 15
    },
    refundText: {
        color: 'red',
        fontSize: 15
    },
    icon: {
        color: 'white'
    },
    numberPad: {
        color: 'white'
    }
});