import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Header } from 'react-native-elements';
import HeaderIcon from './HeaderIcon';
import SwitchToggle from 'react-native-switch-toggle';
import SegmentedControlTab from "react-native-segmented-control-tab";

export default class TipsScreen extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
            collectTips: true,
            defaultTip: 0
        };

        this.defaultTips = ["No Tip", "15%", "20%", "25%"];

        this.handleHeaderIconPress = this.handleHeaderIconPress.bind(this);
        this.handleSwitchPress = this.handleSwitchPress.bind(this);
        this.handleDefaultTipChange = this.handleDefaultTipChange.bind(this);
    }

    handleHeaderIconPress() {
        this.props.navigation.navigate("Settings");
    }

    handleSwitchPress() {
        this.setState({collectTips: !this.state.collectTips});
    }

    handleDefaultTipChange(index) {
        this.setState({defaultTip: index}, () => {
            console.log("default tip index is " + this.state.defaultTip);
            console.log("Tip percent is " + this.defaultTips[index])

            //What I need to is take out the % sign in the defaultTips
            //Save in AsyncStorage as a string but only integer. Will help so I dont have to remove 
            //% every time I call that variable. Should only be once but still.
        });
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
                                    onPress={() => this.handleSwitchPress()}
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
        marginBottom: 20
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
    }
});