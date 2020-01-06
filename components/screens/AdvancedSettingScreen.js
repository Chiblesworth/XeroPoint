import React, { Component } from 'react';
import { View, Text } from 'react-native';
import SwitchToggle from 'react-native-switch-toggle';

import CustomHeader from '../CustomHeader';

import { storageGet, storageSet } from '../../helpers/localStorage';

import { updateMerhcantSettings } from '../../api_requests/updateMerchantSettings';

import { styles } from '../styles/AdvancedSettingStyles';

export default class AdvancedSettingScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            advancedSettingSwitch: false
        };
    }

    async componentDidMount() {
        let lossPreventionOn = await storageGet("lossPreventionOn");
        lossPreventionOn = JSON.parse(lossPreventionOn);

        (lossPreventionOn != null)
            ? this.setState({advancedSettingSwitch: lossPreventionOn})
            : this.setState({advancedSettingSwitch: false});
    }

    handleHeaderIconPress = () => {
        this.props.navigation.pop();
    }

    handleSwitchPress = () => {
        this.setState({advancedSettingSwitch: !this.state.advancedSettingSwitch}, () => {
            this.toggleLossPrevention();
        });
    }

    toggleLossPrevention = async () => {
        let merchantId = await storageGet("merchantId");
        let data = {
            lossPrevention: {
                keyedAvsAddress: this.state.advancedSettingSwitch,
                keyedAvsZip: this.state.advancedSettingSwitch,
                keyedCvv: this.state.advancedSettingSwitch,
            }
        };

        let status = await updateMerhcantSettings(merchantId, data);

        if(status === 200){
            (this.state.advancedSettingSwitch)
                ? storageSet("lossPreventionOn", "true")
                : storageSet("lossPreventionOn", "false");
        }
        else{
            this.setState({advancedSettingSwitch: !this.state.advancedSettingSwitch});
        }
    }

    render() {
        return (
            <View style={styles.mainContainer}>
                <CustomHeader
                    iconName="chevron-left"
                    type="entypo"
                    title="Advanced"
                    handlePress={this.handleHeaderIconPress}
                    backgroundColor="#656565"
                />
                <View style={styles.row}>
                    <View><Text style={styles.text}>Advanced Data</Text></View>
                    <View>
                        <SwitchToggle
                            switchOn={this.state.advancedSettingSwitch}
                            onPress={() => this.handleSwitchPress()}
                            circleColorOff="#fff"
                            circleColorOn="#fff"
                            backgroundColorOn="blue"
                        />
                    </View>
                </View>
            </View>
        );
    }
}