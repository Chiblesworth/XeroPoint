import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import SegmentedControlTab from "react-native-segmented-control-tab";
import { defaultTips } from './defaultTips';

defaultTips.push("Other");

export default class CollectTip extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };

    }

    componentDidMount() {
        console.log("coll tip  screen tipindec  is "  +this.props.tipIndex)
    }

    render() {
        return (
            <View style={styles.row}>
                    <View style={styles.totalContainer}>
                        <Text>Subtotal</Text>
                        <Text>Amount Here</Text>
                    </View>
                    <SegmentedControlTab
                            values={defaultTips}
                            selectedIndex={Number(this.props.tipIndex)}
                            onTabPress={(index) => this.props.handleChange(index)}
                            borderRadius={25}
                            tabsContainerStyle={styles.tabsContainerStyle}
                            tabTextStyle={styles.tabTextStyle}
                            tabStyle={styles.tabStyle}
                            activeTabStyle={styles.activeTabStyle}
                            activeTabTextStyle={styles.activeTabTextStyle}
                    />
                    <View style={styles.totalContainer}>
                        <Text>Total</Text>
                        <Text>Amount Here</Text>
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
        flexDirection: 'column'
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
