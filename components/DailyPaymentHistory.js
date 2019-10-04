import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Button, Icon } from 'react-native-elements';
//Components
import Loader from './Loader';
//Helper Methods
import { convertMilitaryToStandardTime } from '../helperMethods/dateFormats';

export default class DailyPaymentHistory extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };

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
                                    backgroundCol = "green";
                                }
                                else if (payment.status === "Declined") {
                                    backgroundCol = "red";
                                }
                                else if (payment.status === "Voided") {
                                    backgroundCol = "orange";
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

//Styles
const styles = StyleSheet.create({
    container: {
        borderBottomWidth: 1,
        borderBottomColor: 'grey',
        width: '100%',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    text: {
        padding: 10,
        fontSize: 16,
        color: '#000'
    },
    statusContainer: {
        alignItems: 'center',
        height: 25,
        borderRadius: 5
    }
});
