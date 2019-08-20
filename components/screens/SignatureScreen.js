import React, { Component } from 'react';
import { View, Text, StyleSheet} from 'react-native';
import SignatureCapture from 'react-native-signature-capture';
import CollectTip from '../CollectTip';
import { defaultTips } from '../../helperMethods/defaultTips';
import { storageGet } from '../../helperMethods/localStorage';
import { Button } from 'react-native-elements';
import { StackActions, NavigationActions } from 'react-navigation';

defaultTips.push("Other");

const resetAction = StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({ routeName: 'Main' })],
}); //Reset stack if payment is cancelled

export default class SignatureScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            defaultTipIndex: 0,
            useCustomTips: false,
            arraySentToTabbedControl: defaultTips,
            customTipArray: [],
            orientation: "landscape",
            subtotal: this.props.navigation.state.params.tipAdjustmentData.amount,
            totalWithTip: 0,
            tipAmount: 0 //Used to store in MX Merchant's backend for tip adjustment
        };

        this.customTips = []; //Used as the array from the string returned from AsyncStorage

        this.useCustomTipCheck = this.useCustomTipCheck.bind(this);
        this.handleTipChange = this.handleTipChange.bind(this);
        this.manageCustomTips = this.manageCustomTips.bind(this); //Used splitting string of custom tips into array.
        this.changeOrientation = this.changeOrientation.bind(this);
        this.handleTotalWithTipChange = this.handleTotalWithTipChange.bind(this);
        this.handleTipAmountChange = this.handleTipAmountChange.bind(this);
        this.handleContinuePress = this.handleContinuePress.bind(this);
        this.handleCancelPress = this.handleCancelPress.bind(this);
        this.voidPayment = this.voidPayment.bind(this);
    }

    componentDidMount() {
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
        let customTips = await storageGet("customTips");
        let customTipArray = ["No Tip"];

        customTips = customTips.replace(/(\[)|(\])|(\")+/g, "");
        let tempArray = customTips.split(",");


        for(let i = 0; i < tempArray.length; i++){
            customTipArray.push(tempArray[i]);
        }

        customTipArray.push("Other");

        this.setState({customTipArray: [...customTipArray]});
    }

    changeOrientation(orientation) {
        this.setState({orientation: orientation});
    }

    handleTotalWithTipChange(total) {
        this.setState({totalWithTip: total});
    }

    handleTipAmountChange(amount) {
        this.setState({tipAmount: amount});
    }

    handleContinuePress() {
        console.log("in continue press")
        console.log(this.state.totalWithTip)
        console.log(this.state.tipAmount)

        let saleWithTipAdjustment = {
            merchantId: this.props.navigation.state.params.tipAdjustmentData.merchantId,
            paymentToken: this.props.navigation.state.params.tipAdjustmentData.paymentToken,
            tenderType: "Card",
            tip: this.state.tipAmount,
            amount: this.state.totalWithTip,
            authCode: this.props.navigation.state.params.tipAdjustmentData.authCode,
            authOnly: false
        }

        console.log(saleWithTipAdjustment);

        //navigate to next page withthis 
    }

    handleCancelPress() {
        this.voidPayment();
        this.props.navigation.dispatch(resetAction);
    }

    async voidPayment() {
        let encodedUser = await storageGet("encodedUser");

        let headers = {
            'Authorization' : 'Basic ' + encodedUser,
            'Content-Type' : 'application/json; charset=utf-8'
        }

        fetch(`https://sandbox.api.mxmerchant.com/checkout/v3/payment/${this.props.navigation.state.params.tipAdjustmentData.id}`,{
            method: "DELETE",
            headers: headers,
        });
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
                    subtotal={this.state.subtotal}
                    totalWithTip={this.state.totalWithTip}
                    tipAmount={this.state.tipAmount}
                    totalChange={this.handleTotalWithTipChange}
                    tipChange={this.handleTipAmountChange}
                    handleOrientationChange={this.changeOrientation}
                />
                <View style={styles.signatureContainer}>
                    <SignatureCapture
                        style={styles.signature}
                        ref="sign"
                        saveImageFileInExtStorage={false}
                        showNativeButtons={false}
                        showTitleLabel={true}
                        viewMode={this.state.orientation}
                    />
                </View>
                <View style={styles.textSection}>
                    <Text style={styles.text}>Please sign your signature above.</Text>
                </View> 
                <View style={styles.lowerSection}>
                    <View style={styles.row}>
                        <Button
                            title="Cancel"
                            onPress={() => this.handleCancelPress()}
                            borderRadius={25}
                            containerStyle={styles.buttonContainer}
                            buttonStyle={[styles.buttonStyle, {backgroundColor: 'red'}]}
                            titleStyle={styles.titleStyle}
                        />
                        <View style={styles.spacer}></View>
                        <Button
                            title="Continue"
                            onPress={() => this.handleContinuePress()}
                            borderRadius={25}
                            containerStyle={styles.buttonContainer}
                            buttonStyle={styles.buttonStyle}
                            titleStyle={styles.titleStyle}
                        />
                    </View>
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
    totalContainer: {
        flexDirection: 'column'
    },
    textSection: {
        alignItems: 'center'
    },
    text: {
        fontSize: 25
    },
    lowerSection: {
        backgroundColor: '#808080',
        height: 120,
        alignItems: 'center'
    },
    spacer: {
        marginLeft: 50,
        marginRight: 50
    },
    buttonContainer: {
        marginTop: 30,
        height: 60,
        width: 150,
        borderRadius: 25
    },
    buttonStyle: {
        height: 60,
        width: 150,
        borderRadius: 25
    },
    titleStyle: {
        fontSize: 25
    }
});