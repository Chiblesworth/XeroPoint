import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import SegmentedControlTab from "react-native-segmented-control-tab";
import { storageGet, storageSet } from './localStorage';
import { feeCalculations } from './feeCalculations';
import CustomTipOverlay from './CustomTipOverlay';

export default class CollectTip extends Component {
    constructor(props) {
        super(props);
        this.state = {
            subtotal: this.props.amount,
            totalWithTip: this.props.amount,
            overlayVisible: false
        };

        this.determineWithSelectedDefaultTip = this.determineWithSelectedDefaultTip.bind(this); //Used for determining total with users selected default tip when component mounts.
        this.handleSegmentedControlSwitch = this.handleSegmentedControlSwitch.bind(this);
        this.adjustTip = this.adjustTip.bind(this);
        this.handleOverlayChange = this.handleOverlayChange.bind(this);
        this.applyCustomTipChanges = this.applyCustomTipChanges.bind(this);
    }

    componentDidMount() {
       // console.log("coll tip  screen tipindec  is "  +this.props.tipIndex)
        console.log("CollectTips.js navigation props for tipAdjustment")
        console.log(this.props.amount)
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
            let amount = parseFloat(Math.round(this.props.amount * 100) / 100).toFixed(2);
            
            this.setState({totalWithTip: amount});
        }
        else if(index === 4){
            
            this.handleOverlayChange();
            this.props.handleOrientationChange("portrait");
        }
        else{
            let tipAmount = this.props.tipArray[index].replace(/(%)+/g, "");
            let totalWithTip = feeCalculations(Number(this.state.subtotal), tipAmount);

            totalWithTip = parseFloat(Math.round(totalWithTip * 100) / 100).toFixed(2);

            this.setState({totalWithTip: totalWithTip}, () => {
                console.log("totalWithTip is " + this.state.totalWithTip);
            });
        }
    }

    handleOverlayChange() {
        this.props.handleOrientationChange("landscape");
        this.setState({overlayVisible: !this.state.overlayVisible});
    }

    applyCustomTipChanges(customTipTotal) {
        console.log(customTipTotal);
        this.setState({totalWithTip: customTipTotal});
        this.props.handleOrientationChange("landscape");
        this.handleOverlayChange();
    }

    render() {
        return (
            <View style={styles.row}>
                    <View style={styles.totalContainer}>
                        <Text style={styles.text}>Subtotal:</Text>
                        <Text style={styles.text}>${parseFloat(Math.round(this.state.subtotal * 100) / 100).toFixed(2)}</Text>
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
                        <Text style={styles.text}>${parseFloat(Math.round(this.state.totalWithTip * 100) / 100).toFixed(2)}</Text>
                    </View>
                    <CustomTipOverlay 
                        isVisible={this.state.overlayVisible}
                        handleClose={this.handleOverlayChange}
                        amount={this.props.amount}
                        applyChange={this.applyCustomTipChanges}
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
