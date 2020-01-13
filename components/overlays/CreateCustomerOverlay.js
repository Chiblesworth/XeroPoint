import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Button, Overlay, Input } from 'react-native-elements';

import { postCustomer } from '../../api_requests/postCustomer';

import { storageGet, storageSet } from '../../helpers/localStorage';
import { showAlert } from '../../helpers/showAlert';

import { styles } from '../styles/CreateCustomerOverlayStyles';

export default class CreateCustomerOverlay extends Component {
    constructor(props) {
        super(props);
        this.state = {
            customerName: "",
            customerNumber: "",
            isDisabled: true
        };
    }

    handleNameChange = (text) => {
        this.setState({customerName: text}, () => {
            this.isButtonDisabled();
        });
    }

    handleNumberChange = (text) => {
        this.setState({customerNumber: text}, () => {
            this.isButtonDisabled();
        });
    }

    isButtonDisabled = () => {
        ((this.state.customerName != "") && (this.state.customerNumber != ""))
            ? this.setState({isDisabled: false})
            : this.setState({isDisabled: true});
    }

    createCustomer = async (customerName, customerNumber) => {
        let merchantId = await storageGet("merchantId");
        let data = {
            merchantId: merchantId,
            name: customerName,
            firstName: customerName,
            number: customerNumber
        }
        let customer = await postCustomer(data);
        
        if(customer !== null){
            showAlert("Customer Added", customer.name + " was added to the payment!");
            storageSet("selectedCustomerId", customer.id.toString());
            this.props.closeOverlay();
        }
        else{
            showAlert("Customer could not be created.", "The customer was not created. Please try again.");
        }
    }

    render() {
        return (
            <Overlay
                isVisible={this.props.isVisible}
                fullScreen={true}
                overlayBackgroundColor="#454343"
            >
                <View style={styles.container}>
                    <View style={styles.row}>
                        {/* Styles done here for this button because it's a little more custom
                        and didn't require a bunch of extra style changes. */}
                        <Button
                            title="Cancel"
                            onPress={() => this.props.closeOverlay()}
                            containerStyle={{width: 80, height: 50}}
                            buttonStyle={{width: 80, height: 50, backgroundColor: '#454343'}}
                            titleStyle={{color: '#E50F0F', fontSize: 20}}
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