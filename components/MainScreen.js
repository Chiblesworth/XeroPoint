import React, { Component } from 'react';
import { View, Text, Button, StyleSheet } from "react-native";
import NumberPad from './NumberPad';
import accounting from 'accounting';
import { thisExpression } from '@babel/types';

//Am going to need to find a way have number pad communicate with the main text on screen
export default class MainScreen extends Component {
    constructor(props){
        super(props);

        this.state = {
            buttonPressed: false,
            numbersPressed: "",
            amount: "0.00",
            amountFontColor: "gray", //Color depends if refund is selected.
            refundSelected: false
        }

        this.handleButtonPress = this.handleButtonPress.bind(this);
        this.formatNumbersPressed = this.formatNumbersPressed.bind(this);
        this.handleRefundChange = this.handleRefundChange.bind(this);
    }

    static navigationOptions = {
	};

    handleButtonPress(valueGotBack){
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
        let formattedAmount = 0;
        let numsPressed = Number(this.state.numbersPressed);

        numsPressed = accounting.formatMoney(parseFloat(numsPressed) / 100);
        
        this.setState({amount: numsPressed});
    }

    handleRefundChange(){
        if(this.state.refundSelected){
            this.setState({refundSelected: false, amountFontColor: "gray"});
        }
        else{
            this.setState({refundSelected: true, amountFontColor: "red"});
        }
    }

    render() {
        const {navigate} = this.props.navigation;
        
        return (
            <View style={styles.container}>
                <View style={styles.mainScreenTextSection}>
                    {/* Text doesn't has styles this way b/c its easier to manipulate inside the class */}
                    <Text style={{color: this.state.amountFontColor, fontSize: 70}}>
                        {this.state.amount}
                    </Text>
                </View>
                <View style={styles.numberPad}>
                    <NumberPad handlePress={this.handleButtonPress}/>
                </View>
            </View>
        );
    }
}

//Styles
const styles = StyleSheet.create({
    container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
    },
    mainScreenTextSection: {
        marginTop: 50
    },
    numberPad: {
        marginTop: 60
    }
});