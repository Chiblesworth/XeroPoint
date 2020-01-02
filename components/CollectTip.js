import React, { Component } from 'react';
import { View, Text } from 'react-native';
import SegmentedControlTab from "react-native-segmented-control-tab";

import { styles } from './styles/CollectTipStyles';

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
