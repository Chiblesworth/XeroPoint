import React, { Component } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet } from 'react-native';
import { Header, Input, Button } from 'react-native-elements';
import HeaderIcon from './HeaderIcon';
import SwitchToggle from 'react-native-switch-toggle';
import AsyncStorage from '@react-native-community/async-storage';
import { StackActions, NavigationActions } from 'react-navigation';
import KeyedPaymentForm from './KeyedPaymentForm';

/*
    This resets the component of the main screen 
    Making the amount charged not carry over from screen to screen.
    Also resets any text inputs that were keyed in.
*/
const resetAction = StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({ routeName: 'Main' })],
  });

export default class PaymentScreen extends Component {
    constructor(props){
        super(props);

        this.state = {
            taxSwitchValue: false,
            serviceFeeSwitchValue: false,
            customers: [
            ],
            customerId: null,
            customerNumber: "",
            memo: "",
            invoice: ""
        }

        this.handleHeaderIconPress = this.handleHeaderIconPress.bind(this);
        this.toggleTaxSwitch = this.toggleTaxSwitch.bind(this);
        this.toggleServiceSwitch = this.toggleServiceSwitch.bind(this);
        this.submitPayment = this.submitPayment.bind(this);
        this.getMerchantId = this.getMerchantId.bind(this);
        this.getCustomers = this.getCustomers.bind(this);
        this.handleSelectedCustomer = this.handleSelectedCustomer.bind(this);
        this.handleSearchCustomerButton = this.handleSearchCustomerButton.bind(this);
    }

    componentDidMount() {
        this.getMerchantId();
        this.getCustomers();
    }
    
    getMerchantId() {
        AsyncStorage.getItem("merchantId").then((id) => {
            this.setState({merchantId: id});
        })
    }

    handleHeaderIconPress() {
        this.props.navigation.dispatch(resetAction);
    }

    toggleTaxSwitch() {

        this.setState({taxSwitchValue: !this.state.taxSwitchValue});
        AsyncStorage.getItem("taxFee").then((value) => {
            this.setState({tax: value});
        });
    }

    toggleServiceSwitch() {
        this.setState({serviceFeeSwitchValue: !this.state.serviceFeeSwitchValue});
        AsyncStorage.getItem("serviceFee").then((fee) => {
            this.setState({serviceFee: fee});
        });
    }

    submitPayment(stateOfForm) {
        AsyncStorage.getItem("selectedCustomerId").then((customerId) => {
            this.setState({customerId: customerId});
        });

        //console.log(this.state); //3930129
        //Use number becasue cardAccount.number has spaces in it.
        //Don't know if MX Merchant has something on their backend to take care of that.
        AsyncStorage.getItem("encodedUser").then((encoded) => {
            let headers = {
                'Authorization' : 'Basic ' + encoded,
                'Content-Type' : 'application/json; charset=utf-8'
            }

            let amount = this.props.navigation.state.params.amountCharged.replace(/[^0-9]/, ""); //Get rid of dollar sign in amount
            console.log(this.state)
            let data = {
                merchantId: stateOfForm.merchantId,
                tenderType: "Card",
                amount: amount,
                cardAccount: {
                    number: stateOfForm.number,
                    expiryMonth: stateOfForm.cardAccount.expiryMonth,
                    expiryYear: stateOfForm.cardAccount.expiryYear,
                    cvv: stateOfForm.cardAccount.cvv,
                    avsZip: stateOfForm.cardAccount.avsZip,
                    avsStreet: stateOfForm.cardAccount.avsStreet,
                },
                customer: {
                    id: this.state.customerId
                },
                customerCode: this.state.customerNumber,
                meta: this.state.memo,
                invoice: this.state.invoice

            }

            fetch("https://sandbox.api.mxmerchant.com/checkout/v3/payment", {
                method: "POST",
                headers: headers,
                body: JSON.stringify(data)
            }).then((response) => {
                console.log(response);
            }).then(() => {
                fetch("https://sandbox.api.mxmerchant.com/checkout/v3/payment", {
                    method: "GET",
                    headers: headers
                }).then((response) => {
                    console.log(response)
                    console.log(response.json());
                })
            })
        })
    }

    getCustomers() {
        /*
            Gets users current customers they have linked to account.
            Used for the searcha and add customer feature
        */
       AsyncStorage.getItem("encodedUser").then((encoded) => {
            let headers = {
                'Authorization' : 'Basic ' + encoded,
                'Content-Type' : 'application/json; charset=utf-8'
            }

            fetch("https://sandbox.api.mxmerchant.com/checkout/v3/customer", {
                method: "GET",
                headers: headers,
                qs: {merchantId: this.state.merchantId}
            }).then((response) => {
                return response.json();
            }).then((Json) => {
                let records = Json.records;

                for(let i = 0; i < records.length; i++){
                    let record = {'id': records[i].id, 'name': records[i].name};

                    this.setState({customers: [...this.state.customers, record]})
                }
            })
       })
    }

    handleSelectedCustomer() {
        AsyncStorage.getItem("selectedCustomerId").then((customerId) => {
            console.log(customerId)
        })
    }

    handleSearchCustomerButton() {
        this.getCustomers();
        //Makes duplicate list
        console.log("here")
        this.props.navigation.navigate("SearchCustomer", {
            customers: this.state.customers
        })
    }

    render(){
        const {navigate} = this.props.navigation;

        let serviceFee; 
        let tax;
        /*
            This is the only way I've been able to get AsyncStorage to work
            without causing an infinite loop. Can't get component to remount
            when new pages are added to stack. This is a quick solution for that.
        */
        if(this.state.taxSwitchValue){
            tax = <Text style={styles.feeText}>{this.state.tax}</Text>;
        }
        else{
            tax = <Text style={styles.feeText}>0</Text>;
        }

        if(this.state.serviceFeeSwitchValue){
            serviceFee = <Text style={styles.feeText}>{this.state.serviceFee}</Text>;
        }
        else{
            serviceFee = <Text style={styles.feeText}>0</Text>;
        }
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
                        <Text style={styles.simpleText}>CHARGED AMOUNT</Text>
                        <Text style={styles.amountText}>
                            {this.props.navigation.state.params.amountCharged}
                        </Text>
                    </View>
                </View>
                <ScrollView contentContainerStyle={styles.scrollView}>
                    <KeyedPaymentForm charge={this.submitPayment}/>
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
                        onChangeText={(text) => this.setState({memo: text})}
                    />
                    <Button 
                        type="solid"
                        title="Search or Add New Customer"
                        containerStyle={styles.buttonContainer}
                        buttonStyle={styles.button}
                        titleStyle={styles.customerTitle}
                        onPress={() => this.handleSearchCustomerButton()}
                    />
                    <Input
                        placeholder="Customer Number"
                        placeholderTextColor="grey"
                        inputContainerStyle={styles.inputContainer}
                        inputStyle={styles.input}
                        onChangeText={(text) => this.setState({customerNumber: text})}
                    />
                    <Input
                        placeholder="Invoice"
                        placeholderTextColor="grey"
                        inputContainerStyle={styles.inputContainer}
                        inputStyle={styles.input}
                        onChangeText={(text) => this.setState({invoice: text})}
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
        marginBottom: 25
    },
    button: {
        backgroundColor: '#C8C8C8'
    },
    buttonTitle: {
        fontSize: 25
    },
    customerTitle: {
        fontSize: 20
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