import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Icon } from 'react-native-elements';

import { styles } from './styles/PaymentInfoStyles';

export default class PaymentInfo extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let backgroundCol;

        if (this.props.status === "Settled") {
            backgroundCol = '#287C28';
        }
        else if(this.props.status === "Declined") {
            backgroundCol = '#E50F0F';
        }
        else if(this.props.status === "Voided"){
            backgroundCol = '#F3A41C';
        }
        else if(this.props.status === "Approved"){
            //This was originally in the settled condition, but it kept causing voided to be green rather than orange
            backgroundCol = '#287C28';
        }

        return (
            <View style={styles.container}>
                <View style={styles.row}>
                    <Icon
                        type='entypo'
                        name='credit-card'
                        size={35}
                    />
                    <Text style={[styles.text, { padding: '4%' }]}>
                        XXXX XXXX XXXX {this.props.last4}
                    </Text>
                </View>
                <View style={styles.row}>
                    <View style={{ marginTop: '4%' }}>
                        <Text style={styles.text}>Auth Code: {this.props.authCode}</Text>
                        <Text style={styles.text}>
                            Card {this.props.cardPresent ? "" : "Not "}Present
                        </Text>
                        <Text style={styles.text}>{this.props.entryMode}</Text>
                        <Text style={styles.text}>Ref #{this.props.reference}</Text>
                        <Text style={styles.text}>Batch #{this.props.batch}</Text>
                        <Text style={styles.text}>Team Member: {this.props.creatorName}</Text>
                    </View>
                    <View style={[styles.statusContainer, {backgroundColor: backgroundCol},]}>
                        <Text style={styles.statusText}>{this.props.status}</Text>
                    </View>
                </View>
            </View>
        );
    }
}