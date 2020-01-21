import React, { Component } from 'react';
import { View, ScrollView, ActivityIndicator } from 'react-native';
import SegmentedControlTab from "react-native-segmented-control-tab";
import { StackActions, NavigationActions } from 'react-navigation';

import CustomHeader from '../ui/CustomHeader';
import BatchHistory from '../ui/BatchHistory';
import DailyPaymentHistory from '../ui/DailyPaymentHistory';

import { getBatches } from '../../api_requests/getBatches';
import { getDailyPayments } from '../../api_requests/getDailyPayments';

import { storageGet } from '../../helpers/localStorage';

import { styles } from '../styles/HistoryStyles';

const resetAction = StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({ routeName: 'DrawerStack' })],
});

export default class HistoryScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedIndex: 0,
            batches: null,
            paymentsSplitByDay: null
        };
    }

    async componentWillMount() {
        let merchantId = await storageGet("merchantId");
        let startDate = new Date();
        let endDate = new Date();

        //https://stackoverflow.com/questions/7937233/how-do-i-calculate-the-date-in-javascript-three-months-prior-to-today
        startDate.setMonth(endDate.getMonth() - 1); //Change back to 3 months before launch
        endDate.setDate(endDate.getDate() + 1); //Moves to the day ahead of current date so payments made on the current day always show

        // Get payments in past 3 months
        let dailyPayments = await getDailyPayments(merchantId, startDate, endDate);
        this.parsePaymentsByDay(dailyPayments.records);
        
        // Get batches 
        let batches = await getBatches(merchantId, startDate, endDate);
        this.setState({batches: batches.records});
    }

    handleHeaderIconPress = () => {
        this.props.navigation.dispatch(resetAction);
    }

    handleTabChange = (index) => {
        this.setState({ selectedIndex: index });
    }

    parsePaymentsByDay = (payments) => {
        let dateToBeCompared = new Date(payments[0].created); // Holds the first date for other records to compare date to
        let paymentsForOneDay = [];
        let allPaymentsSplitByDay = [];
        let dateOfPayment;

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
        let paymentHistoryContent;
        
        (this.state.selectedIndex === 0)
            ? paymentHistoryContent = <DailyPaymentHistory navigation={this.props.navigation} paymentsSplitByDay={this.state.paymentsSplitByDay} />
            : paymentHistoryContent = <BatchHistory batches={this.state.batches} navigation={this.props.navigation}/>;

        return (
            <View style={{flex: 1}}>
                <CustomHeader 
                    iconName="chevron-left"
                    type="entypo"
                    title="History"
                    handlePress={this.handleHeaderIconPress}
                    backgroundColor="#454343"
                    underlayColor="#454343"
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
                    {
                        (this.state.batches === null && this.state.paymentsSplitByDay === null)
                            ?  (
                                <View style={styles.activityIndicator}>
                                    <ActivityIndicator size="large" color="#0000ff" />
                                </View>
                            )
                            : (paymentHistoryContent)
                    }
                </ScrollView>
            </View>
        );
    }
}