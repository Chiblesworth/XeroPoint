import React, { Component } from 'react';
import { View, Text, StyleSheet, Dimensions} from 'react-native';
import { Overlay, Button, Input } from 'react-native-elements';
import Orientation from 'react-native-orientation';

export default class CustomTipOverlay extends Component {
    constructor(props) {
        super(props);

        this.state = {
            totalWithTip: this.props.amount,
            tip: "",
            isButtonDisabled: true
        };

        this.handleTextChange = this.handleTextChange.bind(this);
        this.adjustTotalWithTip = this.adjustTotalWithTip.bind(this);
    }

    handleTextChange(text) {
        this.setState({tip: text}, () => {
            if(this.state.tip !== ""){
                this.setState({isButtonDisabled: false});
                this.adjustTotalWithTip(text);
            }
            else{
                this.setState({isButtonDisabled: true});
                this.adjustTotalWithTip(text);
            }
        });
    }

    adjustTotalWithTip(text) {
        let tipAmount = Number(text);

        tipAmount += Number(this.props.amount);

        this.setState({totalWithTip: tipAmount}, () => {
            console.log(this.state.totalWithTip)
        });
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
                overlayBackgroundColor="#808080"
            >
                <View style={styles.container}>
                    <View style={styles.headerRow}>
                        <Button 
                            title="Cancel"
                            onPress={() => this.props.handleClose()}
                            containerStyle={styles.buttonContainer}
                            buttonStyle={styles.buttonStyle}
                            titleStyle={{color: 'red', fontSize: 20}}
                        />
                        <Text style={styles.headerText}>Custom Tip</Text>
                    </View>
                    <View style={styles.tipAdjustmentForm}>
                        <View style={styles.row}>
                            <View style={styles.column}>
                                <Text style={styles.text}>Subtotal:</Text>
                                <Text style={styles.text}>Tip:</Text>
                                <Text style={styles.text}>Total:</Text>
                            </View>
                            <View style={styles.column}>
                                {dollarSigns}
                            </View>
                            <View style={styles.column}>
                                <Text style={styles.amount}>{parseFloat(Math.round(this.props.amount * 100) / 100).toFixed(2)}</Text>
                                <Input
                                    placeholder="Dollar Amount"
                                    placeholderTextColor="grey"
                                    containerStyle={styles.inputContainer}
                                    inputContainerStyle={styles.input}
                                    inputStyle={styles.inputStyle}
                                    autoFocus={true}
                                    keyboardType="numeric"
                                    value={this.state.tip}
                                    onChangeText={(text) => this.handleTextChange(text)}
                                />
                                <Text style={styles.amount}>{parseFloat(Math.round(this.state.totalWithTip * 100) / 100).toFixed(2)}</Text>
                            </View>
                        </View>
                        <View style={styles.divider}/>
                        <View style={styles.applySection}>
                            <Button
                                title="Apply Tip"
                                onPress={() => this.props.applyChange(this.state.totalWithTip)}
                                containerStyle={styles.applyButtonContainer}
                                buttonStyle={styles.applyButtonStyle}
                                titleStyle={{color: 'blue', fontSize: 25}}
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

//Styles
const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    headerRow: {
        flexDirection: 'row',
        marginBottom: 20
    },
    row: {
        flexDirection: 'row',
        backgroundColor: 'white',
        width: '100%'
    },
    column: {
        flexDirection: 'column'
    },
    tipAdjustmentForm: {
        backgroundColor: 'white',
        width: '100%',
        borderStyle: 'solid',
        borderColor: 'white',
        borderRadius: 25,
    },
    text: {
        fontSize: 25,
        marginBottom: 10
    },
    dollarSign: {
        fontSize: 25,
        paddingLeft: 40,
        marginBottom: 10
    },
    amount: {
        fontSize: 25,
        paddingLeft: 20,
        marginBottom: 10
    },
    buttonContainer: {
        width: 100,
        height: 50
    },
    buttonStyle: {
        width: 100,
        height: 50,
        backgroundColor: '#808080'
    },
    applyButtonStyle: {
        width: 150,
        height: 100,
        backgroundColor: 'white'
    },
    applyButtonContainer: {
        width: 150,
        height: 100
    },
    headerText: {
        color: 'white',
        fontSize: 25,
        marginTop: 8,
        marginLeft: 25
    },
    inputContainer: {
        height: 37,
        width: 170,
        marginBottom: 6,
    },
    input: {
        borderBottomWidth: 0,
    },
    inputStyle: {
        fontSize: 20,
        paddingTop: 3,
        color: 'grey'
    },
    divider: {
        backgroundColor: 'black',
        height: 2,
        width: '100%'
    },
    applySection: {
        alignItems: 'center'
    },
    disabledButton: {
        backgroundColor: 'white'
    },
});