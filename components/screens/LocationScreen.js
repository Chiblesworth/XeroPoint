import React, { Component } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';

import CustomHeader from '../ui/CustomHeader';

import { getListOfMerchants } from '../../api_requests/getListOfMerchants';

import { storageGet } from '../../helpers/localStorage';

import { styles } from '../styles/LocationStyles';

export default class LocationScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            locallyStoredMerchantId: null,
            merchantList: []
        };
    }

    async componentDidMount() {
        let merchantId = await storageGet("merchantId");
        let data = await getListOfMerchants();
        console.log(data);

        this.setState({locallyStoredMerchantId: merchantId, merchantList: data.records});
    }

    handleHeaderIconPress = () => {
        this.props.navigation.pop();
    }

    handleTilePress = async (tappedMerchantId) => {
        console.log(tappedMerchantId);
    }

    render() {
        console.log(this.state.locallyStoredMerchantId);
        console.log(this.state.merchantList);

        return (
            <View style={styles.mainContainer}>
                <CustomHeader
                    iconName="chevron-left"
                    type="entypo"
                    title="Location"
                    handlePress={this.handleHeaderIconPress}
                    backgroundColor="#656565"
                    underlayColor="#656565"
                />
                <View>
                    {
                        this.state.merchantList.map((record) => {
                            return (
                                    <TouchableOpacity 
                                        key={record.id}
                                        onPress={() => this.handleTilePress(record.id)}
                                        style={styles.row}
                                    >
                                        <View>
                                            <Text style={[styles.text, {fontSize: 20}]}>{record.dba}</Text>
                                            <Text style={[styles.text, {fontSize: 16}]}>({record.xmid})</Text>
                                        </View>
                                        {   
                                            (record.id == this.state.locallyStoredMerchantId)
                                            ? (
                                                <Icon
                                                    type="entypo"
                                                    name="check"
                                                    size={30}
                                                    containerStyle={styles.iconContainer}
                                                    iconStyle={styles.iconStyle}
                                                />
                                            )
                                            : (
                                                null
                                            )
                                        }
                                    </TouchableOpacity>
                            )
                        })
                    }
                </View>
            </View>
        );
    }
}