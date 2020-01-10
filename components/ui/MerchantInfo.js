import React, { Component } from 'react';
import { View, Text } from 'react-native';

import { storageGet } from '../../helpers/localStorage';
import { formatPhoneNumber } from '../../helpers/formatPhoneNumber';

import { styles } from '../styles/MerchantInfoStyles';
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

    async componentDidMount() {
        //let merchantId = await storageGet("merchantId");
        let headers = {
            'Authorization': 'Basic ' + encoded,
            'Content-Type': 'application/json; charset=utf-8'
        }
        fetch(`https://api.mxmerchant.com/checkout/v3/merchant/418399799/setting`, {
            method: "GET",
            headers: headers
        }).then((response) => {
            return response.json();
        }).then((Json) => {
            // console.log(Json)
            // console.log(Json.receipt)
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

        //Switch to this before moving to produc
        // let data = await getMerchantSettings(merchantId);
        // this.setState({
        //     name: data.receipt.name,
        //     address: {
        //         street: data.receipt.address.address1,
        //         city: data.receipt.address.city,
        //         state: data.receipt.address.state,
        //         zip: data.receipt.address.zip
        //     }
        // });
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.merchantName}> {this.state.name} </Text>
                <Text style={styles.text}> {this.state.address.street} </Text>
                <Text style={styles.text}> 
                    {this.state.address.city}, {this.state.address.state} {this.state.address.zip}
                </Text>
                <Text style={styles.text}> {formatPhoneNumber(this.state.phone)} </Text>
                <Text style={styles.text}>{this.props.dateCreated} at {this.props.timeCreated}</Text>
                <Text style={styles.text}>Merchant ID: {this.props.merchantId}</Text>
            </View>
        );
    }
}