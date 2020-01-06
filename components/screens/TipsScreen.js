import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Button } from 'react-native-elements';
import SwitchToggle from 'react-native-switch-toggle';
import SegmentedControlTab from "react-native-segmented-control-tab";

import CustomHeader from '../CustomHeader';
import TipOverlay from '../overlays/TipOverlay';

import { defaultTips } from '../../helpers/defaultTips';
import { storageGet, storageSet } from '../../helpers/localStorage';

import { styles } from '../styles/TipScreenStyles';


export default class TipsScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            defaultTip: 0,
            collectTips: true,
            useCustomPercentages: false,
            overlayVisible: false
        };

        this.defaultTips = defaultTips;
        this.customTips = [];
    }

    async componentDidMount() {
        let collectTips = await storageGet("collectTips"); //Is the user collecting tips after payments
        let useCustomTips = await storageGet("useCustomTips"); //Is the user collecting tips after payments?
        let selectedDefaultTip = await storageGet("selectedDefaultTip");
        let customTipArray = await storageGet("customTips");

        useCustomTips = JSON.parse(useCustomTips);
        collectTips = JSON.parse(collectTips);

        if(collectTips === null){
            storageSet("collectTips", "true");
            collectTips =  true;
        }

        if(selectedDefaultTip === null){
            storageSet("selectedDefaultTip", 0);
            selectedDefaultTip = 0;
        }

        (customTipArray === null)
            ? this.customTips = ["15%", "20%", "25%"]
            : this.customTips = JSON.parse(customTipArray);

        if (this.defaultTips.length >= 5) {
            this.defaultTips.pop();
        }

        this.setState({
            useCustomPercentages: useCustomTips,
            collectTips: collectTips,
            defaultTip: Number(selectedDefaultTip)
        });
    }

    handleHeaderIconPress = () => {
        this.props.navigation.pop();
    }

    handleSwitchPress = (switchHit) => {
        if (switchHit === "collectTips") {
            this.setState({ collectTips: !this.state.collectTips }, () => {
                storageSet("collectTips", this.state.collectTips.toString());
            });
        }
        else if (switchHit === "useCustomTips") {
            this.setState({ useCustomPercentages: !this.state.useCustomPercentages }, () => {
                storageSet("useCustomTips", this.state.useCustomPercentages.toString());
            });
        }
    }

    handleDefaultTipChange = (index) => {
        this.setState({ defaultTip: index }, () => {
            storageSet("selectedDefaultTip", index.toString());
        });
    }

    handleOverlay = () => {
        this.setState({ overlayVisible: !this.state.overlayVisible });
    }

    applyCustomTipChanges = (newCustomTips) => {
        storageSet("customTips", JSON.stringify(newCustomTips));
    }

    render() {
        return (
            <View style={styles.mainContainer}>
                <CustomHeader
                    iconName="chevron-left"
                    type="entypo"
                    title="Tips"
                    handlePress={this.handleHeaderIconPress}
                    backgroundColor="#656565"
                />
                <View style={{ paddingTop: '4%' }} />
                <View style={styles.container}>
                    <View stlye={styles.row}>
                        <View style={styles.textContainer}>
                            <Text style={styles.text}>Collect Tips</Text>
                        </View>
                        <View style={styles.switch}>
                            <SwitchToggle
                                switchOn={this.state.collectTips}
                                onPress={() => this.handleSwitchPress("collectTips")}
                                circleColorOff="white"
                                circleColorOn="white"
                                backgroundColorOn="blue"
                            />
                        </View>
                    </View>
                </View>
                <View style={styles.container}>
                    <View>
                        <Text style={styles.text}>Default Tip</Text>
                    </View>
                    <View style={styles.segmentedSection}>
                        <SegmentedControlTab
                            values={this.defaultTips}
                            selectedIndex={this.state.defaultTip}
                            onTabPress={(index) => this.handleDefaultTipChange(index)}
                            borderRadius={25}
                            tabsContainerStyle={styles.tabsContainerStyle}
                            tabTextStyle={styles.tabTextStyle}
                            tabStyle={styles.tabStyle}
                            activeTabStyle={styles.activeTabStyle}
                            activeTabTextStyle={styles.activeTabTextStyle}
                        />
                    </View>
                </View>
                <View style={styles.container}>
                    <View stlye={styles.row}>
                        <View style={styles.textContainer}>
                            <Text style={styles.text}>Use Custom Tip Amounts</Text>
                        </View>
                        <View style={styles.switch}>
                            <SwitchToggle
                                switchOn={this.state.useCustomPercentages}
                                onPress={() => this.handleSwitchPress("useCustomTips")}
                                circleColorOff="#fff"
                                circleColorOn="#fff"
                                backgroundColorOn="blue"
                            />
                        </View>
                    </View>
                </View>
                <View style={styles.container}>
                    <Button
                        type="solid"
                        title="Adjust Custom Amounts"
                        containerStyle={styles.buttonContainer}
                        buttonStyle={styles.button}
                        titleStyle={styles.buttonTitle}
                        onPress={() => this.handleOverlay()}
                    />
                </View>
                <TipOverlay
                    visible={this.state.overlayVisible}
                    handleClose={this.handleOverlay}
                    customTips={this.customTips}
                    applyChanges={this.applyCustomTipChanges}
                />
            </View>
        );
    }
}