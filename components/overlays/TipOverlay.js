import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Overlay, Button, Input } from 'react-native-elements';

import { styles } from '../styles/TipOverlayStyles';

export default class TipOverlay extends Component {
    constructor(props) {
        super(props);

        this.newCustomTips = [...this.props.customTips];
    }

    handleTipChange = (tipAmount, index) => {
        tipAmount += "%";   
        this.props.customTips[index] = tipAmount; 
    }

    printArray = () => {
        for(let i = 0; i < this.props.customTips.length; i++){
            console.log(this.props.customTips[i])
        }
    }
    
    checkBeforeChange = () => {         
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
                borderRadius={15}
                height={500}
            >
                <View style={styles.container}>
                    <Text style={styles.title}>Adjust Tip Amounts</Text>
                    <Text style={styles.text}>Here you can set custom tip percentages</Text>
                    {rows}
                    <View style={styles.row}>
                        <Button 
                            title="Cancel"
                            onPress={() => this.props.handleClose()}
                            containerStyle={styles.buttonContainer}
                            buttonStyle={styles.buttonStyle}
                            titleStyle={{color: 'red', fontSize: 20}}
                        />
                        <Button 
                            title="Apply Changes"
                            onPress={() => this.checkBeforeChange()}
                            containerStyle={styles.buttonContainer}
                            buttonStyle={styles.buttonStyle}
                            titleStyle={{color: 'blue', fontSize: 20}}
                        />
                    </View>
                </View>
            </Overlay>
        );
    }
}
