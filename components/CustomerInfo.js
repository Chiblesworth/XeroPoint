import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default class CustomerInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.text}> Customer Name: {this.props.customerName} </Text>
                <Text style={styles.text}> Customer Number: {this.props.customerCode} </Text>
                <Text style={styles.text}> Invoice: {this.props.invoice} </Text>
                <Text style={styles.text}> Tax: </Text>
            </View>
        );
    }
}

//Styles
const styles = StyleSheet.create({
    container: {
        margin: 15
    },
    text: {
        fontSize: 14,
        color: 'black',
        letterSpacing: 0.5
    }
});
