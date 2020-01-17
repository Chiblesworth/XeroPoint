import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Icon, Button } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';
import { StackActions, NavigationActions } from 'react-navigation';

import CustomerHeader from '../ui/CustomHeader';

import ConfirmRefundOverlay from '../overlays/ConfirmRefundOverlay'; // Added here for the confirmation user wants to close batch. Could be named better.

import { closeBatch } from '../../api_requests/closeBatch';

import { convertMilitaryToStandardTime } from '../../helpers/dateFormats';
import { showAlert } from '../../helpers/showAlert';

import { styles } from '../styles/BatchPaymentStyles';

const resetAction = StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({ routeName: 'DrawerStack' })],
});

export default class BatchPaymentScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            batchPayments: this.props.navigation.state.params.batchPayments,
            batchId: this.props.navigation.state.params.batchId,
            batchStatus: this.props.navigation.state.params.batchStatus,
            confirmBatchCloseOverlay: false
        };
    }

    handleHeaderIconPress = () => {
        this.props.navigation.pop();
    }

    handleConfirmOverlay = () => {
        this.setState({confirmBatchCloseOverlay: !this.state.confirmBatchCloseOverlay})
    }

    handlePaymentPress = (payment) => {
        this.props.navigation.push("ViewReceipt", { payment: payment });
    }

    confirmBatchClose = async () => {
        if(this.state.batchStatus === "Open"){
            let status = await closeBatch(this.state.batchId);

            if(status === 201){
                showAlert("Batch Closed", "The batch was closed.");
                this.props.navigation.dispatch(resetAction);
            }
            else{
                showAlert("Batch Not Closed", "The batch could not be closed.");
            }
        }
    }

    render() {
        let buttonTitle, disabled;

        if(this.state.batchStatus === "Open"){
            buttonTitle = "Close Batch";
            disabled = false;
        }
        else{
            buttonTitle = "Batch Closed";
            disabled = true;
        }

        return (
            <View>
                <CustomerHeader 
                    iconName="chevron-left"
                    type="entype"
                    title="Payments"
                    handlePress={this.handleHeaderIconPress}
                    backgroundColor="#454343"
                />
                <View style={styles.closeBatchContainer}>
                    <Button
                        type="solid"
                        title={buttonTitle}
                        containerStyle={styles.buttonContainer}
                        titleStyle={styles.buttonTitle}
                        disabled={disabled}
                        disabledStyle={styles.disabledButton}
                        disabledTitleStyle={styles.disabledTitle}
                        onPress={() => this.handleConfirmOverlay()}
                    />
                </View>
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

                        let iconName, iconType;
                        if(payment.cardAccount.cardType === "Visa"){
                            iconName = "cc-visa";
                            iconType = "font-awesome";
                        }
                        else if(payment.cardAccount.cardType === "MasterCard"){
                            iconName = "cc-mastercard";
                            iconType = "font-awesome";
                        }
                        else if(payment.cardAccount.cardType === "Discover"){
                            iconName = "cc-discover";
                            iconType = "font-awesome";
                        }
                        else if(payment.cardAccount.cardType === "American Express"){
                            iconName = "credit-card";
                            iconType = "entypo";
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
                                                    type={iconType}
                                                    name={iconName}
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
                <ConfirmRefundOverlay
                    isVisible={this.state.confirmBatchCloseOverlay}
                    handleClose={this.handleConfirmOverlay}
                    action={this.confirmBatchClose}
                />
            </View>
        );
    }
}