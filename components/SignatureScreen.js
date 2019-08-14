import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableHighlight} from 'react-native';
import SignatureCapture from 'react-native-signature-capture';
import CollectTip from './CollectTip';
import AsyncStorage from '@react-native-community/async-storage';
import { defaultTips } from './defaultTips';

defaultTips.push("Other");

export default class SignatureScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            defaultTipIndex: 0,
            useCustomTips: false,
            arraySentToTabbedControl: defaultTips,
            customTipArray: []
        };

        this.customTips = []; //Used as the array from the string returned from AsyncStorage

        this.handleTipChange = this.handleTipChange.bind(this);
        this.manageCustomTips = this.manageCustomTips.bind(this); //Used splitting string of custom tips into array.
    }

    async componentDidMount() {
        let defaultTipIndex = await AsyncStorage.getItem("selectedDefaultTip");
        console.log(defaultTipIndex);

        let useCustomTips = await AsyncStorage.getItem("useCustomTips");
        console.log("useCustomTip is " + useCustomTips);

        if(useCustomTips === "true"){
            this.setState({useCustomTips: true});
            this.manageCustomTips();

        }
        else{
            this.setState({defaultTipIndex: defaultTipIndex})
        }
    }

    handleTipChange(index) {
        this.setState({defaultTipIndex: index});
    }

    async manageCustomTips() {
        let customTips = await AsyncStorage.getItem("customTips");
        let customTipArray = ["No Tip"];

        customTips = customTips.replace(/(\[)|(\])|(\")+/g, "");
        let tempArray = customTips.split(",");

        this.customTips.push("No Tip");
        for(let i = 0; i < tempArray.length; i++){
            customTipArray.push(tempArray[i]);
        }

        customTipArray.push("Other");

        this.setState({customTipArray: [...customTipArray]});
    }

    saveSign() {
        this.refs["sign"].saveImage();
    }
 
    resetSign() {
        this.refs["sign"].resetImage();
    }
 
    _onSaveEvent(result) {
        //
        //result.encoded - for the base64 encoded png
        //result.pathName - for the file path name
        console.log(result);
    }
    _onDragEvent() {
         // This callback will be called when the user enters signature
        console.log("dragged");
    }

    render() {
        let tipArray;
        if(this.state.useCustomTips){
            tipArray = this.state.customTipArray
        }
        else{
            tipArray = defaultTips;
        }
        return (
            <View style={styles.container}>
                <CollectTip tipArray={tipArray} tipIndex={this.state.defaultTipIndex} handleChange={this.handleTipChange}/>
                <View style={styles.signatureContainer}>
                    <SignatureCapture
                        style={styles.signature}
                        ref="sign"
                        onSaveEvent={this._onSaveEvent}
                        onDragEvent={this._onDragEvent}
                        saveImageFileInExtStorage={false}
                        showNativeButtons={false}
                        showBorder={true}
                        viewMode="portrait"
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