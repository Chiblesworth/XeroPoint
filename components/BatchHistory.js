import React, { Component } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
//Helper Methods
import { storageGet, storageSet } from '../helperMethods/localStorage';

export default class BatchHistory extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }



    render() {
        console.log("here in render of batchHistory")
        console.log(this.props.batches)
        return (
            <View>
                {this.props.batches.map((batch, index) => {
                    return (
                        <View key={index}>
                            <View style={[styles.row, { backgroundColor: "#D3D3D3" }]}>
                                <Text style={styles.text}>Batch {batch.reference}</Text>
                                <Text style={styles.text}>Closed By: {batch.closerName}</Text>
                            </View>
                            <View style={[styles.row, { padding: 20 }]}>
                                <View style={styles.batchInfoContainer}>
                                    <View style={
                                        {
                                            backgroundColor: '#2E2B2B',
                                            borderTopLeftRadius: 17,
                                            borderTopRightRadius: 17,
                                            width: '100%',
                                            alignItems: 'center'
                                        }
                                    }>
                                        <Text style={[styles.infoText, { color: '#fff' }]}>
                                            {batch.status.toUpperCase()}
                                        </Text>
                                    </View>
                                    <Text style={{ fontSize: 32, fontWeight: 'bold', color: '#000' }}>
                                        0
                                    </Text>
                                    <View style={
                                        {
                                            backgroundColor: '#DCDCDC',
                                            borderBottomLeftRadius: 20,
                                            borderBottomRightRadius: 20,
                                            width: '100%',
                                            alignItems: 'center'
                                        }
                                    }>
                                        <Text style={[styles.infoText, { color: '#000' }]}>
                                            $0.00
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    )
                })}
            </View>
        );
    }
}


{/* <View style={[styles.row, { backgroundColor: "#D3D3D3" }]}>
                                <Text style={styles.text}>
                                    Batch {item.reference}
                                </Text>
                                <Text style={styles.text}>
                                    Closed By: System
                            </Text>
                            </View>
                            <View style={[styles.row, { padding: 20 }]}>
                                <View style={styles.batchInfoContainer}>
                                    <View style={
                                        {
                                            backgroundColor: '#2E2B2B',
                                            borderTopLeftRadius: 17,
                                            borderTopRightRadius: 17,
                                            width: '100%',
                                            alignItems: 'center'
                                        }
                                    }>
                                        <Text style={[styles.infoText, { color: '#fff' }]}>
                                            CLOSED
                                    </Text>
                                    </View>
                                    <Text style={{ fontSize: 32, fontWeight: 'bold', color: '#000' }}>
                                        0
                                </Text>
                                    <View style={
                                        {
                                            backgroundColor: '#DCDCDC',
                                            borderBottomLeftRadius: 20,
                                            borderBottomRightRadius: 20,
                                            width: '100%',
                                            alignItems: 'center'
                                        }
                                    }>
                                        <Text style={[styles.infoText, { color: '#000' }]}>
                                            $0.00
                                    </Text>
                                    </View>
                                </View>
                                <View style={styles.column}>
                                    <Text>Sales:          0</Text>
                                    <Text>Refunds:     0</Text>
                                    <View style={{ paddingTop: '15%' }}>
                                        <Text>Open Date:</Text>
                                        <Text>Date</Text>
                                        <Text>Time</Text>
                                    </View>
                                </View>
                                <View style={styles.column}>
                                    <Text>$0.00</Text>
                                    <Text>$0.00</Text>
                                    <View style={{ paddingTop: '15%' }}>
                                        <Text>Close Date:</Text>
                                        <Text>Date</Text>
                                        <Text>Time</Text>
                                    </View>
                                </View>
                            </View> */}

{/* <View key={index} style={styles.batchContainer}>
                    <View style={[styles.row, { backgroundColor: "#D3D3D3" }]}>
                        <Text style={styles.text}>
                            Batch ID
                            </Text>
                        <Text style={styles.text}>
                            Closed By: System
                            </Text>
                    </View>
                    <View style={[styles.row, { padding: 20 }]}>
                        <View style={styles.batchInfoContainer}>
                            <View style={
                                {
                                    backgroundColor: '#2E2B2B',
                                    borderTopLeftRadius: 17,
                                    borderTopRightRadius: 17,
                                    width: '100%',
                                    alignItems: 'center'
                                }
                            }>
                                <Text style={[styles.infoText, { color: '#fff' }]}>
                                    CLOSED
                                    </Text>
                            </View>
                            <Text style={{ fontSize: 32, fontWeight: 'bold', color: '#000' }}>
                                0
                                </Text>
                            <View style={
                                {
                                    backgroundColor: '#DCDCDC',
                                    borderBottomLeftRadius: 20,
                                    borderBottomRightRadius: 20,
                                    width: '100%',
                                    alignItems: 'center'
                                }
                            }>
                                <Text style={[styles.infoText, { color: '#000' }]}>
                                    $0.00
                                    </Text>
                            </View>
                        </View>
                        <View style={styles.column}>
                            <Text>Sales:          0</Text>
                            <Text>Refunds:     0</Text>
                            <View style={{ paddingTop: '15%' }}>
                                <Text>Open Date:</Text>
                                <Text>Date</Text>
                                <Text>Time</Text>
                            </View>
                        </View>
                        <View style={styles.column}>
                            <Text>$0.00</Text>
                            <Text>$0.00</Text>
                            <View style={{ paddingTop: '15%' }}>
                                <Text>Close Date:</Text>
                                <Text>Date</Text>
                                <Text>Time</Text>
                            </View>
                        </View>
                    </View>
                </View> */}

//Styles
const styles = StyleSheet.create({
    batchContainer: {
        borderColor: "#696969",
        borderWidth: 1,
        height: '100%'
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    text: {
        padding: 10,
        fontSize: 16,
        color: "#000"
    },
    batchInfoContainer: {
        borderRadius: 20,
        borderWidth: 2,
        borderColor: "#2E2B2B",
        width: '25%',
        height: 115,
        alignItems: 'center',
        justifyContent: 'space-evenly',
    },
    infoText: {
        padding: 10,
        borderRadius: 20
    },
});