import React, { Component } from 'react';
import { View, Text, Alert, StyleSheet } from "react-native";
import NumberPad from './NumberPad';
import accounting from 'accounting';
import { Header } from 'react-native-elements';
import HeaderIcon from './HeaderIcon';
import AwesomeAlert from 'react-native-awesome-alerts';

export default class MainScreen extends Component {
    constructor(props){
        super(props);

        this.state = {
            buttonPressed: false,
            numbersPressed: "",
            amount: "0.00",
            amountFontColor: "white", //Color depends if refund is selected.
            refundSelected: false
        }

        this.handleNumberPadPress = this.handleNumberPadPress.bind(this);
        this.formatNumbersPressed = this.formatNumbersPressed.bind(this);
        this.handleRefundChange = this.handleRefundChange.bind(this);
        this.handleHeaderIconPress = this.handleHeaderIconPress.bind(this);
        this.showAlert = this.showAlert.bind(this);
    }

    handleNumberPadPress(valueGotBack){
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

    formatNumbersPressed(){
        let numsPressed = Number(this.state.numbersPressed);

        numsPressed = accounting.formatMoney(parseFloat(numsPressed) / 100);
        
        this.setState({amount: numsPressed});
    }

    handleRefundChange(){
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
                this.props.navigation.navigate(
                    "Payment",
                    {amountCharged: this.state.amount}
                );
            }
        }
    }

    showAlert() {
        Alert.alert(
            "Warning",
            "Please enter an amount before proceeding."
        );
    }

    render() {
        const {navigate} = this.props.navigation;
        
        return (
            <View style={styles.mainContainer}>
                <View style={styles.header}>
                    <Header backgroundColor="#808080">
                        <HeaderIcon 
                            name="menu"
                            type="entypo"
                            size={70}
                            handlePress={this.handleHeaderIconPress} 
                        />
                        {/*Text tag is here because header needs a center component*/}
                        <Text></Text>
                        <HeaderIcon 
                            name="dollar"
                            type="font-awesome"
                            size={70}
                            handlePress={this.handleHeaderIconPress}
                        />
                    </Header>
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