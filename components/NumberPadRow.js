import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet} from 'react-native';

export default class NumberPadRow extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const columns = [];

        for(const [index, value] of this.props.rowNumbers.entries()){
            columns.push(
                <TouchableOpacity style={styles.padButton} key={index}>
                    <Text style={styles.buttonText}>
                        {value}
                    </Text>
                </TouchableOpacity>
            );
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
