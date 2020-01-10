import React, { Component } from 'react';
import { View } from 'react-native';
import { Button } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';
import { StackActions, NavigationActions } from 'react-navigation';

import CustomHeader from '../ui/CustomHeader';
import MerchantInfo from '../ui/MerchantInfo';
import PaymentInfo from '../ui/PaymentInfo';
import TotalInfo from '../ui/TotalInfo';
import CustomerInfo from '../ui/CustomerInfo';

import SendReceiptOverlay from '../overlays/SendReceiptOverlay';
import RefundTypeOverlay from '../overlays/RefundTypeOverlay';
import PartialRefundOverlay from '../overlays/PartialRefundOverlay';
import ConfirmRefundOverlay from '../overlays/ConfirmRefundOverlay';

import { postPayment } from '../../api_requests/postPayment';
import { deletePayment } from '../../api_requests/deletePayment';

import { convertMilitaryToStandardTime } from '../../helpers/dateFormats';

import { styles } from '../styles/ViewReceiptStyles';
import { showAlert } from '../../helpers/showAlert';

const resetAction = StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({ routeName: 'DrawerStack' })],
});

export default class ViewReceiptScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            payment: this.props.navigation.state.params.payment,
            emailReceiptOverlayVisible: false,
            textReceiptOverlay: false,
            refundSelectOverlayVisible: false,
            partialRefundOverlayVisible: false,
            confirmRefundOverlayVisible: false,
            refundAmount: null
        };
    }

    handleHeaderIconPress = () => {
        this.props.navigation.pop();
    }

    handleRefundTypeSelectOverlay = () => {
        this.setState({refundSelectOverlayVisible: !this.state.refundSelectOverlayVisible});
    }

    renderButton = (title, disabled) => {
        return (
            <Button
                type="solid"
                title={title}
                onPress={() => this.handleButtonPress(title)}
                disabled={disabled}
            
            />
        )
    }

    handleButtonPress = async (buttonPressed) => {
        if(buttonPressed === "Email Receipt" || buttonPressed === "Text Receipt"){
            (buttonPressed === "Email Receipt")
                ? this.handleReceiptOverlay("Email")
                : this.handleReceiptOverlay("Text");
        }
        else if(buttonPressed === "Issue Refund"){
            this.handleRefundTypeSelectOverlay();
        }
        else if(buttonPressed === "Void Refund"){
            let status = await deletePayment(this.state.payment.id);
            
            if(status === 204){
                showAlert("Payment Voided!", "The payment has been voided out.");
                this.props.navigation.dispatch(resetAction);
            }
            else{
                showAlert("Payment Void Error", "There was an error in the void payment process.");
            }
        }
    }

    handleReceiptOverlay = (overlayTitle) => {
        (overlayTitle === "Email")
            ? this.setState({emailReceiptOverlayVisible: !this.state.emailReceiptOverlayVisible})
            : this.setState({textReceiptOverlay: !this.state.textReceiptOverlay});
    }

    handlePartialRefundOverlay = () => {
        this.setState({partialRefundOverlayVisible: !this.state.partialRefundOverlayVisible});
    }

    handleConfirmRefundOverlay = () => {
        this.setState({confirmRefundOverlayVisible: !this.state.confirmRefundOverlayVisible});
    }

    handleSendButtonPress = () => {
        console.log("Send it"); //Send the receipt when switch to production
    }

    handleSelectedRefundType = (selectedRefund) => {
        if(selectedRefund === "partial"){
            this.handleRefundTypeSelectOverlay();
            this.handlePartialRefundOverlay();
        }
        else{
            this.handleRefundTypeSelectOverlay();

            this.setState({refundAmount: this.state.payment.amount}, () => {
                this.handleConfirmRefundOverlay();
            })
        }
    }

    beginPartialRefund = (refundAmount) => {
        this.setState({refundAmount: refundAmount});

        this.handlePartialRefundOverlay();
        this.handleConfirmRefundOverlay();
    }

    issueRefund = async () => {
        let refundAmount = "-" + this.state.refundAmount;
        let data = {
            merchantId: this.state.payment.merchantId,
            tenderType: "Card",
            amount: refundAmount,
            paymentToken: this.state.payment.paymentToken
        }
        
        let updatedPayment = await postPayment(data);

        if(updatedPayment.status === "Declined"){
            showAlert("Refund Error!", "Refund could not be made. Likely because the payment was already refunded.");
        }
        else if(updatedPayment.status === "Approved"){
            this.handleConfirmRefundOverlay();
            this.props.navigation.dispatch(resetAction);
            showAlert("Payment Refunded", "The payment has been refuned!");
        }
    }

    render() {
        let payment = this.props.navigation.state.params.payment;
        let paymentInvoice = "#" + payment.invoice;
        let paymentCreated = new Date(payment.created);
        let dateCreated = paymentCreated.toDateString();
        let timeCreated = paymentCreated.toTimeString();
        let disabled = false;
        let refundButton;

        timeCreated = timeCreated.split(" ");
        timeCreated = convertMilitaryToStandardTime(timeCreated[0], true);

        if(payment.status === "Voided" || payment.status === "Declined"){
            disabled = true;
        }

        if(payment.type === "Sale"){
            refundButton = this.renderButton("Issue Refund", disabled);
        }
        else if(payment.type === "Return"){
            refundButton = this.renderButton("Void Refund", disabled);
        }
        
        return (
            <View style={{ backgroundColor: '#ECE7E7', height: '100%' }}>
                <CustomHeader
                    iconName="chevron-left"
                    type="entypo"
                    title={paymentInvoice}
                    handlePress={this.handleHeaderIconPress}
                    backgroundColor="#454343"
                    underlayColor="#454343"
                />
                <View style={styles.row}>
                    {this.renderButton("Email Receipt", false)}
                    {this.renderButton("Text Receipt", false)}
                    {
                       refundButton
                    }
                </View>
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
                <SendReceiptOverlay
                    isVisible={this.state.emailReceiptOverlayVisible}
                    closeOverlay={this.handleReceiptOverlay}
                    title="Email Receipt"
                    inputPlaceholder="Email Address"
                    text="Email"
                    handleSendButtonPress={this.handleSendButtonPress}
                />
                <SendReceiptOverlay
                    isVisible={this.state.textReceiptOverlay}
                    closeOverlay={this.handleReceiptOverlay}
                    title="Text Receipt"
                    inputPlaceholder="Phone Number"
                    text="Text"
                    handleSendButtonPress={this.handleSendButtonPress}
                />
                <RefundTypeOverlay
                    isVisible={this.state.refundSelectOverlayVisible}
                    handleClose={this.handleRefundTypeSelectOverlay}
                    handleRefundType={this.handleSelectedRefundType}
                />
                <PartialRefundOverlay
                    isVisible={this.state.partialRefundOverlayVisible}
                    handleClose={this.handlePartialRefundOverlay}
                    paymentAmount={payment.amount}
                    partialRefund={this.beginPartialRefund}
                />
                <ConfirmRefundOverlay
                    isVisible={this.state.confirmRefundOverlayVisible}
                    handleClose={this.handleConfirmRefundOverlay}
                    issueRefund={this.issueRefund}
                />
            </View>
        );
    }
}