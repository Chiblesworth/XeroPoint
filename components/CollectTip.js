import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import SegmentedControlTab from "react-native-segmented-control-tab";
import { storageGet, storageSet } from '../helperMethods/localStorage';
import { feeCalculations } from '../helperMethods/feeCalculations';
import CustomTipOverlay from './overlays/CustomTipOverlay';

export default class CollectTip extends Component {
    constructor(props) {
        super(props);
        this.state = {
            overlayVisible: false
        };

        this.determineWithSelectedDefaultTip = this.determineWithSelectedDefaultTip.bind(this); //Used for determining total with users selected default tip when component mounts.
        this.handleSegmentedControlSwitch = this.handleSegmentedControlSwitch.bind(this);
        this.adjustTip = this.adjustTip.bind(this);
        this.handleOverlayChange = this.handleOverlayChange.bind(this);
        this.applyCustomTipChanges = this.applyCustomTipChanges.bind(this);
        this.determineTipDollarAmount = this.determineTipDollarAmount.bind(this);
    }

    componentDidMount() {
        this.determineWithSelectedDefaultTip();
    }

    async determineWithSelectedDefaultTip() {
        let selectedDefaultTip = await storageGet("selectedDefaultTip");

        if(selectedDefaultTip > 0){
            this.adjustTip(selectedDefaultTip);
        }
    }

    handleSegmentedControlSwitch(index) {
        this.adjustTip(index);
        this.props.handleChange(index);
    }

    adjustTip(index) {
        if(index === 0){
            let amount = parseFloat(Math.round(this.props.subtotal * 100) / 100).toFixed(2);
            this.props.totalChange(amount);
            this.props.tipChange(parseFloat(Math.round(0 * 100) / 100).toFixed(2));
        }
        else if(index === 4){
            this.handleOverlayChange("apply");
            this.props.handleOrientationChange("portrait");
        }
        else{
            let tipAmount = this.props.tipArray[index].replace(/(%)+/g, "");
            let totalWithTip = feeCalculations(Number(this.props.subtotal), tipAmount);

            totalWithTip = parseFloat(Math.round(totalWithTip * 100) / 100).toFixed(2);

            this.determineTipDollarAmount(tipAmount);
            this.props.totalChange(totalWithTip);
        }
    }

    handleOverlayChange(reasonForChange) {
        this.props.handleOrientationChange("landscape");

        if(reasonForChange === "cancel"){
            this.setState({overlayVisible: !this.state.overlayVisible});
            this.props.handleChange(0);
            this.adjustTip(0);
        }
        else{
            this.setState({overlayVisible: !this.state.overlayVisible});
        }
    }

    applyCustomTipChanges(customTipTotal) {
        this.props.totalChange(customTipTotal);
        this.props.handleOrientationChange("landscape");
        this.handleOverlayChange("apply");
    }

    determineTipDollarAmount(tipAmount) {
        let tipDecimalAmount = tipAmount / 100;
        let tipDollarAmount = Number(this.props.subtotal) * tipDecimalAmount;
        
        tipDollarAmount = parseFloat(Math.round(tipDollarAmount * 100) / 100).toFixed(2);
        this.props.tipChange(tipDollarAmount);
    }

    render() {
        return (
            <View style={styles.row}>
                    <View style={styles.totalContainer}>
                        <Text style={styles.text}>Subtotal:</Text>
                        <Text style={styles.text}>${parseFloat(Math.round(this.props.subtotal * 100) / 100).toFixed(2)}</Text>
                    </View>
                    <SegmentedControlTab
                            values={this.props.tipArray}
                            selectedIndex={Number(this.props.tipIndex)}
                            onTabPress={(index) => this.handleSegmentedControlSwitch(index)}
                            borderRadius={25}
                            tabsContainerStyle={styles.tabsContainerStyle}
                            tabTextStyle={styles.tabTextStyle}
                            tabStyle={styles.tabStyle}
                            activeTabStyle={styles.activeTabStyle}
                            activeTabTextStyle={styles.activeTabTextStyle}
                            width={100}
                    />
                    <View style={styles.totalContainer}>
                        <Text style={styles.text}>Total:</Text>
                        <Text style={styles.text}>${parseFloat(Math.round(this.props.totalWithTip * 100) / 100).toFixed(2)}</Text>
                    </View>
                    <CustomTipOverlay 
                        isVisible={this.state.overlayVisible}
                        handleClose={this.handleOverlayChange}
                        subtotal={this.props.subtotal}
                        applyChange={this.applyCustomTipChanges}
                        tipChange={this.props.tipChange}
                        orientationChange={this.props.handleOrientationChange}
                    />
            </View>
        );
    }
}

//Styles
const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        marginBottom: 25,
    },
    totalContainer: {
        flexDirection: 'column',
        marginLeft: 10,
        marginRight: 10
    },
    text: {
        fontSize: 25
    },
    tabsContainerStyle: {
        flex: 1,
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
        backgroundColor: '#808080'
    },
    activeTabTextStyle: {
        color: 'white'
    },
});
