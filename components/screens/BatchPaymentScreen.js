import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';

import CustomerHeader from '../CustomHeader';

import { convertMilitaryToStandardTime } from '../../helpers/dateFormats';

import { styles } from '../styles/BatchPaymentStyles';


export default class BatchPaymentScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            batchPayments: this.props.navigation.state.params.batchPayments
        };
    }

    componentDidMount() {
        console.log("In batch payments screen")
        console.log(this.state.batchPayments)
    }

    handleHeaderIconPress = () => {
        this.props.navigation.pop();
    }

    handlePaymentPress = (payment) => {
        this.props.navigation.push("ViewReceipt", { payment: payment });
    }

    render() {
        return (
            <View>
                <CustomerHeader 
                    iconName="chevron-left"
                    type="entype"
                    title="Payments"
                    handlePress={this.handleHeaderIconPress}
                    backgroundColor="#454343"
                />
                <ScrollView>
                    {this.state.batchPayments.map((payment, index) => {
                        if (payment.tip === undefined) {
                            payment.tip = "0.00";
                        }

                        let backgroundCol;
                        if (payment.status === "Settled") {
                            backgroundCol = '#287C28';
                        }
                        else if (payment.status === "Declined") {
                            backgroundCol = '#E50F0F';
                        }
                        else if (payment.status === "Voided") {
                            backgroundCol = '#F3A41C';
                        }
                        let dateOfPayment = new Date(payment.created);
                        let timeOfPayment = dateOfPayment.toTimeString();

                        timeOfPayment = timeOfPayment.split(" ");
                        timeOfPayment = convertMilitaryToStandardTime(timeOfPayment[0], false);

                        return (
                            <TouchableOpacity
                                key={index}
                                onPress={() => this.handlePaymentPress(payment)}
                            >
                                <View style={styles.payment}>
                                    <View style={[styles.row, { justifyContent: 'space-between' }]}>
                                        <View>
                                            <View style={styles.row}>
                                                <Icon
                                                    type='entypo'
                                                    name='credit-card'
                                                    size={35}
                                                />
                                                <View style={{ padding: 5 }} />
                                                <Text style={[styles.paymentText, { paddingTop: 5 }]}>
                                                    ${parseFloat(Math.round(payment.amount * 100) / 100).toFixed(2)}
                                                </Text>
                                            </View>
                                            <View style={[styles.row], { paddingTop: 0, paddingLeft: 10 }}>
                                                <Text style={styles.paymentText}>
                                                    {timeOfPayment}
                                                </Text>
                                            </View>
                                        </View>
                                        <View>
                                            <View style={styles.row}>
                                                <Text style={styles.paymentText}>
                                                    Tip: ${parseFloat(Math.round(payment.tip * 100) / 100).toFixed(2)}
                                                </Text>
                                            </View>
                                            <View style={[styles.row], { paddingTop: 10, paddingLeft: 10 }}>
                                                <View style={[styles.statusContainer, {backgroundColor: backgroundCol}]}>
                                                    <Text style={[styles.paymentText], { color: '#fff', paddingTop: 2 }}>
                                                        {payment.status}
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        )
                    })}
                </ScrollView>
            </View>
        );
    }
}