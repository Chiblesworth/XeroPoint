import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Button, Icon, Input } from 'react-native-elements';
import SwitchToggle from 'react-native-switch-toggle';

import { styles } from './styles/FeeDisplayStyles';

export default class FeeDisplay extends Component {
    constructor(props) {
        super(props);

        this.state = {
            amount: "0",
            beingEdited: false
        };
    }

    handleButtonPress = (buttonPressed) => {
        (buttonPressed === "Edit")
            ? this.setState({ beingEdited: true })
            : this.setState({ beingEdited: false }, () => {
                this.props.handleFeeChange(this.state.amount);
            });
    }

    render() {
        let feeDisplay;

        (this.state.beingEdited)
            ? feeDisplay = <Input
                placeholder={this.props.feeAmount}
                placeholderTextColor="white"
                containerStyle={styles.inputContainer}
                inputStyle={styles.input}
                keyboardType="numeric"
                onChangeText={(text) => this.setState({ amount: text })}
            />
            : feeDisplay = <Text style={styles.feeText}>{this.props.feeAmount}</Text>;

        return (
            <View>
                <View style={styles.row}>
                    <Text style={styles.subTitle}>Apply {this.props.mainTitle}:</Text>
                    <View style={styles.switch}>
                        <SwitchToggle
                            switchOn={this.props.switchValue}
                            onPress={() => this.props.swtichPress(this.props.mainTitle)}
                            circleColorOff="white"
                            circleColorOn="white"
                            backgroundColorOn="blue"
                        />
                    </View>
                </View>
                <View style={styles.container}>
                    {feeDisplay}
                    <Text style={styles.feeText}>%</Text>
                </View>
                <View style={styles.container}>
                    <Button
                        icon={
                            <Icon
                                name="edit"
                                type="antdesign"
                                size={30}
                                color="black"
                            />
                        }
                        iconRight
                        title="Edit"
                        onPress={() => this.handleButtonPress("Edit")}
                        containerStyle={styles.buttonContainer}
                        buttonStyle={styles.editButton}
                        titleStyle={styles.buttonTitle}
                    />
                    <Button
                        icon={
                            <Icon
                                name="check"
                                type="antdesign"
                                size={30}
                                color="black"
                            />
                        }
                        iconRight
                        title="Save"
                        onPress={() => this.handleButtonPress("Save")}
                        containerStyle={styles.buttonContainer}
                        buttonStyle={styles.saveButton}
                        titleStyle={styles.buttonTitle}
                    />
                </View>
            </View>
        );
    }
}