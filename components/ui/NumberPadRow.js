import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import RefundIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import DeleteIcon from 'react-native-vector-icons/AntDesign';

import { styles } from '../styles/NumberPadRowStyles';

export default class NumberPadRow extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        //Array that holds the each button represented as a column
        const columns = [];
        const deleteIcon = <DeleteIcon style={styles.icon} color="#fff" name="arrowleft" size={50} />
        const refundIcon = <RefundIcon style={styles.icon} color="#fff" name="plus-minus" size={55} />

        for(const [index, value] of this.props.rowNumbers.entries()){
            if((value === "refund") || (value === "delete")){
                (value === "refund")
                    ? columns.push(
                        <TouchableOpacity 
                            style={styles.padButton} 
                            key={index} 
                            onPress={() => this.props.handlePress(value)}
                        >
                            {refundIcon}
                        </TouchableOpacity>
                    )
                    :  columns.push(
                        <TouchableOpacity 
                            style={styles.padButton} 
                            key={index} 
                            onPress={() => this.props.handlePress(value)}
                        >
                            {deleteIcon}
                        </TouchableOpacity>
                    );
            }
            else{
                columns.push(
                    <TouchableOpacity 
                        style={styles.padButton} 
                        key={index} 
                        onPress={() => this.props.handlePress(value)}
                        disabled={this.props.isDisabled}
                    >
                        <Text style={styles.buttonText}>
                            {value}
                        </Text>
                    </TouchableOpacity>
                );
            }
        }
        return (
            <View style={styles.row}>
                {columns}
            </View>
        );
    }
}