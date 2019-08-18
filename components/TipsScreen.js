import React, { Component } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Header, Button } from 'react-native-elements';
import HeaderIcon from './HeaderIcon';
import SwitchToggle from 'react-native-switch-toggle';
import SegmentedControlTab from "react-native-segmented-control-tab";
import TipOverlay from './TipOverlay';
import { defaultTips } from './defaultTips';
import { storageGet, storageSet } from './localStorage';
import AsyncStorage from '@react-native-community/async-storage';
import { stringToBoolean } from './stringToBoolean';


export default class TipsScreen extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
            collectTips: true,
            defaultTip: 0,
            useCustomPercentages: false,
            overlayVisible: false
        };

        this.defaultTips = defaultTips;
        this.customTips = [];

        this.collectingTipsCheck = this.collectingTipsCheck.bind(this);
        this.useCustomTipsCheck = this.useCustomTipsCheck.bind(this);
        this.selectedDefaultTipCheck = this.selectedDefaultTipCheck.bind(this);
        this.customTipArrayCheck = this.customTipArrayCheck.bind(this);
        this.handleHeaderIconPress = this.handleHeaderIconPress.bind(this);
        this.handleSwitchPress = this.handleSwitchPress.bind(this);
        this.handleDefaultTipChange = this.handleDefaultTipChange.bind(this);
        this.setCollectedTips = this.setCollectedTips.bind(this);
        this.customTipsUsed = this.customTipsUsed.bind(this);
        this.handleOverlay = this.handleOverlay.bind(this);
        this.applyCustomTipChanges = this.applyCustomTipChanges.bind(this);
    }

    async componentDidMount() {
        this.collectingTipsCheck();
        this.useCustomTipsCheck();
        this.selectedDefaultTipCheck();
        this.customTipArrayCheck();
    }

    async collectingTipsCheck() {
        let useCustomTips = await storageGet("useCustomTips"); //Is the user collecting tips after payments?
        let boolean; //Used because switches can only be bool values and Async only stores strings
        
        if(!!useCustomTips){
            boolean = stringToBoolean(useCustomTips);
            this.setState({useCustomPercentages: boolean});
        }
    }

    async useCustomTipsCheck() {
        let collectTips = await storageGet("collectTips"); //Is the user collecting tips after payments?
        let boolean; //Used because switches can only be bool values and Async only stores strings
        
        if(!!collectTips){
            boolean = stringToBoolean(collectTips);
            this.setState({collectTips: boolean});
        }
    }

    async selectedDefaultTipCheck() {
        let selectedDefaultTip = await storageGet("selectedDefaultTip");
        this.setState({defaultTip: Number(selectedDefaultTip)});
    }

    async customTipArrayCheck() {
        //See if custom tips exist
        let customTipArray = await storageGet("customTips");

        if(customTipArray === null){
            this.customTips = ["15%", "20%", "25%"];
        }
        else{
            this.customTips = JSON.parse(customTipArray);
        }
    }

    handleHeaderIconPress() {
        this.props.navigation.navigate("Settings");
    }

    handleSwitchPress(switchHit) {
        if(switchHit === "collectTips"){
            this.setState({collectTips: !this.state.collectTips}, () => {
                this.setCollectedTips();
            });
        }
        else if(switchHit === "useCustomTips"){
            this.setState({useCustomPercentages: !this.state.useCustomPercentages}, () => {
                this.customTipsUsed();
            });
        }
    }

    setCollectedTips() {
        let key = "collectTips";
        storageSet(key, this.state.collectTips.toString());
    }

    customTipsUsed() {
        let key = "useCustomTips";
        storageSet(key, this.state.useCustomPercentages.toString());
    }

    handleDefaultTipChange(index) {
        let key = "selectedDefaultTip";

        this.setState({defaultTip: index}, () => {
            storageSet(key, index.toString());
        });

        selectedDefaultTip = index;
    }

    handleOverlay() {
        this.setState({overlayVisible: !this.state.overlayVisible});
    }

    applyCustomTipChanges(newCustomTips) {
        let key = "customTips";
        storageSet(key, JSON.stringify(newCustomTips));
    }

    render() {
        return (
            <View style={styles.mainContainer}>
                <View stlye={styles.header}>
                    <Header 
                        leftComponent={
                            <HeaderIcon 
                                name="chevron-left"
                                type="entypo"
                                size={60}
                                handlePress={this.handleHeaderIconPress}
                            /> 
                        }
                        centerComponent={
                            <Text style={styles.headerText}>Tips</Text>
                        }
                        backgroundColor='#808080'
                        containerStyle={{ borderBottomWidth: 0 }}
                    />
                </View>
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
                                    circleColorOff="white"
                                    circleColorOn="white"
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

//Styles
const styles = StyleSheet.create({
    mainContainer: {
        height: '100%',
        backgroundColor: '#808080'
    },
    header: {
        width: '100%',
        height: 70
    },
    headerText: {
        fontSize: 40,
        color: 'white',
        paddingBottom: 25,
        paddingRight: 25
    },
    container: {
        borderBottomColor: 'white',
        borderBottomWidth: 2,
        marginBottom: 20,
        width: '100%'
    },
    row: {
        flex: 1,
        flexDirection: 'row',
        width: '100%',
        marginBottom: 10,
    },
    text: {
        fontSize: 25,
        color: 'white', 
        paddingRight: 10,
        marginLeft: 10,
        marginBottom: 20
    },
    textContainer: {
        flex: 1,
    },
    switch: {
        alignItems: 'flex-end',
        marginRight: 10,
        marginBottom: 20
    },
    segmentedSection: {
        marginBottom: 20,
    },
    tabsContainerStyle: {
        height: 70,
        borderColor: 'white'
    },
    tabStyle: {
        backgroundColor: '#808080',
        borderColor: 'white'
    },
    tabTextStyle: {
        fontSize: 20,
        color: 'white'
    },
    activeTabStyle: {
        backgroundColor: 'white'
    },
    activeTabTextStyle: {
        color: 'black'
    },
    buttonContainer: {
        width: '92%',
        height: 40,
        marginBottom: 25,
        marginLeft: 15
    },
    button: {
        backgroundColor: '#C8C8C8'
    },
    buttonTitle: {
        fontSize: 25
    },
});