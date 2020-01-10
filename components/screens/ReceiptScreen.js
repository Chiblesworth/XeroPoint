import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Button, Icon } from 'react-native-elements';
import { StackActions, NavigationActions } from 'react-navigation';
import Orientation from 'react-native-orientation';

import SendReceiptOverlay from '../overlays/SendReceiptOverlay';

import { getReceipt } from '../../api_requests/getReceipt';

import { styles } from '../styles/ReceiptStyles';
//TEST
import base64 from 'react-native-base64';
import { removeItem } from '../../helpers/localStorage';

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
        if(fieldName === "Text"){
            let cleanedInput = ("" + input).replace(/\D/g, '');
        }
        // let url;
        // //let paymentId = this.props.navigation.state.params.sale.id;
        // //let encodedUser = await storageGet("encodedUser");
  
        // paymentId = 84002558;
        // fetch("https://api.mxmerchant.com/checkout/v3/payment", {
        //     method: "GET",
        //     headers: headers
        // }).then((response) => {
        //     console.log("Procinc payments")
        //     console.log(response.json())
        // })
        // if (fieldName === "Email") {
        //     url = `https://api.mxmerchant.com/checkout/v3/paymentreceipt?id=${paymentId}&contact=${input}`;

        //     fetch(url, {
        //         method: "POST",
        //         headers: headers,
        //         //qs: {id: paymentId, contact: input}
        //     }).then((response) => {
        //         console.log(response);
        //         console.log(response.json());
        //     })
        // }
        // else {
        //     url = `https://api.mxmerchant.com/checkout/v3/paymentreceipt?id=${paymentId}&contact=${input}`;

        //     fetch(url, {
        //         method: "POST",
        //         headers: headers
        //     }).then((response) => {
        //         console.log(response);
        //         console.log(response.json());
        //     })
        // }
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