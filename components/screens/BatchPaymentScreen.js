import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Header, Icon } from 'react-native-elements';
//Components
import HeaderIcon from '../HeaderIcon';
//Helper Methods
import { convertMilitaryToStandardTime } from '../../helperMethods/dateFormats';
import { ScrollView } from 'react-native-gesture-handler';


export default class BatchPaymentScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            batchPayments: this.props.navigation.state.params.batchPayments
        };

        this.handleHeaderIconPress = this.handleHeaderIconPress.bind(this);
    }

    componentDidMount() {
        console.log("In batch payments screen")
        console.log(this.state.batchPayments)
    }

    handleHeaderIconPress() {
        this.props.navigation.navigate("History");
    }

    render() {
        return (
            <View>
                <Header
                    leftComponent={
                        <HeaderIcon
                            name="chevron-left"
                            type="entypo"
                            size={60}
                            handlePress={this.handleHeaderIconPress}
                        />
                    }
                    centerComponent={
                        <Text style={styles.headerText}>Payments</Text>
                    }
                    backgroundColor="#808080"
                    containerStyle={{ borderBottomWidth: 0 }}
                />
                <ScrollView>
                    {this.state.batchPayments.map((payment, index) => {
                        if (payment.tip === undefined) {
                            payment.tip = "0.00";
                        }
                        let dateOfPayment = new Date(payment.created);
                        let timeOfPayment = dateOfPayment.toTimeString();

                        timeOfPayment = timeOfPayment.split(" ");
                        timeOfPayment = convertMilitaryToStandardTime(timeOfPayment[0]);

                        return (
                            <View style={styles.payment} key={index}>
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
                                            <View style={styles.settledContainer}>
                                                <Text style={[styles.paymentText], { color: '#fff', paddingTop: 2 }}>
                                                    {payment.status}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        )
                    })}
                </ScrollView>
            </View>
        );
    }
}

//Styles
const styles = StyleSheet.create({
    headerText: {
        fontSize: 25,
        color: 'white',
        paddingBottom: 30
    },
    payment: {
        borderWidth: 1,
        borderColor: 'black',
    },
    row: {
        padding: 10,
        width: '100%',
        flexDirection: 'row',
    },
    paymentText: {
        fontSize: 18
    },
    settledContainer: {
        backgroundColor: "green",
        alignItems: 'center',
        height: 25,
        borderRadius: 5
    }
})