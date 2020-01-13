import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';

import { convertMilitaryToStandardTime } from '../../helpers/dateFormats';

import { styles } from  '../styles/DailyPaymentHistoryStyles';

export default class DailyPaymentHistory extends Component {
    constructor(props) {
        super(props);
    }

    calculateDailyNetTotal = (payments) => {
        let netTotal = 0;
        for (let i = 0; i < payments.length; i++) {
            netTotal += Number(payments[i].amount);
        }

        return "$" + parseFloat(Math.round(netTotal * 100) / 100).toFixed(2);
    }

    handlePaymentPress = (payment) => {
        this.props.navigation.push("ViewReceipt", {payment: payment});
    }

    render() {

        return (
            <View>
                {this.props.paymentsSplitByDay.map((dailyPayments, index) => {
                    let dayOfPayments = new Date(dailyPayments[0].created);
                    
                    return (
                        <View key={index}>
                            <View style={[styles.row, { backgroundColor: "#D3D3D3" }]}>
                                <Text style={styles.text}>{dayOfPayments.toDateString()}</Text>
                                <Text style={styles.text}>{this.calculateDailyNetTotal(dailyPayments)}</Text>
                            </View>
                            {dailyPayments.map((payment, index) => {
                                if (payment.tip === undefined) {
                                    payment.tip = "0.00";
                                }

                                let backgroundCol;
                                if (payment.status === "Settled" || payment.status === "Approved") {
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
                                        <View style={styles.container}>
                                            <View style={[styles.row, { justifyContent: 'space-between', margin: '1%' }]}>
                                                <View>
                                                    <View style={styles.row}>
                                                        <Icon
                                                            type='entypo'
                                                            name='credit-card'
                                                            size={35}
                                                            containerStyle={{ paddingLeft: 15 }}
                                                        />
                                                        <Text style={[styles.text, { paddingTop: '2%' }]}>
                                                            ${parseFloat(Math.round(payment.amount * 100) / 100).toFixed(2)}
                                                        </Text>
                                                    </View>
                                                    <View style={[styles.row], { paddingLeft: '2%' }}>
                                                        <Text style={styles.text}>
                                                            {timeOfPayment}
                                                        </Text>
                                                    </View>
                                                </View>
                                                <View>
                                                    <View style={styles.row}>
                                                        <Text style={styles.text}>
                                                            Tip: ${parseFloat(Math.round(payment.tip * 100) / 100).toFixed(2)}
                                                        </Text>
                                                    </View>
                                                    <View style={[styles.row], { padding: '5%' }}>
                                                        <View style={[styles.statusContainer, { backgroundColor: backgroundCol }]}>
                                                            <Text style={[styles.text, { color: '#fff', paddingTop: '1%' }]}>
                                                                {payment.status}
                                                            </Text>
                                                        </View>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    );
                })}
            </View>
        );
    }
}