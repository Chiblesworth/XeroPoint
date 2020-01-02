import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Button } from 'react-native-elements';
import { StackActions, NavigationActions } from 'react-navigation';
import Orientation from 'react-native-orientation';
//import SignatureCapture from 'react-native-signature-capture';

import CollectTip from '../CollectTip';
import CustomTipOverlay from '../overlays/CustomTipOverlay';

import { applyTip } from '../../api_requests/applyTip';
import { deletePayment } from '../../api_requests/deletePayment';

import { defaultTips } from '../../helpers/defaultTips';
import { getCustomTipsArray } from '../../helpers/customTips';
import { storageGet, removeItem } from '../../helpers/localStorage';
import { feeCalculations } from '../../helpers/feeCalculations';
import { showAlert } from '../../helpers/showAlert';

import { styles } from '../styles/SignatureStyles';

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
            customTipOverlayVisible: false,
            collectingTips: true
        };
    }

    async componentDidMount() {
        console.log("Sig screen payment id is ", this.props.navigation.state.params.tipAdjustmentData.id);
        console.log(this.props.navigation.state.params.tipAdjustmentData);

        Orientation.lockToLandscape();
        let collectingTips = await storageGet("collectTips");
        let selectedDefaultTip = await storageGet("selectedDefaultTip");
        let useCustomTips = await storageGet("useCustomTips");
        
        collectingTips = JSON.parse(collectingTips);
        useCustomTips = JSON.parse(useCustomTips);

        if(collectingTips){
            if(useCustomTips){
                let customTipArray = await getCustomTipsArray();
                customTipArray.push("Other");
                
                this.setState({tipArray: [...customTipArray]}, () => {
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
                        this.adjustTip(this.state.selectedIndex);
                });
            }
        }
        else{
            this.setState({collectingTips: false});
        }
    }

    handleSegmentedControlSwitch = (index) => {
        this.setState({selectedIndex: index}, () => {
            this.adjustTip(this.state.selectedIndex);
        });
    }

    handleCustomTipOverlay = () => {
        this.setState({customTipOverlayVisible: !this.state.customTipOverlayVisible}, () => {
            (this.state.customTipOverlayVisible)
                ? Orientation.lockToPortrait()
                : Orientation.lockToLandscape();
        });
    }

    adjustTip = (index) => {
        if(index === 0){
            let total = parseFloat(Math.round(this.state.subtotal * 100) / 100).toFixed(2);
            let tip = parseFloat(Math.round(0 * 100) / 100).toFixed(2);
            
            this.setState({
                total: Number(total),
                tip: Number(tip)
            }, () => {
                console.log("total = " + this.state.total)
                console.log("tip = " + this.state.tip)
            });
        }
        else if(index === 4){
            this.handleCustomTipOverlay();
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
            });
        }
    }

    overlayCancelPressed = () => {
        this.setState({
            total: Number(parseFloat(Math.round(this.state.subtotal * 100) / 100).toFixed(2)),
            tip: Number(parseFloat(Math.round(0 * 100) / 100).toFixed(2))
        }, () => {
            this.handleCustomTipOverlay();
        });
    }

    applyCustomTip = (total, tip) => {
        console.log("in applyCustomTip")
        console.log(total)
        console.log(tip)

        this.setState({total: total, tip: tip}, () => {
            this.handleCustomTipOverlay();
        });
    }

    handleCancelPress = () => {
        this.voidPayment();
    }

    voidPayment = async () => {
        let status = await deletePayment(this.props.navigation.state.params.tipAdjustmentData.id);

        if(status === 204){ 
            removeItem("selectedCustomerId") //Removes selectedCustomerId if payment voided to avoid bugs for future payments
            Orientation.lockToPortrait(); //This is here to fix bug where the alert would appear in landscaped mode on Main screen
            
            showAlert("Payment Voided!", "The payment has been deleted. Navigating back to Home.");
            this.props.navigation.dispatch(resetAction);
        }
        else{
            showAlert("Payment could not be Voided!", "Payment could not be voided please try again.");
        }
    }

    handleContinuePress = async () => {
        let selectedCustomerId = await storageGet("selectedCustomerId");
        console.log("in continue press")
        console.log(this.state.total)
        console.log(this.state.tip)

        let tipAdjustedPayment = {
            merchantId: this.props.navigation.state.params.tipAdjustmentData.merchantId,
            id: this.props.navigation.state.params.tipAdjustmentData.id,
            paymentToken: this.props.navigation.state.params.tipAdjustmentData.paymentToken,
            tenderType: "Card",
            tip: this.state.tip,
            amount: this.state.total,
            customer: {
                id: selectedCustomerId
            }
        }

        let status = await applyTip(tipAdjustedPayment);
        console.log(status);

        (status === 200)
            ? this.props.navigation.navigate("Receipt", {sale: tipAdjustedPayment})
            : showAlert("Tip Not Applied!", 'The tip was unable to be adjusted to the payment. Try pressing "Cancel" and restarting payment if error persists.');
    }

    render() {
        console.log(this.state.collectingTips);
        return (
            <View style={styles.container}>
                {
                    (this.state.collectingTips)
                    ?(
                        <CollectTip
                            tipArray={this.state.tipArray}
                            selectedIndex={this.state.selectedIndex}
                            subtotal={this.state.subtotal}
                            total={this.state.total}
                            handleChange={this.handleSegmentedControlSwitch}
                        />
                    )
                    : (
                        <View style={[styles.row, {justifyContent: 'space-between', margin: '2%'}]}>
                            <Text style={styles.text}>Not Collecting Tips</Text>
                            <Text style={styles.text}>Subtotal: ${this.state.subtotal}</Text>
                        </View>
                    )
                }
                <View style={styles.signatureContainer}>
                    {/* <SignatureCapture
                        style={styles.signature}
                        ref="sign"
                        saveImageFileInExtStorage={false}
                        showNativeButtons={false}
                        showTitleLabel={true}
                        viewMode={this.state.orientation}
                    /> */}
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
                            buttonStyle={{backgroundColor: 'red'}}
                            titleStyle={styles.titleStyle}
                        />
                        <View style={styles.spacer}></View>
                        <Button
                            title="Continue"
                            onPress={() => this.handleContinuePress()}
                            borderRadius={25}
                            containerStyle={styles.buttonContainer}
                            titleStyle={styles.titleStyle}
                        />
                    </View>
                </View>
                <CustomTipOverlay 
                    isVisible={this.state.customTipOverlayVisible}
                    subtotal={this.state.subtotal}
                    total={this.state.total}
                    handleClose={this.overlayCancelPressed}
                    applyCustomTip={this.applyCustomTip}
                />
            </View>
        );
    }
}