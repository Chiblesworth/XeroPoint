import React, { Component } from 'react';
import { View } from 'react-native';
import { Input, Button } from 'react-native-elements';

import { storageGet } from '../helpers/localStorage';
import { getRequestHeader } from '../helpers/getRequestHeader';

import { styles } from './styles/KeyedPaymentFormStyles';


export default class KeyedPaymentForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            cardAccount: {
                // number: "4242 4242 4242 4242",
                // expiryMonth: "12",
                // expiryYear: "21",
                number: null,
                expiryMonth: null,
                expiryYear: null,
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
    }

    componentDidMount() {
        this.getMerchantSettings();
    }

    async getMerchantSettings() { //FIX API CALL MADE WITH NEW HELPER METHODS
        let merchantId = await storageGet("merchantId");
        let headers = await getRequestHeader();

        fetch(`https://sandbox.api.mxmerchant.com/checkout/v3/merchant/${merchantId}/setting`, {
            method: "GET",
            headers: headers
        }).then((response) => {
            return response.json();
        }).then((Json) => {
            this.setState({
                streetOn: Json.lossPrevention.keyedAvsAddress,
                zipOn: Json.lossPrevention.keyedAvsZip,
                cvvOn: Json.lossPrevention.keyedCvv
            });
        });
    }

    checkStreetAndZipValue() {
        let container;
        let streetInput = <Input
            placeholder="Street Number"
            placeholderTextColor="grey"
            inputContainerStyle={styles.zipAddressRowContainers}
            inputStyle={styles.rowInputs}
            keyboardType="numeric"
            maxLength={20}
            onChangeText={(text) => this.setState(prevState => ({
                cardAccount: {
                    ...prevState.cardAccount,
                    avsStreet: text
                }
            }))}
        />
        let zipInput = <Input
            placeholder="ZIP Code"
            placeholderTextColor="grey"
            inputContainerStyle={styles.zipAddressRowContainers}
            inputStyle={styles.rowInputs}
            keyboardType="numeric"
            maxLength={5}
            onChangeText={(text) => this.setState(prevState => ({
                cardAccount: {
                    ...prevState.cardAccount,
                    avsZip: text
                }
            }))}
        />

        if (this.state.streetOn && this.state.zipOn) {
            container = <View style={styles.row}>
                <View style={{ flex: 1 }}>
                    {streetInput}
                </View>
                <View style={{ flex: 1 }}>
                    {zipInput}
                </View>
            </View>;
        }
        else if (!this.state.streetOn && !this.state.zipOn) {
            container = null;
        }
        else {
            (this.state.streetOn) 
                ? container = <View>
                    <Input
                        placeholder="Street Number"
                        placeholderTextColor="grey"
                        inputContainerStyle={styles.zipAddressRowContainersOneUsed}
                        inputStyle={styles.rowInputs}
                        keyboardType="numeric"
                        maxLength={20}
                        onChangeText={(text) => this.setState(prevState => ({
                            cardAccount: {
                                ...prevState.cardAccount,
                                avsStreet: text
                            }
                        }))}
                    />
                </View>
                : container = <View>
                    <Input
                        placeholder="ZIP Code"
                        placeholderTextColor="grey"
                        inputContainerStyle={styles.zipAddressRowContainersOneUsed}
                        inputStyle={styles.rowInputs}
                        keyboardType="numeric"
                        maxLength={5}
                        onChangeText={(text) => this.setState(prevState => ({
                            cardAccount: {
                                ...prevState.cardAccount,
                                avsZip: text
                            }
                        }))}
                    />
                </View>;            
        }

        return container;
    }

    handleCardInputChange(number) {
        this.setState(prevState => ({
            cardAccount: {
                ...prevState.cardAccount,
                number: number.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim()
            }
        }));
    }

    render() {
        console.log("keyed connected ", this.props.connected)
        return (
            <View style={styles.form}>
                <Input
                    disabled={(this.props.connected) ? true : false}
                    editable={true}
                    placeholder={(this.props.connected) ? "Card Reader Connected" : "1234 5678 9012 3..."}
                    placeholderTextColor="grey"
                    leftIcon={{ type: 'entypo', name: 'credit-card', size: 25, color: 'gray' }}
                    inputContainerStyle={styles.inputContainer}
                    inputStyle={styles.input}
                    keyboardType="numeric"
                    maxLength={20}
                    onChangeText={(text) => this.handleCardInputChange(text)}
                    value={this.state.cardAccount.number}
                    
                />
                <View style={styles.spacer} />
                <View style={styles.row}>
                    <View style={{ flex: 1 }}>
                        <Input
                            disabled={true}
                            placeholder="Month EXP"
                            placeholderTextColor="grey"
                            inputContainerStyle={styles.rowInputContainer}
                            inputStyle={styles.rowInputs}
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
                    <View style={{ flex: 1 }}>
                        <Input
                            disabled={true}
                            placeholder="Year EXP"
                            placeholderTextColor="grey"
                            inputContainerStyle={styles.rowInputContainer}
                            inputStyle={styles.rowInputs}
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
                <View style={styles.spacer} />
                {this.checkStreetAndZipValue()}
                <View style={styles.spacer} />
                {this.state.cvvOn
                    ? (
                        <Input
                            placeholder="CVV"
                            placeholderTextColor="grey"
                            inputContainerStyle={styles.cvvContainer}
                            inputStyle={styles.cvvInput}
                            keyboardType="numeric"
                            maxLength={4}
                            onChangeText={(text) => this.setState(prevState => ({
                                cardAccount: {
                                    ...prevState.cardAccount,
                                    cvv: text
                                }
                            }))}
                        />
                    ) : (null)
                }
                <View style={styles.spacer} />
                <Button
                    type="solid"
                    title="Charge"
                    containerStyle={styles.buttonContainer}
                    titleStyle={styles.buttonTitle}
                    onPress={() => this.props.charge(this.state)}
                />
            </View>
        );
    }
}