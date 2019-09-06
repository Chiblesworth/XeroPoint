import React, { Component } from 'react';
import { View, Text, ScrollView, StyleSheet, } from 'react-native';
import { Header } from 'react-native-elements';
import SegmentedControlTab from "react-native-segmented-control-tab";
//Components
import HeaderIcon from '../HeaderIcon';

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
