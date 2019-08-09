import React, { Component } from 'react';
import { View, Text, StyleSheet} from 'react-native';
import { Overlay, Button, Input } from 'react-native-elements';

export default class TipOverlay extends Component {
    constructor(props) {
        super(props);

        this.state = {
        }

        this.newCustomTips = [...this.props.customTips];

        this.handleTipChange = this.handleTipChange.bind(this);
        this.printArray = this.printArray.bind(this);
        this.checkBeforeChange = this.checkBeforeChange.bind(this);
    }

    handleTipChange(tipAmount, index) {
        tipAmount += "%";   
        
        this.props.customTips[index] = tipAmount; 
    }

    printArray() {
        for(let i = 0; i < this.props.customTips.length; i++){
            console.log(this.props.customTips[i])
        }
    }
    
    checkBeforeChange() {         
        this.props.applyChanges(this.props.customTips);
        this.props.handleClose();
    }

    render() {
        const rows = [];

        for(let i = 0; i < this.props.customTips.length; i++){
            rows.push(
                <View key={i} style={styles.row}>
                            <View>
                                <Text style={styles.tipHeader}>Custom Tip {i + 1}:</Text>
                            </View>
                            <View>
                                <Input
                                    placeholder={this.props.customTips[i].replace(/[^0-9]/, "")}
                                    containerStyle={styles.inputContainer}
                                    inputContainerStyle={styles.inputContainerStyle}
                                    onChangeText={(text) => this.handleTipChange(text, i)}
                                />
                            </View>
                            <View>
                                <Text style={styles.percentSign}>%</Text>
                            </View>
                        </View>
            )
        }
        return (
            <Overlay
                isVisible={this.props.visible}
                onBackdropPress={() => this.props.handleClose()}
            >
                <View style={styles.container}>
                    <Text style={styles.title}>Adjust Tip Amounts</Text>
                    <Text style={styles.text}>Here you can set custom tip percentages</Text>
                    {rows}
                    <View style={styles.row}>
                        <View>
                            <Button 
                                title="Cancle"
                                onPress={() => this.props.handleClose()}
                                containerStyle={styles.buttonContainer}
                                buttonStyle={styles.buttonStyle}
                                titleStyle={{color: 'red', fontSize: 20}}
                            />
                        </View>
                        <View>
                            <Button 
                                title="Apply Changes"
                                onPress={() => this.checkBeforeChange()}
                                containerStyle={styles.buttonContainer2}
                                buttonStyle={styles.buttonStyle}
                                titleStyle={{color: 'blue', fontSize: 20}}
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
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 25,
        marginBottom: 25
    },
    text: {
        fontSize: 20,
        marginBottom: 25
    },
    row: {
        flexDirection: 'row'
    },
    inputContainer: {
        width: 55,
        height: 40,
    },
    inputContainerStyle: {
        paddingTop: 15
    },
    tipHeader: {
        marginRight: 30,
        marginTop: 15,
        fontSize: 20,
    },
    percentSign: {
        marginTop: 10,
        fontSize: 27
    },
    //Two button containers here because it was the only way I was able to add space between the two buttons.
    //Could not get justifyContent: 'space-between' to work with the current set up.
    buttonContainer: {
        width: 100,
        height: 50,
        marginTop: 130,
        marginRight: 40,
    },
    buttonContainer2: {
        width: 100,
        height: 50,
        marginTop: 130,
        marginLeft: 40,
    },
    buttonStyle: {
        width: 100,
        height: 50,
        backgroundColor: 'white'
    }
});
