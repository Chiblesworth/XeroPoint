import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';

export default class PaymentInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        let bgColor;
        if (this.props.status === "Settled" || "Approved") {
            bgColor = 'green';
        }
        else {
            bgColor = 'red';
        }

        return (
            <View style={styles.container}>
                <View style={styles.row}>
                    <Icon
                        type='entypo'
                        name='credit-card'
                        size={35}
                    />
                    <Text style={[styles.text, { paddingTop: 7, paddingLeft: 15 }]}>
                        XXXX XXXX XXXX {this.props.last4}
                    </Text>
                </View>
                <View style={styles.row}>
                    <View style={{ marginTop: 15 }}>
                        <Text style={styles.text}>Auth Code: {this.props.authCode}</Text>
                        <Text style={styles.text}>
                            Card {this.props.cardPresent ? "" : "Not "}Present
                        </Text>
                        <Text style={styles.text}>{this.props.entryMode}</Text>
                        <Text style={styles.text}>Ref #{this.props.reference}</Text>
                        <Text style={styles.text}>Batch #{this.props.batch}</Text>
                        <Text style={styles.text}>Team Member: {this.props.creatorName}</Text>
                    </View>
                    <View style={[{backgroundColor: bgColor}, styles.statusContainer]}>
                        <Text style={styles.statusText}>{this.props.status}</Text>
                    </View>
                </View>
            </View>
        );
    }
}

//Styles
const styles = StyleSheet.create({
    container: {
        margin: 15,
    },
    row: {
        flexDirection: 'row',
        marginLeft: 10
    },
    text: {
        color: 'black',
        fontSize: 14,
        letterSpacing: 0.5
    },
    statusContainer: {
        marginTop: 55,
        marginBottom: 55,
        width: '30%',
        height: 35,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    statusText: {
        color: '#fff',
        fontSize: 16
    }
});