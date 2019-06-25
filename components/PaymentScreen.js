import React, { Component } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet } from 'react-native';
import { Header, Input, Button } from 'react-native-elements';
import HeaderIcon from './HeaderIcon';
import SwitchToggle from 'react-native-switch-toggle';
import AsyncStorage from '@react-native-community/async-storage';

export default class PaymentScreen extends Component {
    constructor(props){
        super(props);

        this.state = {
            amountCharged: this.props.navigation.state.params.amountCharged,
            taxSwitchValue: false,
            serviceFeeSwitchValue: false,
            serviceFee: "0",
            tax: "0"
        }

        this.handleHeaderIconPress = this.handleHeaderIconPress.bind(this);
        this.toggleTaxSwitch = this.toggleTaxSwitch.bind(this);
        this.toggleServiceSwitch = this.toggleServiceSwitch.bind(this);
    }

    handleHeaderIconPress() {
        this.props.navigation.navigate("Main");
    }

    toggleTaxSwitch(){
        this.setState({taxSwitchValue: !this.state.taxSwitchValue});
    }

    toggleServiceSwitch(){
        this.setState({serviceFeeSwitchValue: !this.state.serviceFeeSwitchValue});
    }

    render(){
        AsyncStorage.getItem("taxFee").then((value) => {
            this.setState({tax: value});
        });
        AsyncStorage.getItem("serviceFee").then((fee) => {
            this.setState({serviceFee: fee});
        });

        const serviceFee = <Text style={styles.feeText}>{this.state.serviceFee}</Text>;
        const tax = <Text style={styles.feeText}>{this.state.tax}</Text>
       
        return (
            <View style={styles.mainContainer}>
                <View stlye={styles.header}>
                    <Header 
                        leftComponent={
                            <HeaderIcon 
                                name="chevron-left"
                                type="entypo"
                                size={70}
                                handlePress={this.handleHeaderIconPress}
                            /> 
                        }
                        backgroundColor='#808080'
                        containerStyle={{ borderBottomWidth: 0 }}
                    />
                </View>
                <View style={styles.container}>
                    <View style={styles.mainScreenTextSection}>
                        <Text style={styles.simpleText}>CHARGE AMOUNT</Text>
                        <Text style={styles.amountText}>
                            {this.state.amountCharged}
                        </Text>
                    </View>
                </View>
                <ScrollView contentContainerStyle={styles.scrollView}>
                    <Input 
                        placeholder="1234 5678 9012 3..."
                        placeholderTextColor="grey"
                        leftIcon={{type: 'entypo', name: 'credit-card', size: 25, color: 'gray'}}
                        inputContainerStyle={styles.inputContainer}
                        inputStyle={styles.input}
                        keyboardType="numeric"
                    />
                    <Button 
                        type="solid"
                        title="Charge"
                        containerStyle={styles.buttonContainer}
                        titleStyle={styles.buttonTitle}
                    />
                    <Button 
                        type="solid"
                        title="Connect Card Reader"
                        containerStyle={styles.buttonContainer}
                        buttonStyle={styles.button}
                        titleStyle={styles.buttonTitle}
                    />
                    {/* Had to make a TextInput here because react
                    native elements doesn't support a textarea  */}
                    <TextInput
                        style={styles.textarea}
                        multiline={true}
                        numberOfLines={4}
                        placeholder="Memo/Note"
                        placeholderTextColor="grey"
                    />
                    <Input
                        placeholder="Search or Add New Customer"
                        placeholderTextColor="grey"
                        inputContainerStyle={styles.inputContainer}
                        inputStyle={styles.input}
                    />
                    <Input
                        placeholder="Customer Number"
                        placeholderTextColor="grey"
                        inputContainerStyle={styles.inputContainer}
                        inputStyle={styles.input}
                    />
                    <Input
                        placeholder="Invoice"
                        placeholderTextColor="grey"
                        inputContainerStyle={styles.inputContainer}
                        inputStyle={styles.input}
                    />
                    <View style={styles.row}>
                        <Text style={{fontSize: 20, color: 'white', paddingRight: 10}}>
                            Tax Exempt
                        </Text>
                        <SwitchToggle
                            switchOn={this.state.taxSwitchValue}
                            onPress={this.toggleTaxSwitch}
                            circleColorOff="white"
                            circleColorOn="white"
                            backgroundColorOn="blue"
					    />
                        <View style={styles.feeContainer}>
                            {tax}
                            <Text style={styles.feeText}>%</Text>
                        </View>
                    </View>
                    <View style={styles.row}>
                        <Text style={{fontSize: 20, color: 'white', paddingRight: 10}}>
                            Service Fee
                        </Text>
                        <SwitchToggle
                            switchOn={this.state.serviceFeeSwitchValue}
                            onPress={this.toggleServiceSwitch}
                            circleColorOff="white"
                            circleColorOn="white"
                            backgroundColorOn="blue"
					    />
                        <View style={styles.feeContainer}>
                            {serviceFee}
                            <Text style={styles.feeText}>%</Text>
                        </View>
                    </View>
                </ScrollView>
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
    header: {
        width: '100%',
        height: 70
    },
    container: {
		justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#808080'
    },
    mainScreenTextSection: {
        marginBottom: 15,
        alignItems: 'center',
    },
    simpleText: {
        fontSize: 30,
        color: 'white'
    },
    amountText: {
        fontSize: 70,
        color: 'white'
    },
    scrollView: {
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 25,
        marginRight: 25
    },
    inputContainer: {
        marginBottom: 15,
        borderStyle: 'solid',
        borderColor: 'black',
        borderRadius: 25,
        backgroundColor: 'white'
    },
    input: {
        paddingLeft: 20,
        fontSize: 20
    },
    buttonContainer: {
        width: '92%',
        height: 40,
        marginBottom: 20
    },
    button: {
        backgroundColor: '#C8C8C8'
    },
    buttonTitle: {
        fontSize: 25
    },
    textarea: {
        width: '93%',
        marginBottom: 10,
        borderStyle: 'solid',
        borderColor: 'black',
        borderRadius: 25,
        justifyContent: 'flex-start',
        backgroundColor: 'white',
        fontSize: 20
    },
    row: {
        flex: 1,
        flexDirection: 'row',
        width: '100%',
        marginBottom: 25
    },
    bottomContainer: {
        borderStyle: 'solid',
        borderColor: 'black',
        borderRadius: 25,
        backgroundColor: 'white',
        width: '45%'
    },
    bottomButtonContainer: {
        width: '45%',
        height: 10,
        paddingLeft: 10
    },
    feeText: {
        fontSize: 25, 
        color: 'white',
    },
    feeContainer: {
        flexDirection: 'row',
        marginLeft: 50
    },
});