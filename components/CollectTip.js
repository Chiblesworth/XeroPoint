import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import SegmentedControlTab from "react-native-segmented-control-tab";

export default class CollectTip extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={styles.row}>
                    <View style={styles.totalContainer}>
                        <Text style={styles.text}>Subtotal:</Text>
                        <Text style={styles.text}>${parseFloat(Math.round(this.props.subtotal * 100) / 100).toFixed(2)}</Text>
                    </View>
                    <SegmentedControlTab
                            values={this.props.tipArray}
                            selectedIndex={this.props.selectedIndex}
                            onTabPress={(index) => this.props.handleChange(index) }
                            borderRadius={25}
                            tabsContainerStyle={styles.tabsContainerStyle}
                            tabTextStyle={styles.tabTextStyle}
                            tabStyle={styles.tabStyle}
                            activeTabStyle={styles.activeTabStyle}
                            activeTabTextStyle={styles.activeTabTextStyle}
                            width={100}
                    />
                    <View style={styles.totalContainer}>
                        <Text style={styles.text}>Total:</Text>
                        <Text style={styles.text}>${parseFloat(Math.round(this.props.total * 100) / 100).toFixed(2)}</Text>
                    </View>
            </View>
        );
    }
}

//Styles
const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        marginBottom: 25,
    },
    totalContainer: {
        flexDirection: 'column',
        marginLeft: 10,
        marginRight: 10
    },
    text: {
        fontSize: 25
    },
    tabsContainerStyle: {
        flex: 1,
        borderColor: '#808080'
    },
    tabStyle: {
        backgroundColor: 'white',
        borderColor: 'black'
    },
    tabTextStyle: {
        fontSize: 18,
        color: 'black'
    },
    activeTabStyle: {
        backgroundColor: '#808080'
    },
    activeTabTextStyle: {
        color: 'white'
    },
});
