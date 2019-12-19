import React, { Component } from 'react';
import { View, Text } from 'react-native';

import { styles } from './styles/TotalInfoStyles';

export default class TotalInfo extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let amount; 

        //MX Merchant doesn't give an originalAmount field back if tip is 0.00. 
        //Simple workaround for that
        (this.props.tip === "0.00")
            ? amount = this.props.total
            : amount = this.props.originalAmount;

        return (
            <View style={styles.container}>
                <View style={styles.row}>
                    <Text style={styles.text}>Amount:</Text>
                    <View style={{padding:20}}/>
                    <Text style={styles.text}>
                        {parseFloat(Math.round(amount * 100) / 100).toFixed(2)}
                    </Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.text}>+Tip:</Text>
                    <View style={{padding:20}}/>
                    <Text style={styles.text}>
                        {parseFloat(Math.round(this.props.tip * 100) / 100).toFixed(2)}
                    </Text>
                </View>
                <View style={styles.additionBar}/>
                <View style={{paddingBottom: 15}}/>
                <View style={styles.row}>
                    <Text style={styles.text}>=Total:</Text>
                    <View style={{padding:20}}/>
                    <Text style={styles.text}>
                        {parseFloat(Math.round(this.props.total * 100) / 100).toFixed(2)}
                    </Text>
                </View>
            </View>
        );
    }
}