import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Overlay, Input, Button} from 'react-native-elements';

import { styles } from '../styles/PartialRefundOverlayStyles';

export default class RefundTypeOverlay extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isDisabled: false,
            input: "",
            errorMessage: ""
        }
    }

    toggleDisabled = () => {
        this.setState({isDisabled: !this.state.isDisabled});
    }

    handleInputChange = (text) => {
        this.setState({input: text}, () => {
            this.validateInput(text);
        });
    }

    validateInput = (textEntered) => {
        console.log(textEntered);
        console.log(Number(textEntered));
        if(Number(textEntered)){
            console.log("true");
            (Number(textEntered) > Number(this.props.paymentAmount))
                ?this.setState({
                    errorMessage: "Cannot refund more than payment's total",
                    isDisabled: true,
                    input: textEntered
                })
                : this.setState({
                    errorMessage: "",
                    isDisabled: false,
                    input: textEntered
                });
        }
        else{
            console.log("false");
            this.setState({
                errorMessage: "Need to enter an amount",
                isDisabled: true,
                input: textEntered
            });
        }
    }

    render() {
        return (
            <Overlay
                isVisible={this.props.isVisible}
                onBackdropPress={() => this.props.handleClose()}
                height='52%'
                width='75%'
                borderRadius={10}
            >
                <View style={styles.container}>
                    <Text style={styles.text}>Enter Partial Refund Amount</Text>
                    <Input
                        placeholder="Dollar Amount"
                        keyboardType="number-pad"
                        containerStyle={styles.inputContainer}
                        value={this.state.input}
                        onChangeText={(text) => this.handleInputChange(text)}
                        errorMessage={this.state.errorMessage}
                        errorStyle={styles.errorStyle}
                    />
                    <Button
                        type="solid"
                        title="Refund"
                        containerStyle={styles.buttonContainer}
                        titleStyle={styles.text}
                        disabled={this.state.isDisabled}
                        disabledStyle={{ backgroundColor: '#b3b2b1' }}
                        disabledTitleStyle={{ color: '#fff' }}
                        onPress={() => this.props.partialRefund(this.state.input)}
                    />
                </View>
            </Overlay>
        );
    }
}
