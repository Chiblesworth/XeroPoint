import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Input, Button } from 'react-native-elements';

import { storageGet } from '../helpers/localStorage';
import { getRequestHeader } from '../helpers/getRequestHeader';
import { showAlert } from '../helpers/showAlert';

import { styles } from './styles/KeyedPaymentFormStyles';

export default class KeyedPaymentForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            cardAccount: {
                number: null,
                expiryMonth: null,
                expiryYear: null,
                avsStreet: null,
                avsZip: null,
                cvv: null
            },
            streetOn: false,
            zipOn: false,
            cvvOn: false,
            cardNumberError: null,
            monthError: null,
            yearError: null,
            zipError: null,
            cvvError: null
        }

        this.getMerchantSettings = this.getMerchantSettings.bind(this);
        this.handleChargePress = this.handleChargePress.bind(this);
        this.checkStreetAndZipValue = this.checkStreetAndZipValue.bind(this);
        this.handleCardInputChange = this.handleCardInputChange.bind(this);
        this.validateMonthOrYear = this.validateMonthOrYear.bind(this);
        this.validateZip = this.validateZip.bind(this);
        this.validateCvv = this.validateCvv.bind(this);
        this.validateForm = this.validateForm.bind(this);
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

    handleChargePress() {
        (this.props.connected)
            ? this.props.charge(this.state)
            : this.validateForm(this.state.cardAccount);
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
        let zipInput = <View>
            <Input
                placeholder="ZIP Code"
                placeholderTextColor="grey"
                inputContainerStyle={styles.zipAddressRowContainers}
                inputStyle={styles.rowInputs}
                keyboardType="numeric"
                maxLength={5}
                onChangeText={(text) => this.validateZip(text)}
            />
            <Text style={[styles.errorText, {marginLeft: '20%'}]}>{this.state.zipError}</Text>
        </View>

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
                        onChangeText={(text) => this.validateZip(text)}
                    />
                    <Text style={[styles.errorText, {marginLeft: '20%'}]}>{this.state.zipError}</Text>
                </View>;            
        }

        return container;
    }

    handleCardInputChange(number) {
        let regex = /[0-9- ]{19}/g;
        let message;
        (regex.test(number))
            ? message = null
            : message = "16 numbers required";

        this.setState(prevState => ({
            cardAccount: {
                ...prevState.cardAccount,
                number: number.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim()
            },
            cardNumberError: message
        }));
    }

    validateMonthOrYear(text, field) {
        let regex = /^[0-9]{2}/g;
        let message;
        (regex.test(text))
            ? message = null
            : message = "2 numbers required";
        
        (field === "month")
            ? this.setState(prevState => ({
                cardAccount: {
                    ...prevState.cardAccount,
                    expiryMonth: text
                },
                monthError: message
            }))
            : this.setState(prevState => ({
                cardAccount: {
                    ...prevState.cardAccount,
                    expiryYear: text
                },
                yearError: message
            }));
    }

    validateZip(text) {
        let regex = /^[0-9]{5}/g;
        let message;
        (regex.test(text))
            ? message = null
            : message = "5 numbers required";

        this.setState(prevState => ({
            cardAccount: {
                ...prevState.cardAccount,
                avsZip: text
            },
            zipError: message
        }));
    }

    validateCvv(text) {
        let regex = /^[0-9]{2}/g;
        let message;
        (regex.test(text))
            ? message = null
            : message = "3-4 numbers required";
        
        this.setState(prevState => ({
            cardAccount: {
                ...prevState.cardAccount,
                cvv: text
            },
            cvvError: message
        }));
    }

    validateForm(cardAccount) {
        let validated = true;
        let validationErrorTitle = "Validation Error";
        let validationErrorMessage;
 
        if(this.state.cardNumberError != null){
            validationErrorMessage = "Errors exist within the form, check card number.";
            validated = false;
        }
        else if(cardAccount.number === null || cardAccount.number === ""){
            validationErrorMessage = "Errors exist within the form, cannot leave anything above 'Charge' button empty";
            validated = false;
        }
        
        if(this.state.monthError != null){
            validationErrorMessage = "Errors exist within the form, check the month expiration.";
            validated = false;
        }
        else if(cardAccount.expiryMonth === null || cardAccount.expiryMonth === ""){
            validationErrorMessage = "Errors exist within the form, cannot leave anything above 'Charge' button empty";
            validated = false;
        }

        if(this.state.yearError != null){
            validationErrorMessage = "Errors exist within the form, check the year expiration.";
            validated = false;
        }
        else if(cardAccount.expiryYear === null || cardAccount.expiryYear === ""){
            validationErrorMessage = "Errors exist within the form, cannot leave anything above 'Charge' button empty";
            validated = false;
        }
        
        if(this.state.streetOn){
            if(cardAccount.avsStreet === null || cardAccount.avsStreet === ""){
                validationErrorMessage = "Errors exist within the form, cannot leave anything above 'Charge' button empty";
                validated = false;
            }
        }

        if(this.state.zipOn){
            if(this.state.zipError != null){
                validationErrorMessage = "Errors exist within the form, check the ZIP code.";
                validated = false;
            }
            else if(cardAccount.avsZip === null || cardAccount.avsZip === ""){
                validationErrorMessage = "Errors exist within the form, cannot leave anything above 'Charge' button empty";
                validated = false;
            }
        }

        if(this.state.cvvOn){
            if(this.state.cvvError != null){
                validationErrorMessage = "Errors exist within the form, check the CVV number.";
                validated = false;
            }
            else if(cardAccount.cvv === null || cardAccount.cvv === ""){
                validationErrorMessage = "Errors exist within the form, cannot leave anything above 'Charge' button empty";
                validated = false;
            }
        }
        
        (!validated)
            ? showAlert(validationErrorTitle, validationErrorMessage)
            : this.props.charge(this.state.cardAccount);
    }

    render() {
        return (
            <View style={styles.form}>
                <View>
                    <Input
                        disabled={(this.props.connected) ? true : false}
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
                    <Text style={styles.errorText}>{this.state.cardNumberError}</Text>
                </View>
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
                            onChangeText={(text) => this.validateMonthOrYear(text, "month")}
                        />
                        <Text style={[styles.errorText, {marginLeft: '20%'}]}>{this.state.monthError}</Text>
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
                            onChangeText={(text) => this.validateMonthOrYear(text, "year")}
                        />
                        <Text style={[styles.errorText, {marginLeft: '20%'}]}>{this.state.yearError}</Text>

                    </View>
                </View>
                <View style={styles.spacer} />
                {this.checkStreetAndZipValue()}
                <View style={styles.spacer} />
                {this.state.cvvOn
                    ? (
                        <View>
                            <Input
                                placeholder="CVV"
                                placeholderTextColor="grey"
                                inputContainerStyle={styles.cvvContainer}
                                inputStyle={styles.cvvInput}
                                keyboardType="numeric"
                                maxLength={4}
                                onChangeText={(text) => this.validateCvv(text)}
                            />
                            <Text style={[styles.errorText, {}]}>{this.state.cvvError}</Text>
                        </View>
                    ) : (null)
                }
                <Button
                    type="solid"
                    title="Charge"
                    containerStyle={styles.buttonContainer}
                    titleStyle={styles.buttonTitle}
                    onPress={() => this.handleChargePress()}
                />
            </View>
        );
    }
}