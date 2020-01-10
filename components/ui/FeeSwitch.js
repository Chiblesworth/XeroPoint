import React, { Component } from 'react';
import { View, Text } from 'react-native';
import SwitchToggle from 'react-native-switch-toggle';

import { styles } from '../styles/FeeSwitchStyles';

export default class FeeSwitch extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={styles.switchRow}>
                <Text style={styles.text}>
                    {this.props.swtichTitle}
                </Text>
                <View style={[styles.smallRowDivider, { marginLeft: this.props.marginLeftValue }]} />
                <SwitchToggle
                    switchOn={this.props.switchOn}
                    onPress={() => this.props.toggle(this.props.swtichTitle)}
                    circleColorOff="white"
                    circleColorOn="white"
                    backgroundColorOn="blue"
                />
                <View style={styles.rowDivider} />
                <Text style={styles.feeText}>{this.props.fee}%</Text>
            </View>
        );
    }
}
