import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
//Helper Methods
import { storageGet } from '../helperMethods/localStorage';
//Test
import base64 from 'react-native-base64';


export default class MerchantInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: null,
            address: {
                street: null,
                city: null,
                state: null,
                zip: null,
            }, 
            phone: null
        };
    }

    async componentWillMount() {
        let encodedUser = base64.encode("procinc:processing2019");
        //let merchantId = await storageGet("merchantId");

        let headers = {
            'Authorization': 'Basic ' + encodedUser,
            'Content-Type': 'application/json; charset=utf-8'
        }
        fetch(`https://api.mxmerchant.com/checkout/v3/merchant/418399799/setting`, {
            method: "GET",
            headers: headers
        }).then((response) => {
            return response.json();
        }).then((Json) => {
            console.log(Json.receipt)
            let receipt = Json.receipt;

            this.setState({
                name: receipt.name,
                address: {
                    street: receipt.address.address1,
                    city: receipt.address.city,
                    state: receipt.address.state,
                    zip: receipt.address.zip
                },
                phone: receipt.phone
            })
        });
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.merchantName}> {this.state.name} </Text>
                <Text style={styles.text}> {this.state.address.street} </Text>
                <Text style={styles.text}> 
                    {this.state.address.city}, {this.state.address.state} {this.state.address.zip}
                </Text>
                <Text style={styles.text}> {this.state.phone} </Text>
            </View>
        );
    }
}

//Styles 
const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        padding: 15
        
    },
    merchantName: {
        fontWeight: '500',
        color: 'black',
        fontSize: 15,
        paddingBottom: 10,
        letterSpacing: 0.5
    },
    text: {
        letterSpacing: 0.5
    }
});