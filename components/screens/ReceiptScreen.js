import React, { Component } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Button, Icon } from 'react-native-elements';
//Overlays
import CreateCustomerOverlay from '../overlays/CreateCustomerOverlay';
//Helpers
import { storageGet } from '../../helperMethods/localStorage';

export default class ReceiptScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            customOverlayVisible: false,
            createdCustomerId: null
        };

        this.handleCustomerOverlay = this.handleCustomerOverlay.bind(this);
        this.createCustomer = this.createCustomer.bind(this);
        this.getCreatedCustomerId = this.getCreatedCustomerId.bind(this);
    }

    componentDidMount() {
        console.log(this.props.navigation.state.params.sale);
    }

    handleCustomerOverlay() {
        this.setState({customOverlayVisible: !this.state.customOverlayVisible})
    }

    async createCustomer(customerName, customerNumber) {
        this.handleCustomerOverlay();
        //POST a customer
        let merchantId = await storageGet("merchantId");
        let encodedUser = await storageGet("encodedUser");

        let headers = {
            'Authorization' : 'Basic ' + encodedUser,
            'Content-Type' : 'application/json; charset=utf-8'
        }

        let data = {
            merchantId: merchantId,
            name: customerName,
            firstName: customerName,
            number: customerNumber
        }

        fetch("https://sandbox.api.mxmerchant.com/checkout/v3/customer", {
            method: "POST",
            headers: headers,
            body: JSON.stringify(data)
        }).then((response) => {
            console.log(response)
            if(response.status === 201){
                //Get that specific customer that was created.
                this.getCreatedCustomerId(merchantId, headers);
            }
            else{
                //Alert there was an error
            }
        });
    }

    getCreatedCustomerId(merchantId, headers) {
        console.log(headers);
        
        fetch("https://sandbox.api.mxmerchant.com/checkout/v3/customer", {
            method: "GET",
            headers: headers,
            qs: {merchantId: merchantId}
        }).then((response) => {
            return response.json();
        }).then((Json) => {
            let newCustomer = Json.records[0];

            console.log(newCustomer);

            this.setState({createdCustomerId: newCustomer.id}, () => {
                console.log(this.state.createdCustomerId)
            });
        });
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.text}>Send receipt to:</Text>
                <Button
                    title="Create Customer"
                    onPress={() => this.handleCustomerOverlay()}
                    containerStyle={styles.buttonContainer}
                    buttonStyle={styles.buttonStyle}
                    titleStyle={styles.titleStyle}
                />
                <View style={styles.divider} />
                <Text style={styles.text}>Send receipt through:</Text>
                <View style={styles.row}>
                    <Button
                        title="EMAIL"
                        containerStyle={styles.receiptButtonContainer}
                        buttonStyle={styles.receiptButtonStyle}
                        titleStyle={styles.receiptTitleStyle}
                        icon={
                            <Icon
                                name="mail"
                                type="feather"
                                color="white"
                                size={50}
                            />
                        }
                    />
                    <Button
                        title="TEXT"
                        containerStyle={styles.receiptButtonContainer}
                        buttonStyle={styles.receiptButtonStyle}
                        titleStyle={styles.receiptTitleStyle}
                        icon={
                            <Icon
                                name="message1"
                                type="antdesign"
                                color="white"
                                size={50}
                            />
                        }
                    />
                    <Button
                        title="Print"
                        containerStyle={styles.receiptButtonContainer}
                        buttonStyle={styles.receiptButtonStyle}
                        titleStyle={styles.receiptTitleStyle}
                        icon={
                            <Icon
                                name="printer"
                                type="feather"
                                color="white"
                                size={50}
                            />
                        }
                    />
                </View>
                <CreateCustomerOverlay
                    isVisible={this.state.customOverlayVisible}
                    closeOverlay={this.handleCustomerOverlay}
                    createCustomer={this.createCustomer}
                />
            </View>
        );
    }
}

const height = Dimensions.get('window').height;
//Styles
const styles = StyleSheet.create({
    container: {
        height: height,
        backgroundColor: '#808080',
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
        marginLeft: 23
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
});
