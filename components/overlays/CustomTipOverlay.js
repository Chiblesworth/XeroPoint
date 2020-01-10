import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Overlay, Button, Input } from 'react-native-elements';

import { styles } from '../styles/CustomTipOverlayStyles';

export default class CustomTipOverlay extends Component {
    constructor(props) {
        super(props);

        this.state = {
            total: this.props.subtotal,
            tip: "",
            isButtonDisabled: true
        };
    }

    handleTextChange = (text) => {
        this.setState({tip: text}, () => {
            (this.state.tip !== "")
                ? this.setState({isButtonDisabled: false}, () => {
                    this.adjustTotal(this.state.tip);
                })
                : this.setState({isButtonDisabled: true}, () => {
                    this.adjustTotal(this.state.tip);
                });
        })
    }

    adjustTotal = (text) => {
        let tip = Number(text);
        tip += Number(this.props.subtotal);

        this.setState({total: tip});
    }

    render() {
        let dollarSigns = [];

        for(let i = 0; i < 3; i++){
            dollarSigns.push(
                <Text key={i} style={styles.dollarSign}>$</Text>
            )
        }
        return (
            <Overlay
                isVisible={this.props.isVisible}
                fullScreen={true}
                overlayBackgroundColor="#454343"
            >
                <View style={styles.container}>
                    <View style={styles.headerRow}>
                        <Button 
                            title="Cancel"
                            onPress={() => this.props.handleClose()}
                            containerStyle={styles.buttonContainer}
                            buttonStyle={styles.buttonStyle}
                            titleStyle={{color: '#E50F0F', fontSize: 20}}
                        />
                        <Text style={styles.headerText}>Custom Tip</Text>
                    </View>
                    <View style={styles.tipAdjustmentForm}>
                        <View style={styles.row}>
                            <Text style={styles.text}>Subtotal:</Text>
                            <Text style={styles.amount}>${parseFloat(Math.round(this.props.subtotal * 100) / 100).toFixed(2)}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.text}>Tip:                  $</Text>
                            <Input
                                placeholder="Dollar Amount"
                                placeholderTextColor="grey"
                                containerStyle={styles.inputContainer}
                                inputStyle={styles.inputStyle}
                                autoFocus={true}
                                keyboardType="numeric"
                                value={this.state.tip}
                                onChangeText={(text) => this.handleTextChange(text)}
                            />
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.text}>Total:</Text>
                            <Text style={styles.amount}>${parseFloat(Math.round(this.state.total * 100) / 100).toFixed(2)}</Text>
                        </View>
                        <View style={styles.divider}/>
                        <View style={styles.applySection}>
                            <Button
                                title="Apply Tip"
                                onPress={() => this.props.applyCustomTip(Number(this.state.total), Number(this.state.tip))}
                                buttonStyle={styles.applyButtonStyle}
                                titleStyle={{color: '#0080FF', fontSize: 20}}
                                disabled={this.state.isButtonDisabled}
                                disabledStyle={styles.disabledButton}
                            />
                        </View>
                    </View>
                </View>
            </Overlay>
        );
    }
}