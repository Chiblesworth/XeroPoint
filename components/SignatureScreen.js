import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableHighlight} from 'react-native';
import SignatureCapture from 'react-native-signature-capture';
import CollectTip from './CollectTip';
import AsyncStorage from '@react-native-community/async-storage';
import { defaultTips } from './defaultTips';
import { storageGet, storageSet } from './localStorage';
import Orientation from 'react-native-orientation';

defaultTips.push("Other");

export default class SignatureScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            defaultTipIndex: 0,
            useCustomTips: false,
            arraySentToTabbedControl: defaultTips,
            customTipArray: [],
            orientation: "landscape"
        };

        this.customTips = []; //Used as the array from the string returned from AsyncStorage

        this.useCustomTipCheck = this.useCustomTipCheck.bind(this);
        this.handleTipChange = this.handleTipChange.bind(this);
        this.manageCustomTips = this.manageCustomTips.bind(this); //Used splitting string of custom tips into array.
        this.changeOrientation = this.changeOrientation.bind(this);
    }

    componentDidMount() {
        //Orientation.lockToLandscape();
        this.useCustomTipCheck();
    }

    async useCustomTipCheck() {
        let selectedDefaultTip = await storageGet("selectedDefaultTip");
        let useCustomTips = await storageGet("useCustomTips");

        if(useCustomTips === "true"){
            this.setState({useCustomTips: true});
            this.manageCustomTips();
        }
        else{
            this.setState({defaultTipIndex: selectedDefaultTip});
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

    changeOrientation(orientation) {
        this.setState({orientation: orientation});
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
                <CollectTip 
                    tipArray={tipArray} 
                    tipIndex={this.state.defaultTipIndex} 
                    handleChange={this.handleTipChange}
                    amount={this.props.navigation.state.params.tipAdjustmentData.amount}
                    handleOrientationChange={this.changeOrientation}
                />
                <View style={styles.signatureContainer}>
                    <SignatureCapture
                        style={styles.signature}
                        ref="sign"
                        onSaveEvent={this._onSaveEvent}
                        onDragEvent={this._onDragEvent}
                        saveImageFileInExtStorage={false}
                        showNativeButtons={false}
                        //showBorder={true}
                        showTitleLabel={true}
                        viewMode={this.state.orientation}
                    />
                </View>
                <View style={styles.textSection}>
                    <Text style={styles.text}>Please sign your signature above.</Text>
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
        marginBottom: 40
    },
    totalContainer: {
        flexDirection: 'column'
    },
    signatureContainer: {
        flex: 1,
        borderBottomWidth: 3,
        borderBottomColor: 'black'
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
    },
    textSection: {
        alignItems: 'center'
    },
    text: {
        fontSize: 25
    }
});