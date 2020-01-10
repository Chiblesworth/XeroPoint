import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Button, Overlay, Input } from 'react-native-elements';

import { formatPhoneNumber } from '../../helpers/formatPhoneNumber';

import { styles } from '../styles/SendReceiptOverlay';

export default class SendReceiptOverlay extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isDisabled: true,
            input: "",
            errorMessage: ""
        };
    }

    toggleDisabled = () => {
        this.setState({isDisabled: !this.state.isDisabled});
    }

    handleInputChange = (text) => {
        this.setState({input: text}, () => {
            this.validateInput(this.props.text, text);
        })
    }

    validateInput = (inputName, textEntered) => {
        let regEx, errorMessage;

        if(inputName === "Email"){
            regEx = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            errorMessage = "Invalid email entered.";
        }
        else{
            regEx = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
            errorMessage = "Invalid phone number entered.";
            textEntered = formatPhoneNumber(textEntered);
        }

        (!regEx.test(textEntered))
            ? this.setState({
                errorMessage: errorMessage,
                isDisabled: true,
                input: textEntered
            })
            : this.setState({
                errorMessage: "",
                isDisabled: false,
                input: textEntered
            });
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
                        <Button
                            title="Cancel"
                            onPress={() => this.props.closeOverlay(this.props.text)}
                            containerStyle={{ width: 100, height: 50 }}
                            buttonStyle={{ width: 100, height: 50, backgroundColor: '#454343' }}
                            titleStyle={{ color: '#E50F0F', fontSize: 20 }}
                        />
                        <Text style={styles.headerText}>{this.props.title}</Text>
                    </View>
                    <View>
                        <View style={{ marginBottom: 10, marginTop: 10, alignItems: 'center' }}>
                            <Text style={styles.text}>{this.props.text} receipt to:</Text>
                        </View>
                        <Input
                            placeholder={this.props.inputPlaceholder}
                            onChangeText={(text) => this.handleInputChange(text)}
                            value={this.state.input}
                            autoFocus={true}
                            errorMessage={this.state.errorMessage}
                            errorStyle={styles.errorStyle}
                            containerStyle={styles.inputContainer}
                            inputContainerStyle={styles.inputContainerStyle}
                            inputStyle={styles.inputStyle}
                            keyboardType="numeric"
                        />
                    </View>
                    <View style={styles.createSection}>
                        <Button
                            title="Send"
                            onPress={() => this.props.handleSendButtonPress(this.state.input, this.props.text)}
                            disabled={this.state.isDisabled}
                            containerStyle={styles.buttonContainer}
                            titleStyle={styles.titleStyle}
                            disabledStyle={{ backgroundColor: '#b3b2b1' }}
                            disabledTitleStyle={{ color: '#fff' }}
                        />
                    </View>
                </View>
            </Overlay>
        );
    }
}