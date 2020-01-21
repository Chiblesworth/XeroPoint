import React, { Component } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';
import { StackActions, NavigationActions } from 'react-navigation';
import RNAnyPay from 'react-native-any-pay';

import CustomHeader from '../ui/CustomHeader';

import { getListOfMerchants } from '../../api_requests/getListOfMerchants';

import { getApiKeys } from '../../api_requests/getApiKeys';

import { storageGet, storageSet } from '../../helpers/localStorage';

import { styles } from '../styles/LocationStyles';

const AnyPay = RNAnyPay.AnyPay;
const resetAction = StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({ routeName: 'DrawerStack' })],
});

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

        this.setState({locallyStoredMerchantId: merchantId, merchantList: data.records});
    }

    handleHeaderIconPress = () => {
        this.props.navigation.pop();
    }

    handleTilePress = async (tappedMerchantId) => {
        storageSet("merchantId", tappedMerchantId.toString());
        this.setState({locallyStoredMerchantId: tappedMerchantId});

        this.reinitializeTerminal(tappedMerchantId);
        this.props.navigation.dispatch(resetAction);
    }

    reinitializeTerminal = async (merchantId) => {
        let data = await getApiKeys(merchantId);

        if(AnyPay.verifyPermissions()){
            AnyPay.requestPermissions();
            
            await AnyPay.initializeSDK();

            await AnyPay.intializeTerminal({
                consumerKey: data.records[0].apiKey,
                secret: data.records[0].apiSecret,
                merchantId: merchantId.toString(),
                url: 'https://api.mxmerchant.com/checkout/v3/'
            });
        }
    }

    render() {
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
                <ScrollView>
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
                </ScrollView>
            </View>
        );
    }
}