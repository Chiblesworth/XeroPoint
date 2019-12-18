import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';

import { convertMilitaryToStandardTime } from '../helpers/dateFormats';

import { styles } from  './styles/DailyPaymentHistoryStyles';

export default class DailyPaymentHistory extends Component {
    constructor(props) {
        super(props);

        this.checkProps = this.checkProps.bind(this);
        this.calculateDailyNetTotal = this.calculateDailyNetTotal.bind(this);
        this.handlePaymentPress = this.handlePaymentPress.bind(this);
    }

    checkProps() {
        console.log('checkProps here')
        console.log(this.props.paymentsSplitByDay);
    }

    calculateDailyNetTotal(payments) {
        let netTotal = 0;
        for (let i = 0; i < payments.length; i++) {
            netTotal += Number(payments[i].amount);
        }
        return "$" + parseFloat(Math.round(netTotal * 100) / 100).toFixed(2);
    }

    handlePaymentPress(payment) {
        this.props.navigation.push("ViewReceipt", {payment: payment});
    }

    render() {

        return (
            <View>
                {this.props.paymentsSplitByDay.map((dailyPayments, index) => {
                    console.log(dailyPayments)
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
                                        <View style={styles.container}>
                                            <View style={[styles.row, { justifyContent: 'space-between', marginRight: 15 }]}>
                                                <View style={{ marginLeft: 15 }}>
                                                    <View style={styles.row}>
                                                        <Icon
                                                            type='entypo'
                                                            name='credit-card'
                                                            size={35}
                                                            containerStyle={{ paddingLeft: 15 }}
                                                        />
                                                        <View style={{ paddingTop: 5, paddingLeft: 10 }} />
                                                        <Text style={[styles.text, { paddingTop: 5 }]}>
                                                            ${parseFloat(Math.round(payment.amount * 100) / 100).toFixed(2)}
                                                        </Text>
                                                    </View>
                                                    <View style={[styles.row], { paddingTop: 0, paddingLeft: 10 }}>
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
                                                    <View style={[styles.row], { paddingTop: 10, paddingLeft: 10 }}>
                                                        <View style={[styles.statusContainer, { backgroundColor: backgroundCol }]}>
                                                            <Text style={[styles.text, { color: '#fff', paddingTop: 2 }]}>
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