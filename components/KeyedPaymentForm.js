import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Input, Button } from 'react-native-elements';
import AsyncStorage from '@react-native-community/async-storage';


export default class KeyedPaymentForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            merchantId: 0,
        }

        this.getMerchantSettings = this.getMerchantSettings.bind(this);
    }

    componentDidMount() {
        this.getMerchantSettings();
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
                    console.log(Json);
                })
        })
    }

    render() {
        return (
            <View stlye={styles.form}>
                <Text>Hi</Text>
            </View>
        );
    }
}

//Styles
const styles = StyleSheet.create({

});
