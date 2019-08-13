import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableHighlight} from 'react-native';
import SignatureCapture from 'react-native-signature-capture';
import CollectTip from './CollectTip';
import AsyncStorage from '@react-native-community/async-storage';

export default class SignatureScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            defaultTipIndex: 0
        };

        this.handleTipChange = this.handleTipChange.bind(this);
    }

    async componentDidMount() {
        let defaultTipIndex = await AsyncStorage.getItem("selectedDefaultTip");
        console.log(defaultTipIndex)
        this.setState({defaultTipIndex: defaultTipIndex})
        console.log("state " + this.state.defaultTipIndex)
    }

    handleTipChange(index) {
        this.setState({defaultTipIndex: index});
    }

    saveSign() {
        this.refs["sign"].saveImage();
    }
 
    resetSign() {
        this.refs["sign"].resetImage();
    }
 
    _onSaveEvent(result) {
        //result.encoded - for the base64 encoded png
        //result.pathName - for the file path name
        console.log(result);
    }
    _onDragEvent() {
         // This callback will be called when the user enters signature
        console.log("dragged");
    }

    render() {
        return (
            <View style={styles.container}>
                <CollectTip tipIndex={this.state.defaultTipIndex} handleChange={this.handleTipChange}/>
                <View style={styles.signatureContainer}>
                    <SignatureCapture
                        style={styles.signature}
                        ref="sign"
                        onSaveEvent={this._onSaveEvent}
                        onDragEvent={this._onDragEvent}
                        saveImageFileInExtStorage={false}
                        showNativeButtons={false}
                        showBorder={true}
                        viewMode="landscape"
                    />
                </View>
 
                <View style={styles.row}>
                    <TouchableHighlight style={styles.buttonStyle}
                        onPress={() => { this.saveSign() } } >
                        <Text>Save</Text>
                    </TouchableHighlight>
 
                    <TouchableHighlight style={styles.buttonStyle}
                        onPress={() => { this.resetSign() } } >
                        <Text>Reset</Text>
                    </TouchableHighlight>
 
                </View>
 
            </View>
        );
    }
}

//Styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        marginTop: 25
    },
    row: {
        flex: 1,
        flexDirection: 'row',
        marginBottom: 25
    },
    totalContainer: {
        flexDirection: 'column'
    },
    signatureContainer: {
        flex: 1,
        borderWidth: 5,
        borderColor: 'black'
    },
    signature: {
        flex: 1
    },
    buttonStyle: {
        flex: 1, 
        justifyContent: "center", 
        alignItems: "center", 
        height: 50,
        backgroundColor: "#eeeeee",
        margin: 10
    },
    totalContainer: {
        flexDirection: 'column'
    },
    tabsContainerStyle: {
        borderColor: '#808080'
    },
    tabStyle: {
        backgroundColor: 'white',
        borderColor: 'black'
    },
    tabTextStyle: {
        fontSize: 18,
        color: 'black'
    },
    activeTabStyle: {
        // backgroundColor: '#808080'
        backgroundColor: 'blue'
    },
    activeTabTextStyle: {
        color: 'purple'
    }
});