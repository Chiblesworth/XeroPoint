import React, { Component } from 'react';
import { View, Text, ScrollView, StyleSheet, } from 'react-native';
import { Header } from 'react-native-elements';
import SegmentedControlTab from "react-native-segmented-control-tab";
//Components
import HeaderIcon from '../HeaderIcon';
import BatchHistory from '../BatchHistory';
//Helper Methods
import { storageGet, storageSet } from '../../helperMethods/localStorage';

export default class HistoryScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedIndex: 0,
            batches: []
        };

        this.handleHeaderIconPress = this.handleHeaderIconPress.bind(this);
        this.handleTabChange = this.handleTabChange.bind(this);
    }

    async componentWillMount() {
        let encodedUser = await storageGet("encodedUser");
        let merchantId = await storageGet("merchantId");

        let headers = {
            'Authorization': 'Basic ' + encodedUser,
            'Content-Type': 'application/json; charset=utf-8'
        };

        fetch(`https://sandbox.api.mxmerchant.com/checkout/v3/batch?merchantId=${merchantId}&limit=5`, {
            method: "GET",
            headers: headers,
        }).then((response) => {
            return response.json();
        }).then((Json) => {
            this.setState({ batches: Json.records }, () => {
                //console.log(this.state.batches)
            });
        });
    }

    handleHeaderIconPress() {
        this.props.navigation.navigate("Main");
    }

    handleTabChange(index) {
        this.setState({ selectedIndex: index });
    }

    render() {
        return (
            <View style={{flex: 1}}>
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
                    <BatchHistory batches={this.state.batches}/>
                </ScrollView>
            </View>
        );
    }
}

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
});
