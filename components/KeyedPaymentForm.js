import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
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
    }

    componentDidMount() {
        this.getMerchantSettings();
        console.log(this.state.cardAccount);
        console.log("In com did mount")
        console.log(this.state.streetOn);
        console.log(this.state.zipOn);
        console.log(this.state.cvvOn);
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
                    maxLength={16}
                    onChangeText={(text) => this.setState(prevState => ({
                        cardAccount: {
                            ...prevState.cardAccount,
                            number: text
                        }
                    }))}
                    
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
                    title="Connect Card Reader"
                    onPress={() => console.log(this.state.cardAccount)}
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
    }
});
