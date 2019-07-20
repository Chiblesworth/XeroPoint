import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { Input, Button } from 'react-native-elements';
import AsyncStorage from '@react-native-community/async-storage';

export default class KeyedPaymentForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            merchantId: 0,
            cardAccount: {
                number: "",
                expiryMonth: "",
                expiryYear: "",
                avsStreet: "",
                avsZip: "",
                cvv: ""
            },
            streetOn: false,
            zipOn: false,
            cvvOn: false
        }

        this.getMerchantSettings = this.getMerchantSettings.bind(this);
        this.checkStreetAndZipValue = this.checkStreetAndZipValue.bind(this);
        this.handleCardInputChange = this.handleCardInputChange.bind(this);
        this.printCardAccount = this.printCardAccount.bind(this);
    }

    componentDidMount() {
        this.getMerchantSettings();
        console.log(this.state);
    }

    getMerchantSettings() {
        AsyncStorage.getItem("merchantId").then((merchantId) => {
            this.setState({merchantId: merchantId});
        });

        AsyncStorage.getItem("encodedUser").then((encoded) => {
            let headers = {
                'Authorization' : 'Basic ' + encoded,
                'Content-Type' : 'application/json; charset=utf-8'
            }

            fetch(`https://sandbox.api.mxmerchant.com/checkout/v3/merchant/${this.state.merchantId}/setting`, {
                    headers: headers
                }).then((response) => {
                    return response.json();
                }).then((Json) => {
                    let isStreetOn = Json.lossPrevention.keyedAvsAddress;
                    let isZipOn = Json.lossPrevention.keyedAvsZip;
                    let isCvvOn = Json.lossPrevention.keyedCvv;

                    this.setState({
                        streetOn: isStreetOn,
                        zipOn: isZipOn,
                        cvvOn: isCvvOn
                    });
                })
        })
    }

    checkStreetAndZipValue() {
        const streetInput = <Input 
                                placeholder="Street Number" 
                                placeholderTextColor="grey"
                                inputContainerStyle={styles.inputContainer}
                                inputStyle={styles.input}
                                keyboardType="numeric"
                                maxLength={20}
                                onChangeText={(text) => this.setState(prevState => ({
                                    cardAccount: {
                                        ...prevState.cardAccount,
                                        avsStreet: text
                                    }
                                }))}
                            />
        const zipInput = <Input 
                            placeholder="ZIP" 
                            placeholderTextColor="grey"
                            inputContainerStyle={styles.inputContainer}
                            inputStyle={styles.input}
                            keyboardType="numeric"
                            maxLength={5}
                            onChangeText={(text) => this.setState(prevState => ({
                                cardAccount: {
                                    ...prevState.cardAccount,
                                    avsZip: text
                                }
                            }))}
                        />

        if(this.state.streetOn && this.state.zipOn){
            return (
                <View style={styles.doubleFields}>
                    <View style={{flex: 1}}>
                        {streetInput}
                    </View>
                    <View style={{flex: 1}}>
                        {zipInput}
                    </View>
                </View>
            );
        }
        else if(!this.state.streetOn && !this.state.zipOn){
            return null;
        }
        else{
            if(this.state.streetOn){
                return (
                    <View>
                        {streetInput}
                    </View>
                );
            }
            else{
                return (
                    <View>
                        {zipInput}
                    </View>
                );
            }
        }
    }

    handleCardInputChange(number) {
        //https://stackoverflow.com/questions/40237150/react-native-how-to-format-payment-in-mm-yy-and-spaced-16-digit-card-number-in
        //Adds a space after every four numbers. Displays better for the user.
        this.setState(prevState => ({
            cardAccount: {
                ...prevState.cardAccount,
                number: number.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim()
            }
        }));
    }

    printCardAccount(number) {
        //Remove spaces from card number
        number = number.replace(/ /g, "");
        
        this.setState(prevState => ({
            cardAccount: {
                ...prevState,
                number: number
            }
        }), () => {
            this.props.charge(this.state.cardAccount);
        })
    }

    render() {
        return (
            <View stlye={styles.form}>
                <Input 
                    placeholder="1234 5678 9012 3..."
                    placeholderTextColor="grey"
                    leftIcon={{type: 'entypo', name: 'credit-card', size: 25, color: 'gray'}}
                    inputContainerStyle={styles.inputContainer}
                    inputStyle={styles.input}
                    keyboardType="numeric"
                    maxLength={20}
                    onChangeText={(text) => this.handleCardInputChange(text)}
                    value={this.state.cardAccount.number}
                    
                />
                <View style={styles.doubleFields}>
                    <View style={{flex: 1}}>
                        <Input 
                            placeholder="Month EXP"
                            placeholderTextColor="grey"
                            inputContainerStyle={styles.doubleFieldInputs}
                            inputStyle={styles.input}
                            keyboardType="numeric"
                            maxLength={2}
                            onChangeText={(text) => this.setState(prevState => ({
                                cardAccount: {
                                    ...prevState.cardAccount,
                                    expiryMonth: text
                                }
                            }))}
                        />
                    </View>
                    <View style={{flex: 1}}>
                        <Input 
                            placeholder="Year EXP"
                            placeholderTextColor="grey"
                            inputContainerStyle={styles.doubleFieldInputs}
                            inputStyle={styles.input}
                            keyboardType="numeric"
                            maxLength={2}
                            onChangeText={(text) => this.setState(prevState => ({
                                cardAccount: {
                                    ...prevState.cardAccount,
                                    expiryYear: text
                                }
                            }))}
                        />
                    </View>
                </View>
                {this.checkStreetAndZipValue()}
                {this.state.cvvOn
                    ? (
                        <Input 
                            placeholder="CVV" 
                            placeholderTextColor="grey"
                            inputContainerStyle={styles.cvvContainer}
                            inputStyle={styles.input}
                            keyboardType="numeric"
                            maxLength={3}
                            onChangeText={(text) => this.setState(prevState => ({
                                cardAccount: {
                                    ...prevState.cardAccount,
                                    cvv: text
                                }
                            }))}
                        />
                    ) : (null)
                }
                <Button 
                    type="solid"
                    title="Charge"
                    containerStyle={styles.buttonContainer}
                    titleStyle={styles.buttonTitle}
                    onPress={() => this.printCardAccount(this.state.cardAccount.number)}
                />
            </View>
        );
    }
}
//Styles
const styles = StyleSheet.create({
    form: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputContainer: {
        marginBottom: 15,
        borderStyle: 'solid',
        borderColor: 'black',
        borderRadius: 25,
        backgroundColor: 'white',
        width: '100%'
    },
    input: {
        paddingLeft: 20,
        fontSize: 20
    },
    doubleFields: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    doubleFieldInputs: {
        marginBottom: 15,
        borderStyle: 'solid',
        borderColor: 'black',
        borderRadius: 25,
        backgroundColor: 'white',
        width: '100%'
    },
    cvvContainer: {
        marginBottom: 15,
        marginLeft: '38%',
        borderStyle: 'solid',
        borderColor: 'black',
        borderRadius: 25,
        backgroundColor: 'white',
        width: '25%'
    },
    buttonContainer: {
        width: 332,
        height: 40,
        marginBottom: 20,
        marginLeft: 16
    },
    buttonTitle: {
        fontSize: 25
    }
});
