import React, { Component } from 'react';
import { View, Text, Alert,StyleSheet } from 'react-native';
import { Button, Overlay, Input } from 'react-native-elements';
//Helper Methods
import { storageGet, storageSet } from '../../helperMethods/localStorage';

export default class CreateCustomerOverlay extends Component {
    constructor(props) {
        super(props);
        this.state = {
            customerName: "",
            customerNumber: "",
            isDisabled: true
        };

        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleNumberChange = this.handleNumberChange.bind(this);
        this.isButtonDisabled = this.isButtonDisabled.bind(this);
        this.createCustomer = this.createCustomer.bind(this);
        this.getCreatedCustomerId = this.getCreatedCustomerId.bind(this);
    }

    handleNameChange(text) {
        this.setState({customerName: text}, () => {
            this.isButtonDisabled();
        });
    }

    handleNumberChange(text) {
        this.setState({customerNumber: text}, () => {
            this.isButtonDisabled();
        });
    }

    isButtonDisabled() {
        if((this.state.customerName !== "") && (this.state.customerNumber !== "")){
            this.setState({isDisabled: false});
        }
        else{
            this.setState({isDisabled: true});
        }
    }

    async createCustomer(customerName, customerNumber) {
        //POST a customer
        let merchantId = await storageGet("merchantId");
        let encodedUser = await storageGet("encodedUser");

        let headers = {
            'Authorization': 'Basic ' + encodedUser,
            'Content-Type': 'application/json; charset=utf-8'
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
            if (response.status === 201) {
                this.getCreatedCustomerId(merchantId, headers); //Get that specific customer that was created.
            }
            else {
                Alert.alert("Customer could not be created.", "The customer was not created. Please try again.")
            }
        });
    }

    getCreatedCustomerId(merchantId, headers) {
        fetch("https://sandbox.api.mxmerchant.com/checkout/v3/customer", {
            method: "GET",
            headers: headers,
            qs: { merchantId: merchantId }
        }).then((response) => {
            return response.json();
        }).then((Json) => {
            let newCustomer = Json.records[0];

            console.log("new customer")
            console.log(newCustomer);
            Alert.alert("Customer Added", newCustomer.name + " was added to payment!");
            storageSet("selectedCustomerId", newCustomer.id.toString());
            this.props.closeOverlay();
        });
    }

    render() {
        return (
            <Overlay
                isVisible={this.props.isVisible}
                fullScreen={true}
                overlayBackgroundColor="#808080"
            >
                <View style={styles.container}>
                    <View style={styles.row}>
                        {/* Styles done here for this button because it's a little more custom
                        and didn't require a bunch of extra style changes. */}
                        <Button
                            title="Cancel"
                            onPress={() => this.props.closeOverlay()}
                            containerStyle={{width: 100, height: 50}}
                            buttonStyle={{width: 100, height: 50, backgroundColor: '#808080'}}
                            titleStyle={{color: 'red', fontSize: 20}}
                        />
                        <Text style={styles.headerText}>Create Customer</Text>
                    </View>
                    <View>
                        <Input
                            placeholder="Customer Name"
                            onChangeText={(text) => this.handleNameChange(text)}
                            autoFocus={true}
                            containerStyle={styles.inputContainer}
                            inputContainerStyle={styles.inputContainerStyle}
                            inputStyle={styles.inputStyle}
                        />
                        <View style={styles.spacer} />
                        <Input 
                            placeholder="Customer Number"
                            onChangeText={(text) => this.handleNumberChange(text)}
                            keyboardType="numeric"
                            containerStyle={styles.inputContainer}
                            inputContainerStyle={styles.inputContainerStyle}
                            inputStyle={styles.inputStyle}
                        />
                        <View style={styles.createSection}>
                            <Button
                                title="Create"
                                disabled={this.state.isDisabled}
                                onPress={() => this.createCustomer(this.state.customerName, this.state.customerNumber)}
                                containerStyle={styles.buttonContainer}
                                buttonStyle={styles.buttonStyle}
                                titleStyle={styles.titleStyle}
                                disabledStyle={{backgroundColor: '#b3b2b1'}}
                                disabledTitleStyle={{color: 'white'}}
                            />
                        </View>
                    </View>
                </View>
            </Overlay>
        );
    }
}

//Styles
const styles = StyleSheet.create({
    createSection: {
        alignItems: 'center',
        marginTop: 15
    },
    row: {
        flexDirection: 'row',
        marginBottom: 20
    },
    buttonContainer: {
        width: 200,
        height: 50,
        borderRadius: 25
    },
    buttonStyle: {
        width: 200,
        height: 50,
        borderRadius: 25
    },
    titleStyle: {
        fontSize: 20
    },
    headerText: {
        color: 'white',
        fontSize: 25,
        marginTop: 8,
        marginLeft: 25
    },
    inputContainer: {
        borderRadius: 25
    },
    inputContainerStyle: {
        backgroundColor: 'white',
        borderRadius: 25
    },
    inputStyle: {
        marginLeft: 10
    },
    spacer: {
        marginTop: 20
    },
});
