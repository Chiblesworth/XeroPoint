import React, { Component } from 'react';
import { View, Text } from 'react-native';

import { styles } from './styles/CustomerInfoStyles';

export default class CustomerInfo extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.text}> Customer Name: {this.props.customerName} </Text>
                <Text style={styles.text}> Customer Number: {this.props.customerCode} </Text>
                <Text style={styles.text}> Invoice: {this.props.invoice} </Text>
                <Text style={styles.text}> Tax: ${this.props.tax}</Text>
            </View>
        );
    }
}