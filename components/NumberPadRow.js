import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import RefundIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import DeleteIcon from 'react-native-vector-icons/AntDesign';

export default class NumberPadRow extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        //Array that holds the each button represented as a column
        const columns = [];
        const deleteIcon = <DeleteIcon style={styles.icon} name="arrowleft" size={50} />
        const refundIcon = <RefundIcon style={styles.icon} name="plus-minus" size={55} />

        for(const [index, value] of this.props.rowNumbers.entries()){
            if((value === "refund") || (value === "delete")){
                if(value === "refund"){
                    columns.push(
                        <TouchableOpacity style={styles.padButton} key={index} onPress={() => this.props.handlePress(value)}>
                            {refundIcon}
                        </TouchableOpacity>
                    );
                }
                else{
                    columns.push(
                        <TouchableOpacity style={styles.padButton} key={index} onPress={() => this.props.handlePress(value)}>
                            {deleteIcon}
                        </TouchableOpacity>
                    );
                }
            }
            else{
                columns.push(
                    <TouchableOpacity style={styles.padButton} key={index} onPress={() => this.props.handlePress(value)}>
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

//Styles
const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        marginLeft: 50,
        marginRight: 50
    },
    padButton: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 100,
        height: 100,
        borderWidth: 1,
        borderColor: 'black'
    },
    buttonText: {
        fontSize: 50
    }
});
