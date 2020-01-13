import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Button, Icon } from 'react-native-elements';
import { StackActions, NavigationActions } from 'react-navigation';
import Orientation from 'react-native-orientation';

import SendReceiptOverlay from '../overlays/SendReceiptOverlay';

import { getReceipt } from '../../api_requests/getReceipt';

import { removeItem } from '../../helpers/localStorage';
import { showAlert } from '../../helpers/showAlert';

import { styles } from '../styles/ReceiptStyles';

const resetAction = StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({ routeName: 'DrawerStack' })],
}); //Reset stack back to Main screen

export default class ReceiptScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            emailReceiptOverlayVisible: false,
            textReceiptOverlay: false,
        };
    }

    componentWillMount() {
        Orientation.lockToPortrait();
        removeItem("selectedCustomerId");
    }

    handleReceiptButtonPress = (text) => {
        this.handleReceiptOverlay(text);
    }

    handleSendButtonPress = (input, fieldName) => {
        this.sendReceipt(input, fieldName);
    }

    handleReceiptOverlay = (buttonPressed) => {
        (buttonPressed === "Email")
            ? this.setState({ emailReceiptOverlayVisible: !this.state.emailReceiptOverlayVisible })
            : this.setState({ textReceiptOverlay: !this.state.textReceiptOverlay });
    }

    createReceiptButton = (title, iconName, iconType, text) => {
        return (
            <Button
                title={title}
                containerStyle={styles.receiptButtonContainer}
                buttonStyle={styles.receiptButtonStyle}
                titleStyle={styles.receiptTitleStyle}
                onPress={() => this.handleReceiptButtonPress(text)}
                icon={
                    <Icon
                        name={iconName}
                        type={iconType}
                        color="#fff"
                        size={50}
                    />
                }
            />
        );
    }

    sendReceipt = async (input, fieldName) => {
        let status, alertTitle, alertMessage;
        if(fieldName === "Text"){
            let cleanedInput = ("" + input).replace(/\D/g, '');
            console.log(this.props.navigation.state.params.paymentId); //Remove after test.
            console.log(cleanedInput);
            status = await getReceipt(this.props.navigation.state.params.paymentId, cleanedInput);

            (status === 202)
                ? alertMessage = "Receipt sent via SMS."
                : alertMessage = "Receipt could not be sent via SMS.";
        }
        else if(fieldName === "Email"){
            console.log(input); //Remove after test.
            status = await getReceipt(paymentId, input);

            (status === 202)
                ? alertMessage = "Receipt sent via email."
                : alertMessage = "Receipt could not be sent via email";
        }

        (status === 202)
            ? alertTitle = "Receipt Sent!"
            : alertTitle = "Receipt Not Sent!";

        showAlert(alertTitle, alertMessage);
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.text}>Send receipt through:</Text>
                <View style={styles.row}>
                    {this.createReceiptButton("EMAIL", "mail", "feather", "Email")}
                    {this.createReceiptButton("TEXT", "message1", "antdesign", "Text")}
                </View>
                <View style={styles.divider} />
                <Button
                    title="No Receipt"
                    onPress={() => this.props.navigation.dispatch(resetAction)}
                    containerStyle={styles.buttonContainer}
                    titleStyle={styles.titleStyle}
                />
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
            </View>
        );
    }
}