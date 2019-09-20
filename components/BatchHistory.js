import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
//Helper Methods
import { storageGet, storageSet } from '../helperMethods/localStorage';
import { convertMilitaryToStandardTime } from '../helperMethods/dateFormats';

export default class BatchHistory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            batchPayments: []
        };

        this.handleBatchPress = this.handleBatchPress.bind(this);
        this.getBatchTransactions = this.getBatchTransactions.bind(this);
    }

    handleBatchPress(batchId) {
        console.log("Batch was tapped id is = " + batchId);
        this.getBatchTransactions(batchId);
    }

    async getBatchTransactions(batchId) {
        let encodedUser = await storageGet("encodedUser");

        let headers = {
            'Authorization': 'Basic ' + encodedUser,
            'Content-Type': 'application/json; charset=utf-8'
        };

        fetch(`https://sandbox.api.mxmerchant.com/checkout/v3/batchpayment?id=${batchId}`, {
            method: "GET",
            headers: headers
        }).then((response) => {
            return response.json();
        }).then((Json) => {
            this.setState({ batchPayments: Json.records }, () => {
                console.log(this.state.batchPayments);
                this.props.navigation.navigate("BatchPayments",
                    {
                        batchPayments: this.state.batchPayments
                    }
                ); //This navigation is passed as a prop
            })
        })
    }

    render() {
        console.log("here in render of batchHistory")
        console.log(this.props.batches)
        return (
            <View>
                {this.props.batches.map((batch, index) => {
                    let batchOpened = new Date(batch.opened);
                    let batchClosed = new Date(batch.closed)
                    let dateOpened = batchOpened.toDateString();
                    let timeOpened = batchOpened.toTimeString();
                    let dateClosed = batchClosed.toDateString();
                    let timeClosed = batchClosed.toTimeString();

                    timeOpened = timeOpened.split(" ");
                    timeOpened = convertMilitaryToStandardTime(timeOpened[0]);

                    timeClosed = timeClosed.split(" ");
                    timeClosed = convertMilitaryToStandardTime(timeClosed[0]);

                    return (
                        <TouchableOpacity
                            key={index}
                            onPress={() => this.handleBatchPress(batch.id)}
                        >
                            <View>
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
                                            {batch.netCount}
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
                                                ${parseFloat(Math.round(batch.netAmount * 100) / 100).toFixed(2)}
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={styles.column}>
                                        <Text>Sales:          {batch.saleCount}</Text>
                                        <Text>Refunds:     {batch.returnCount}</Text>
                                        <View style={{ paddingTop: '15%' }}>
                                            <Text>Open Date:</Text>
                                            <Text>{dateOpened}</Text>
                                            <Text>{timeOpened}</Text>
                                        </View>
                                    </View>
                                    <View style={styles.column}>
                                        <Text>${parseFloat(Math.round(batch.saleAmount * 100) / 100).toFixed(2)}</Text>
                                        <Text>${parseFloat(Math.round(batch.returnAmount * 100) / 100).toFixed(2)}</Text>
                                        <View style={{ paddingTop: '15%' }}>
                                            <Text>Close Date:</Text>
                                            <Text>{dateClosed}</Text>
                                            <Text>{timeClosed}</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                    )
                })}
            </View>
        );
    }
}

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