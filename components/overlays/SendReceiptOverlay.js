import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button, Overlay, Input } from 'react-native-elements';

export default class SendReceiptOverlay extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isDisabled: false,
            input: "",
            errorMessage: ""
        };

        this.toggleDisabled = this.toggleDisabled.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.validateInput = this.validateInput.bind(this);
    }

    toggleDisabled() {
        this.setState({isDisabled: !this.state.isDisabled});
    }

    handleInputChange(text) {
        this.setState({input: text}, () => {
            this.validateInput(this.props.text, text);
        })
    }

    validateInput(inputName, textEntered){
        let regEx;
        console.log("Here in validate input")
        if(inputName === "Email"){
            //Validate email
            regEx = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            
            if(!regEx.test(textEntered)){
                this.setState({errorMessage: "Invalid email entered."});
            }
            else{
                this.setState({errorMessage: ""});
            }
        }
        else{
            //Validate number
            regEx = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;

            if(!regEx.test(textEntered)){
                this.setState({errorMessage: "Invalid phone number entered."});
            }
            else{
                this.setState({errorMessage: ""});
            }
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
                        <Button
                            title="Cancel"
                            onPress={() => this.props.closeOverlay(this.props.text)}
                            containerStyle={{ width: 100, height: 50 }}
                            buttonStyle={{ width: 100, height: 50, backgroundColor: '#808080' }}
                            titleStyle={{ color: 'red', fontSize: 20 }}
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
                            autoFocus={true}
                            errorMessage={this.state.errorMessage}
                            errorStyle={styles.errorStyle}
                            containerStyle={styles.inputContainer}
                            inputContainerStyle={styles.inputContainerStyle}
                            inputStyle={styles.inputStyle}
                        />
                    </View>
                    <View style={styles.createSection}>
                        <Button
                            title="Send"
                            //disabled={this.state.isDisabled}
                            containerStyle={styles.buttonContainer}
                            buttonStyle={styles.buttonStyle}
                            titleStyle={styles.titleStyle}
                            disabledStyle={{ backgroundColor: '#b3b2b1' }}
                            disabledTitleStyle={{ color: 'white' }}
                        />
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
    text: {
        fontSize: 20,
        color: 'white'
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
    errorStyle: {
        fontSize: 14,
        paddingLeft: 20
    }
});
