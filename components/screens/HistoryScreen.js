import React, { Component } from 'react';
import { View, Text, ScrollView, StyleSheet, } from 'react-native';
import SegmentedControlTab from "react-native-segmented-control-tab";
//Components
import CustomHeader from '../CustomHeader';
import BatchHistory from '../BatchHistory';
import DailyPaymentHistory from '../DailyPaymentHistory';
//Helper Methods
import { storageGet, storageSet } from '../../helperMethods/localStorage';

export default class HistoryScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedIndex: 0,
            batches: [],
            lastThreeMonthsPayments: [],
            paymentsSplitByDay: []
        };

        this.handleHeaderIconPress = this.handleHeaderIconPress.bind(this);
        this.handleTabChange = this.handleTabChange.bind(this);
        this.parsePaymentsByDay = this.parsePaymentsByDay.bind(this);
    }

    async componentWillMount() {
        let encodedUser = await storageGet("encodedUser");
        let merchantId = await storageGet("merchantId");

        let headers = {
            'Authorization': 'Basic ' + encodedUser,
            'Content-Type': 'application/json; charset=utf-8'
        };
        
        let endDate = new Date();
        endDate.setDate(endDate.getDate() + 1); //Moves to the day ahead of current date so payments made on the current day always show
        let startDate = new Date();
        startDate.setMonth(endDate.getMonth() - 1); //Change back to 3 months before launch

        console.log(endDate.toLocaleDateString())
        console.log(startDate.toLocaleDateString())
        //Get batches 
        fetch(`https://sandbox.api.mxmerchant.com/checkout/v3/batch?merchantId=${merchantId}&limit=1000&dateType=Custom&startDate=${startDate.toLocaleDateString()}&endDate=${endDate.toLocaleDateString()}`, {
            method: "GET",
            headers: headers,
        }).then((response) => {
            return response.json();
        }).then((Json) => {
            this.setState({ batches: Json.records });
        });

        //https://stackoverflow.com/questions/7937233/how-do-i-calculate-the-date-in-javascript-three-months-prior-to-today
        // let endDate = new Date();
        // endDate.setDate(endDate.getDate() + 1); //Moves to the day ahead of current date so payments made on the current day always show
        // let startDate = new Date();
        // startDate.setMonth(endDate.getMonth() - 1); //Change back to 3 months before launch

        // console.log(endDate.toLocaleDateString())
        // console.log(startDate.toLocaleDateString())

        //Get payments in past 3 months
        //`https://sandbox.api.mxmerchant.com/checkout/v3/payment?merchantId=${merchantId}&limit=1000&dateType=Custom&startDate=${startDate.toLocaleDateString()}&endDate=${endDate.toLocaleDateString()}`
        fetch(`https://sandbox.api.mxmerchant.com/checkout/v3/payment?merchantId=${merchantId}&limit=1000&dateType=Custom&startDate=${startDate.toLocaleDateString()}&endDate=${endDate.toLocaleDateString()}`, {
            method: "GET",
            headers: headers
        }).then((response) => {
            return response.json();
        }).then((Json) => {
            this.parsePaymentsByDay(Json.records);
        })
    }

    handleHeaderIconPress() {
        this.props.navigation.navigate("Main");
    }

    handleTabChange(index) {
        this.setState({ selectedIndex: index });
    }

    parsePaymentsByDay(payments){
        console.log(payments)
        console.log(payments.length);

        let dateToBeCompared = new Date(payments[0].created); //Holds the first date for other records to compare date to
        let paymentsForOneDay = [];
        let allPaymentsSplitByDay = [];

        for(let i = 0; i < payments.length; i++){
            dateOfPayment = new Date(payments[i].created);

            if(dateToBeCompared.toLocaleDateString() === dateOfPayment.toLocaleDateString()){
                paymentsForOneDay.push(payments[i]);
            }
            else{
                allPaymentsSplitByDay.push(paymentsForOneDay);

                paymentsForOneDay = [];
                dateToBeCompared = new Date(payments[i].created);
                
                if(dateToBeCompared.toLocaleDateString() === dateOfPayment.toLocaleDateString()){
                    paymentsForOneDay.push(payments[i]);
                }
            }
        }
        allPaymentsSplitByDay.push(paymentsForOneDay);

        this.setState({paymentsSplitByDay: allPaymentsSplitByDay});
    }

    render() {
        let paymentHistoryContent 
        if(this.state.selectedIndex === 0){
            paymentHistoryContent = <DailyPaymentHistory navigation={this.props.navigation} paymentsSplitByDay={this.state.paymentsSplitByDay} />;
        }
        else{
            paymentHistoryContent = <BatchHistory batches={this.state.batches} navigation={this.props.navigation}/>;
        }
        return (
            <View style={{flex: 1}}>
                <CustomHeader 
                    iconName="chevron-left"
                    type="entypo"
                    title="History"
                    handlePress={this.handleHeaderIconPress}
                    backgroundColor="#454343"
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
        backgroundColor: '#454343',
        width: '100%',
        paddingBottom: 10
    },
    tabsContainerStyle: {
        width: '50%',
        borderColor: '#454343'
    },
    tabStyle: {
        backgroundColor: '#454343',
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
