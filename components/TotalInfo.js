import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default class TotalInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        let amount; 
        //MX Merchant doesn't give an originalAmount field back if tip is 0.00. 
        //Simple workaround for that
        if(this.props.tip === "0.00"){
            amount = this.props.total;
        }
        else{
            amount = this.props.originalAmount;
        }

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

//Styles
const styles = StyleSheet.create({
    container: {
        margin: 15,
        marginRight: 20,
        alignItems: 'flex-end',
    },
    row: {
        justifyContent: 'space-around',
        flexDirection: 'row'
    },
    text: {
        fontSize: 18,
        color: 'black',
        letterSpacing: 0.5
    },
    additionBar: {
        borderBottomWidth: 1,
        borderColor: 'black',
        width: '50%'
    }
});