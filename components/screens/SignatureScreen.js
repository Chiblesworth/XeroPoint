import React, { Component } from 'react';
import { View, Text, StyleSheet} from 'react-native';
import { Button } from 'react-native-elements';
import { StackActions, NavigationActions } from 'react-navigation';
import SignatureCapture from 'react-native-signature-capture';
//Components
import CollectTip from '../CollectTip';
import CustomTipOverlay from '../overlays/CustomTipOverlay';
//Helpers
import { defaultTips } from '../../helperMethods/defaultTips';
import { getCustomTipsArray } from '../../helperMethods/customTips';
import { storageGet, removeItem } from '../../helperMethods/localStorage';
import { stringToBoolean } from '../../helperMethods/stringToBoolean';
import { feeCalculations } from '../../helperMethods/feeCalculations';

const resetAction = StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({ routeName: 'DrawerStack' })],
}); //Reset stack if payment is cancelled

export default class SignatureScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            orientation: "landscape", //Switch when closing the Overlay
            tipArray: [], //Will be either defaultTips or customTips
            selectedIndex: 0,
            subtotal: Number(this.props.navigation.state.params.tipAdjustmentData.amount),
            total: 0,
            tip: 0,
            overlayVisible: false
        };

        this.adjustTip = this.adjustTip.bind(this);
        this.handleSegmentedControlSwitch = this.handleSegmentedControlSwitch.bind(this);
        this.toggleOverlay = this.toggleOverlay.bind(this);
        this.overlayCancelPressed = this.overlayCancelPressed.bind(this);
        this.applyCustomTip = this.applyCustomTip.bind(this);
        this.handleCancelPress = this.handleCancelPress.bind(this);
        this.voidPayment = this.voidPayment.bind(this);
        this.handleContinuePress = this.handleContinuePress.bind(this);
    }

    async componentWillMount() {
        let selectedDefaultTip = await storageGet("selectedDefaultTip");
        let useCustomTips = await storageGet("useCustomTips");
        let customTipsBool = await stringToBoolean(useCustomTips);

        if(customTipsBool){
            let customTipArray = await getCustomTipsArray();
            customTipArray.push("Other");
            
            this.setState({tipArray: [...customTipArray]}, () => {
                console.log("In state now");
                console.log(this.state.tipArray);

                this.adjustTip(this.state.selectedIndex);
            });
        }
        else{
            if(defaultTips.length === 4){
                defaultTips.push("Other");
            }
            this.setState({
                tipArray: [...defaultTips], 
                selectedIndex: Number(selectedDefaultTip)}, () => {
                    console.log("In state now");
                    console.log(this.state.tipArray);
                    console.log(this.state.selectedIndex);

                    this.adjustTip(this.state.selectedIndex);
            });

        }
    }

    adjustTip(index) {
        if(index === 0){
            let total = parseFloat(Math.round(this.state.subtotal * 100) / 100).toFixed(2);
            let tip = parseFloat(Math.round(0 * 100) / 100).toFixed(2) //Formats numbers with two decimals
            
            this.setState({
                total: Number(total),
                tip: Number(tip)
            }, () => {
                console.log("total = " + this.state.total)
                console.log("tip = " + this.state.tip)
            })
        }
        else if(index === 4){
            this.setState({orientation: "portrait"})
            this.toggleOverlay();
        }
        else{
            let tipPercentage = this.state.tipArray[index].replace(/(%)+/g, "");
            
            let total = feeCalculations(this.state.subtotal, tipPercentage);
            total = parseFloat(Math.round(total * 100) / 100).toFixed(2);

            let tipDollarAmount = total - this.state.subtotal;
            tipDollarAmount = parseFloat(Math.round(tipDollarAmount * 100) / 100).toFixed(2);

            this.setState({
                total: Number(total),
                tip: Number(tipDollarAmount)
            }, () => {
                console.log("total = " + this.state.total)
                console.log("tip = " + this.state.tip)
            })
        }
    }

    handleSegmentedControlSwitch(index) {
        this.adjustTip(index);
        this.setState({selectedIndex: index});
    }

    toggleOverlay() {
        this.setState({overlayVisible: !this.state.overlayVisible}, () => {
            if(!this.state.overlayVisible){
                this.setState({
                    orientation: "landscape",
            });
            }
        });
    }

    overlayCancelPressed() {
        this.setState({
            total: Number(parseFloat(Math.round(this.state.subtotal * 100) / 100).toFixed(2)),
            tip: Number(parseFloat(Math.round(0 * 100) / 100).toFixed(2))
        });
        this.toggleOverlay();
    }

    applyCustomTip(total, tip) {
        console.log("in applyCustomTip")
        console.log(total)
        console.log(tip)
        this.setState({
            total: total,
            tip: tip
        }, () => {
            this.toggleOverlay();
        });
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

        removeItem("selectedCustomerId"); //Removes selectedCustomerId if payment voided to avoid bugs for future payments
    }

    handleContinuePress() {
        console.log("in continue press")
        console.log(this.state.total)
        console.log(this.state.tip)

        let saleWithTipAdjustment = {
            merchantId: this.props.navigation.state.params.tipAdjustmentData.merchantId,
            id: this.props.navigation.state.params.tipAdjustmentData.id,
            paymentToken: this.props.navigation.state.params.tipAdjustmentData.paymentToken,
            tenderType: "Card",
            tip: this.state.tip,
            amount: this.state.total,
        }

        console.log(saleWithTipAdjustment);
        
        this.setState({orientation: "portrait"}, () => {
            this.props.navigation.navigate("Receipt", {
                sale: saleWithTipAdjustment
            });
        });
    }

    render() {
        return (
            <View style={styles.container}>
                <CollectTip
                    tipArray={this.state.tipArray}
                    selectedIndex={this.state.selectedIndex}
                    subtotal={this.state.subtotal}
                    total={this.state.total}
                    handleChange={this.handleSegmentedControlSwitch}
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
                <CustomTipOverlay 
                    isVisible={this.state.overlayVisible}
                    subtotal={this.state.subtotal}
                    total={this.state.total}
                    closeOverlay={this.overlayCancelPressed}
                    applyCustomTip={this.applyCustomTip}
                />
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