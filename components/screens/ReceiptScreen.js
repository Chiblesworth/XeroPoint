import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button, Icon } from 'react-native-elements';
import { StackActions, NavigationActions } from 'react-navigation';
//Overlays
import SendReceiptOverlay from '../overlays/SendReceiptOverlay';
//Helpers
import { storageGet, removeItem, storageSet } from '../../helpers/localStorage';
//TEST
import base64 from 'react-native-base64';

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
            isDisabled: false
        };
    }

    async componentWillMount() {
        console.log(this.props.navigation.state.params.sale);
        let selectedCustomerId = await storageGet("selectedCustomerId");

        if (!!selectedCustomerId) {
            console.log("selectedCustomerId is " + selectedCustomerId);
            this.setState({
                createdCustomerId: Number(selectedCustomerId),
                isDisabled: true
            }); //Used in case the user already chose a customer
        }
    }

    handleReceiptOverlay = (buttonPressed) => {
        if (buttonPressed === "Email") {
            this.setState({ emailReceiptOverlayVisible: !this.state.emailReceiptOverlayVisible });
        }
        else {
            this.setState({ textReceiptOverlay: !this.state.textReceiptOverlay });
        }
    }

    handleReceiptButtonPress = (text) => {
        this.handleReceiptOverlay(text);
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

    handleSendButtonPress = (input, fieldName) => {
        this.finalizeSale();

        this.sendReceipt(input, fieldName);
    }

    sendReceipt = async (input, fieldName) => {
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
                    {this.createReceiptButton("PRINT", "printer", "feather", null)}
                </View>
                <View style={styles.divider} />
                <Button
                    title="No Receipt"
                    onPress={() => this.props.navigation.dispatch(resetAction)}
                    containerStyle={styles.horizontalButtonContainer}
                    buttonStyle={styles.horizontalButtonStyle}
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

//Styles
const styles = StyleSheet.create({
    container: {
        height: '100%',
        backgroundColor: '#454343',
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 25,
        color: 'white'
    },
    divider: {
        borderBottomColor: '#f2eee4',
        borderBottomWidth: 2,
        width: 300,
        marginTop: 20,
        marginBottom: 20
    },
    buttonContainer: {
        height: 70,
        width: 200,
        marginTop: 20,
        marginBottom: 20
    },
    buttonStyle: {
        height: 70,
        width: 200
    },
    titleStyle: {
        fontSize: 23
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginLeft: '10%'
    },
    receiptButtonContainer: {
        flex: 1,
        height: 100,
        width: 100,
        marginTop: 20,
        marginBottom: 20
    },
    receiptButtonStyle: {
        height: 100,
        width: 100,
        flexDirection: 'column'
    },
    receiptTitleStyle: {
        fontSize: 20
    },
    horizontalButtonContainer: {
        width: 250,
        height: 60
    },
    horizontalButtonStyle: {
        width: 250,
        height: 60
    },
});
