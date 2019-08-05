import React, { Component } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, Alert } from 'react-native';
import { Header, Input, Button } from 'react-native-elements';
import HeaderIcon from './HeaderIcon';
import SwitchToggle from 'react-native-switch-toggle';
import AsyncStorage from '@react-native-community/async-storage';
import { StackActions, NavigationActions } from 'react-navigation';
import KeyedPaymentForm from './KeyedPaymentForm';
import { feeCalculations } from './feeCalculations';


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
            amountCharged: this.props.navigation.state.params.amountCharged.replace(/[^0-9]/, ""),
            taxSwitchValue: false,
            serviceFeeSwitchValue: false,
            customers: [
            ],
            customerId: null,
            customerNumber: "",
            memo: "",
            invoice: "",
            tax: 0,
            serviceFee: 0
        }

        //These values will be set when the component mounts and will render based on switches
        this.amountWithTax = 0;
        this.amountWithService = 0;
        this.amountWithBoth = 0;
        
        /*
            These will be used as form logging how much taxes and fees the user
            collected in the day if we go that route. Waiting on Mr. Hess
            This will also be used for a combined total if both switches are true
        */
        this.taxDollarAmount = 0;
        this.serviceDollarAmount = 0;

        this.handleHeaderIconPress = this.handleHeaderIconPress.bind(this);
        this.handleSwitchPress = this.handleSwitchPress.bind(this);
        this.toggleTaxSwitch = this.toggleTaxSwitch.bind(this);
        this.toggleServiceSwitch = this.toggleServiceSwitch.bind(this);
        this.submitPayment = this.submitPayment.bind(this);
        this.getMerchantId = this.getMerchantId.bind(this);
        this.getCustomers = this.getCustomers.bind(this);
        this.handleSearchCustomerButton = this.handleSearchCustomerButton.bind(this);
        this.showAlert = this.showAlert.bind(this);
    }

    componentDidMount() {
        this.getMerchantId();

        let amountCharged = this.state.amountCharged; //Removes dollar sign
        amountCharged = Number(amountCharged); //Makes sure it is a number being sent
        
        AsyncStorage.getItem("taxFee").then((value) => {
            this.setState({tax: value}, () => {
                this.amountWithTax = feeCalculations(amountCharged, value);
                console.log(this.amountWithTax);
            });
        });
        AsyncStorage.getItem("serviceFee").then((fee) => {
            this.setState({serviceFee: fee}, () => {
                this.amountWithService = feeCalculations(amountCharged, fee);
                this.amountWithBoth = feeCalculations(this.amountWithTax, fee);
                console.log(this.amountWithService);
                console.log(this.amountWithBoth);
            });
        });
    }
    
    getMerchantId() {
        AsyncStorage.getItem("merchantId").then((id) => {
            this.setState({merchantId: id});
        })
    }

    handleHeaderIconPress() {
        this.props.navigation.dispatch(resetAction);
    }

    async handleSwitchPress(switchHit) { //Using async here so values are being read as switched at the right times
        if(switchHit === "tax"){
            await this.toggleTaxSwitch();
        }
        else{
            await this.toggleServiceSwitch();
        }
    }

    toggleTaxSwitch() {
        this.setState({taxSwitchValue: !this.state.taxSwitchValue});
    }

    toggleServiceSwitch() {
        this.setState({serviceFeeSwitchValue: !this.state.serviceFeeSwitchValue});
    }

    submitPayment(stateOfForm) {
        AsyncStorage.getItem("selectedCustomerId").then((customerId) => {
            this.setState({customerId: customerId});
        });

        console.log(stateOfForm);
        //Use number becasue cardAccount.number has spaces in it.
        //Don't know if MX Merchant has something on their backend to take care of that.
        if(stateOfForm.number === "" && stateOfForm.cardAccount.expiryMonth === "" && stateOfForm.cardAccount.expiryYear === ""){
            console.log("Number and month and year is blank");
            this.showAlert();
        }
        else if(stateOfForm.streetOn === true && stateOfForm.cardAccount.avsStreet === ""){
            console.log("Street is blank");
            this.showAlert();
        }
        else if(stateOfForm.zipOn === true && stateOfForm.cardAccount.avsZip === ""){
            console.log("Zip is blank");
            this.showAlert();
        }
        else if(stateOfForm.cvvOn === true && stateOfForm.cardAccount.cvv === ""){
            console.log("CVV is blank");
            this.showAlert();
        }
        else{
            console.log("All fields filled out")
        }
    }

    showAlert() {
        Alert.alert(
            "Incomplete Fields",
            'Please fill out all fields above the "Charge" button to continue.'
        );
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
                    
                    this.setState(prevState => ({
                        customers: [...prevState.customers, record]
                    }));
                }

                this.props.navigation.navigate("SearchCustomer", {
                    customers: this.state.customers
                });

                //Used to get rid of duplicate lists of customers being made when 
                //search for customer button clicked multiple times in one session
                this.setState({customers: []}); 
            })
       })
    }

    handleSearchCustomerButton() {
        this.getCustomers();
    }

    render(){
        let serviceFee; 
        let tax;
        let amountCharged;
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

        //Probably not the best way but deals with rendering the total amount on screen
        if(this.state.taxSwitchValue && this.state.serviceFeeSwitchValue){
            amountCharged = this.amountWithBoth;
        }
        else if(this.state.taxSwitchValue && !this.state.serviceFeeSwitchValue){
            amountCharged = this.amountWithTax;
        }
        else if(!this.state.taxSwitchValue && this.state.serviceFeeSwitchValue){
            amountCharged = this.amountWithService;
        }
        else{
            amountCharged = this.props.navigation.state.params.amountCharged.replace(/[^0-9]/, "");
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
                            ${parseFloat(Math.round(amountCharged * 100) / 100).toFixed(2)}
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
                            onPress={() => this.handleSwitchPress("tax")}
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
                            onPress={() => this.handleSwitchPress("service")}
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