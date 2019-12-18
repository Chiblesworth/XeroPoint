import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import SegmentedControlTab from "react-native-segmented-control-tab";

import CustomHeader from '../CustomHeader';
import BatchHistory from '../BatchHistory';
import DailyPaymentHistory from '../DailyPaymentHistory';

import { getBatches } from '../../api_requests/getBatches';
import { getDailyPayments } from '../../api_requests/getDailyPayments';

import { storageGet } from '../../helpers/localStorage';

import { styles } from '../styles/HistoryStyles';

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
        let merchantId = await storageGet("merchantId");
        let startDate = new Date();
        let endDate = new Date();

        //https://stackoverflow.com/questions/7937233/how-do-i-calculate-the-date-in-javascript-three-months-prior-to-today
        startDate.setMonth(endDate.getMonth() - 1); //Change back to 3 months before launch
        endDate.setDate(endDate.getDate() + 1); //Moves to the day ahead of current date so payments made on the current day always show

        console.log(endDate.toLocaleDateString())
        console.log(startDate.toLocaleDateString())
        
        //Get batches 
        let batches = await getBatches(merchantId, startDate, endDate);
        this.setState({batches: batches.records});

        //Get payments in past 3 months
        let dailyPayments = await getDailyPayments(merchantId, startDate, endDate);
        this.parsePaymentsByDay(dailyPayments.records);
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