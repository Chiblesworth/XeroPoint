import React, { Component } from 'react';
import { View, Text, ScrollView, StyleSheet, } from 'react-native';
import { Header } from 'react-native-elements';
import SegmentedControlTab from "react-native-segmented-control-tab";
//Components
import HeaderIcon from '../HeaderIcon';
import BatchHistory from '../BatchHistory';
import DailyPurchaseHistory from '../DailyPaymentHistory';
//Helper Methods
import { storageGet, storageSet } from '../../helperMethods/localStorage';
import DailyPaymentHistory from '../DailyPaymentHistory';

export default class HistoryScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedIndex: 0,
            batches: [],
            lastThreeMonthsPayments: []
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

        //Get batches 
        fetch(`https://sandbox.api.mxmerchant.com/checkout/v3/batch?merchantId=${merchantId}&limit=1000`, {
            method: "GET",
            headers: headers,
        }).then((response) => {
            return response.json();
        }).then((Json) => {
            this.setState({ batches: Json.records });
        });

        //https://stackoverflow.com/questions/7937233/how-do-i-calculate-the-date-in-javascript-three-months-prior-to-today
        let startDate = new Date();
        let endDate = new Date();
        endDate.setMonth(startDate.getMonth() - 3);

        console.log(startDate.toLocaleDateString());
        console.log(endDate.toLocaleDateString());

        //Get payments in past 3 months
        fetch(`https://sandbox.api.mxmerchant.com/checkout/v3/payment?merchantId=${merchantId}&limit=1000&dateType=Custom&startDate=${startDate.toLocaleDateString()}&endDate=${endDate.toLocaleDateString()}`, {
            method: "GET",
            headers: headers
        }).then((response) => {
            console.log(response);
            console.log(response.json());
        })
    }

    handleHeaderIconPress() {
        this.props.navigation.navigate("Main");
    }

    handleTabChange(index) {
        this.setState({ selectedIndex: index });
    }

    render() {
        let paymentHistoryContent 
        if(this.state.selectedIndex === 0){
            paymentHistoryContent = <DailyPaymentHistory navigation={this.props.navigation}/>;
        }
        else{
            paymentHistoryContent = <BatchHistory batches={this.state.batches} navigation={this.props.navigation}/>;
        }
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
                    {paymentHistoryContent}
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
