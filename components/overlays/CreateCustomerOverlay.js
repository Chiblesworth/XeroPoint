import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button, Overlay, Input } from 'react-native-elements';

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
                                onPress={() => this.props.createCustomer(this.state.customerName, this.state.customerNumber)}
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
