import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button, Icon, Input } from 'react-native-elements';
import SwitchToggle from 'react-native-switch-toggle';


export default class FeeDisplay extends Component {
    constructor(props) {
        super(props);

        this.state = {
            amount: "0",
            beingEdited: false
        };

        this.handleButtonPress = this.handleButtonPress.bind(this);
    }

    handleButtonPress(buttonPressed) {
        if (buttonPressed === "Edit") {
            this.setState({ beingEdited: true });
        }
        else {
            this.setState({ beingEdited: false });
            this.props.handleFeeChange(this.state.amount);
        }
    }

    render() {
        let feeDisplay;

        if (this.state.beingEdited) {
            feeDisplay = <Input
                placeholder={this.props.feeAmount}
                placeholderTextColor="white"
                containerStyle={styles.inputContainer}
                inputStyle={styles.input}
                keyboardType="numeric"
                onChangeText={(amount) => this.setState({ amount })}
            />
        }
        else {
            feeDisplay = <Text style={styles.feeText}>{this.props.feeAmount}</Text>;
        }

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

//Styles
const styles = StyleSheet.create({
    subTitle: {
        fontSize: 25,
        color: 'white',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    feeText: {
        fontSize: 50,
        color: 'white'
    },
    buttonContainer: {
        width: '50%',
        height: 75,
    },
    editButton: {
        backgroundColor: '#FFC502'
    },
    saveButton: {
        backgroundColor: '#7CFC00'
    },
    buttonTitle: {
        fontSize: 30,
        paddingRight: 15,
        color: 'black'
    },
    inputContainer: {
        width: '30%',
        height: 80,
        paddingTop: -10
    },
    input: {
        fontSize: 50,
        color: 'white'
    },
    switch: {
        alignItems: 'flex-end',
        marginRight: 10,
        marginBottom: 20
    },
});
