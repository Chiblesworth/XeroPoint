import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Icon } from 'react-native-elements';

import CustomHeader from '../ui/CustomHeader';

import { getLocation } from '../../api_requests/getLocation';

import { storageGet } from '../../helpers/localStorage';

import { styles } from '../styles/LocationStyles';

export default class LocationScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dba: null,
            xmid: null
        };
    }

    async componentDidMount() {
        let merchantId = await storageGet("merchantId");
        let data = await getLocation(merchantId);

        this.setState({dba: data.dba, xmid: data.xmid});
    }

    handleHeaderIconPress = () => {
        this.props.navigation.pop();
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
                <View>
                    <View style={styles.row}>
                        <View>
                            <Text style={[styles.text, {fontSize: 20}]}>{this.state.dba}</Text>
                            <Text style={[styles.text, {fontSize: 16}]}>({this.state.xmid})</Text>
                        </View>
                        <Icon
                            type="entypo"
                            name="check"
                            size={30}
                            containerStyle={styles.iconContainer}
                            iconStyle={styles.iconStyle}
                        />
                    </View>
                </View>
            </View>
        );
    }
}
