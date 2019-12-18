import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import CustomHeader from '../CustomHeader';
import MerchantInfo from '../MerchantInfo';
import PaymentInfo from '../PaymentInfo';
import TotalInfo from '../TotalInfo';
import CustomerInfo from '../CustomerInfo';

import { convertMilitaryToStandardTime } from '../../helpers/dateFormats';

import { styles } from '../styles/ViewReceiptStyles';


export default class ViewReceiptScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            payment: this.props.navigation.state.params.payment
        };

        this.handleHeaderIconPress = this.handleHeaderIconPress.bind(this);
    }

    componentWillMount() {
        console.log(this.state.payment)
    }

    handleHeaderIconPress() {
        this.props.navigation.pop();
    }

    render() {
        let payment = this.props.navigation.state.params.payment;
        let paymentInvoice = "#" + payment.invoice;
        let paymentCreated = new Date(payment.created);
        let dateCreated = paymentCreated.toDateString();
        let timeCreated = paymentCreated.toTimeString();

        timeCreated = timeCreated.split(" ");
        timeCreated = convertMilitaryToStandardTime(timeCreated[0], true);
        return (
            <View style={{ backgroundColor: '#ECE7E7', height: '100%' }}>
                <CustomHeader
                    iconName="chevron-left"
                    type="entypo"
                    title={paymentInvoice}
                    handlePress={this.handleHeaderIconPress}
                    backgroundColor="#454343"
                />
                <ScrollView style={styles.receiptContainer}>
                    <View>
                        <MerchantInfo dateCreated={dateCreated} timeCreated={timeCreated} merchantId={payment.merchantId} />
                        {/* Divider wrapped in view so it doesn't center all content within the component */}
                        <View style={{ alignItems: 'center' }}>
                            <View style={styles.divider} />
                        </View>
                        <PaymentInfo
                            last4={payment.cardAccount.last4}
                            authCode={payment.authCode}
                            cardPresent={payment.cardPresent}
                            entryMode={payment.cardAccount.entryMode}
                            reference={payment.reference}
                            batch={payment.batch}
                            creatorName={payment.creatorName}
                            status={payment.status}
                        />
                        <View style={{ alignItems: 'center' }}>
                            <View style={styles.divider} />
                        </View>
                        <TotalInfo
                            originalAmount={payment.originalAmount}
                            tip={payment.tip}
                            total={payment.amount}
                        />
                        <View style={{ alignItems: 'center' }}>
                            <View style={styles.divider} />
                        </View>
                        <CustomerInfo
                            customerName={payment.customerName}
                            customerCode={payment.customerCode}
                            invoice={payment.invoice}
                            tax={payment.tax}
                        />
                    </View>
                </ScrollView>
            </View>
        );
    }
}