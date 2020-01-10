import React, { Component } from 'react';
import { View, Text } from 'react-native';
import SwitchToggle from 'react-native-switch-toggle';

import CustomHeader from '../ui/CustomHeader';

import { updateMerhcantSettings } from '../../api_requests/updateMerchantSettings';

import { storageGet, storageSet } from '../../helpers/localStorage';

import { styles } from '../styles/AdvancedSettingStyles';

export default class AdvancedSettingScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            lossPreventionSwitch: false,
            collectSignatureSwitch: false
        };
    }

    async componentDidMount() {
        let lossPreventionOn = await storageGet("lossPreventionOn");
        let collectSignature = await storageGet("collectSignature");
        
        lossPreventionOn = JSON.parse(lossPreventionOn);
        collectSignature = JSON.parse(collectSignature);

        (lossPreventionOn != null)
            ? this.setState({lossPreventionSwitch: lossPreventionOn})
            : this.setState({lossPreventionSwitch: false});

        (collectSignature != null)
            ? this.setState({collectSignatureSwitch: collectSignature})
            : this.setState({collectSignatureSwitch: false});
    }

    handleHeaderIconPress = () => {
        this.props.navigation.pop();
    }

    handleSwitchPress = (switchPressed) => {
        if(switchPressed === "lossPrevention"){
            this.setState({lossPreventionSwitch: !this.state.lossPreventionSwitch}, () => {
                this.toggleLossPrevention();
            });
        }
        else if(switchPressed === "signature"){
            this.setState({collectSignatureSwitch: !this.state.collectSignatureSwitch}, () => {
                this.toggleCollectSignature();
            });
        }
    }

    toggleLossPrevention = async () => {
        let merchantId = await storageGet("merchantId");
        let data = {
            lossPrevention: {
                keyedAvsAddress: this.state.lossPreventionSwitch,
                keyedAvsZip: this.state.lossPreventionSwitch,
                keyedCvv: this.state.lossPreventionSwitch,
            }
        };

        let status = await updateMerhcantSettings(merchantId, data);

        if(status === 200){
            (this.state.lossPreventionSwitch)
                ? storageSet("lossPreventionOn", "true")
                : storageSet("lossPreventionOn", "false");
        }
        else{
            this.setState({lossPreventionSwitch: !this.state.lossPreventionSwitch});
        }
    }

    toggleCollectSignature = () => {
        (this.state.collectSignatureSwitch)
            ? storageSet("collectSignature", "true")
            : storageSet("collectSignature", "false");
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
                    underlayColor="#656565"
                />
                <View style={styles.row}>
                    <View><Text style={styles.text}>Loss Prevention</Text></View>
                    <View>
                        <SwitchToggle
                            switchOn={this.state.lossPreventionSwitch}
                            onPress={() => this.handleSwitchPress("lossPrevention")}
                            circleColorOff="#fff"
                            circleColorOn="#fff"
                            backgroundColorOn="blue"
                        />
                    </View>
                </View>
                <View style={styles.row}>
                    <View><Text style={styles.text}>Collect Signature</Text></View>
                    <View>
                        <SwitchToggle
                            switchOn={this.state.collectSignatureSwitch}
                            onPress={() => this.handleSwitchPress("signature")}
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