import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { Input, Button } from 'react-native-elements';
//Helper Methods
import { storageGet, storageSet } from '../helperMethods/localStorage';


export default class KeyedPaymentForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            merchantId: 0,
            cardAccount: {
                number: "4242 4242 4242 4242",
                expiryMonth: "12",
                expiryYear: "21",
                avsStreet: "",
                avsZip: "",
                cvv: ""
            },
            numberWithoutSpaces: "",
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
    }

    async getMerchantSettings() { //FIX API CALL MADE WITH NEW HELPER METHODS
        let encodedUser = await storageGet("encodedUser");
        let merchantId = await storageGet("merchantId");

        this.setState({ merchantId: merchantId });

        let headers = {
            'Authorization': 'Basic ' + encodedUser,
            'Content-Type': 'application/json; charset=utf-8'
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
        });
    }

    checkStreetAndZipValue() {
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
            return (
                <View style={styles.row}>
                    <View style={{ flex: 1 }}>
                        {streetInput}
                    </View>
                    <View style={{ flex: 1 }}>
                        {zipInput}
                    </View>
                </View>
            );
        }
        else if (!this.state.streetOn && !this.state.zipOn) {
            return null;
        }
        else {
            //Really ugly work around for keep the form looking decent when either street or zip are not required
            if (this.state.streetOn) {
                streetInput = <Input
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
                return (
                    <View>
                        {streetInput}
                    </View>
                );
            }
            else {
                zipInput = <Input
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

        this.setState({ numberWithoutSpaces: number }, () => {
            this.props.charge(this.state);
        })
    }

    render() {
        return (
            <View style={styles.form}>
                <Input
                    placeholder="1234 5678 9012 3..."
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
                    onPress={() => this.printCardAccount(this.state.cardAccount.number)}
                />
            </View>
        );
    }
}
//Styles
const styles = StyleSheet.create({
    form: {
        width: '100%',
        alignItems: 'center'
    },
    spacer: {
        marginBottom: '4%'
    },
    row: {
        flexDirection: 'row',
        width: '100%'
    },
    inputContainer: {
        width: '84%',
        borderRadius: 15,
        backgroundColor: 'white',
        marginLeft: '8%',
    },
    input: {
        paddingLeft: 20,
        fontSize: 14
    },
    rowInputContainer: {
        width: '64%',
        marginLeft: '17%',
        borderRadius: 15,
        backgroundColor: 'white'
    },
    zipAddressRowContainers: {
        width: "64%",
        marginLeft: '17%',
        borderRadius: 15,
        backgroundColor: 'white'
    },
    zipAddressRowContainersOneUsed: {
        width: "84%",
        borderRadius: 15,
        backgroundColor: 'white'
    },
    rowInputs: {
        paddingLeft: 10,
        fontSize: 16
    },
    cvvContainer: {
        borderRadius: 15,
        backgroundColor: 'white',
        width: '25%',
        marginLeft: '35%'
    },
    cvvInput: {
        paddingLeft: 30,
        fontSize: 14
    },
    buttonContainer: {
        width: '80%',
    },
    buttonTitle: {
        fontSize: 16
    }
});
