import React, { Component } from 'react';
import { View, Text, ScrollView, StyleSheet, } from 'react-native';
import { Header } from 'react-native-elements';
import SegmentedControlTab from "react-native-segmented-control-tab";
//Components
import HeaderIcon from '../HeaderIcon';
import { black } from 'ansi-colors';

export default class HistoryScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedIndex: 0
        };

        this.handleHeaderIconPress = this.handleHeaderIconPress.bind(this);
        this.handleTabChange = this.handleTabChange.bind(this);
    }

    handleHeaderIconPress() {
        this.props.navigation.navigate("Main");
    }

    handleTabChange(index) {
        this.setState({ selectedIndex: index });
    }

    render() {
        return (
            <View>
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
                        <Text style={styles.headerText}>History</Text>
                    }
                    backgroundColor="#808080"
                    containerStyle={{ borderBottomWidth: 0 }}
                />
                <View style={styles.segmentedControlContainer}>
                    <SegmentedControlTab
                        values={["Day", "Batch"]}
                        selectedIndex={this.state.selectedIndex}
                        onTabPress={(index) => this.handleTabChange(index)}
                        borderRadius={25}
                        tabsContainerStyle={styles.tabsContainerStyle}
                        tabTextStyle={styles.tabTextStyle}
                        tabStyle={styles.tabStyle}
                        activeTabStyle={styles.activeTabStyle}
                        activeTabTextStyle={styles.activeTabTextStyle}
                    />
                </View>
                <ScrollView>
                    <View style={styles.batchContainer}>
                        <View style={[styles.row, { backgroundColor: "#D3D3D3" }]}>
                            <Text style={styles.text}>
                                Batch ID
                            </Text>
                            <Text style={styles.text}>
                                Closed By: System
                            </Text>
                        </View>
                        <View style={[styles.row, { padding: 20 }]}>
                            <View style={styles.batchInfoContainer}>
                                <View style={
                                    {
                                        backgroundColor: '#2E2B2B',
                                        borderTopLeftRadius: 17,
                                        borderTopRightRadius: 17,
                                        width: '100%',
                                        alignItems: 'center'
                                    }
                                }>
                                    <Text style={[styles.infoText, { color: '#fff' }]}>
                                        CLOSED
                                    </Text>
                                </View>
                                <Text style={{ fontSize: 32, fontWeight: 'bold', color: '#000' }}>
                                    0
                                </Text>
                                <View style={
                                    {
                                        backgroundColor: '#DCDCDC',
                                        borderBottomLeftRadius: 20,
                                        borderBottomRightRadius: 20,
                                        width: '100%',
                                        alignItems: 'center'
                                    }
                                }>
                                    <Text style={[styles.infoText, { color: '#000' }]}>
                                        $0.00
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.column}>
                                <Text>Sales:          0</Text>
                                <Text>Refunds:     0</Text>
                                <View style={{paddingTop: '15%'}}>
                                    <Text>Open Date:</Text>
                                    <Text>Date</Text>
                                    <Text>Time</Text>
                                </View>
                            </View>
                            <View style={styles.column}>
                                <Text>$0.00</Text>
                                <Text>$0.00</Text>
                                <View style={{paddingTop: '15%'}}>
                                    <Text>Close Date:</Text>
                                    <Text>Date</Text>
                                    <Text>Time</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    }
}
{/* <View style={{paddingTop: '3%'}}>
                                <Text>Sales:       0</Text>
                                <Text>Refunds:  0</Text>
                            </View>
                            <View style={{paddingTop: '3%', paddingRight: '20%'}}>
                                <Text>$0.00</Text>
                                <Text>$0.00</Text>
                            </View> */}


//Styles
const styles = StyleSheet.create({
    headerText: {
        fontSize: 25,
        color: 'white',
        paddingBottom: 30
    },
    segmentedControlContainer: {
        alignItems: 'center',
        backgroundColor: '#808080',
        width: '100%',
        paddingBottom: 10
    },
    tabsContainerStyle: {
        width: '50%',
        borderColor: '#808080'
    },
    tabStyle: {
        backgroundColor: '#808080',
        borderColor: 'black'
    },
    tabTextStyle: {
        fontSize: 18,
        color: 'white'
    },
    activeTabStyle: {
        backgroundColor: 'white'
    },
    activeTabTextStyle: {
        color: 'black'
    },
    batchContainer: {
        borderColor: "#696969",
        borderWidth: 1,
        height: '100%'
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    text: {
        padding: 10,
        fontSize: 16,
        color: "#000"
    },
    batchInfoContainer: {
        borderRadius: 20,
        borderWidth: 2,
        borderColor: "#2E2B2B",
        width: '25%',
        height: 115,
        alignItems: 'center',
        justifyContent: 'space-evenly',
    },
    infoText: {
        padding: 10,
        borderRadius: 20
    },
    // batchSaleContainer: {
    //    paddingRight: '20%',
    // }
});
