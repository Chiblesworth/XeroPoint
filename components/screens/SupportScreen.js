import React, { Component } from 'react';
import { Text, View, Linking, Platform } from 'react-native';
import { Button } from 'react-native-elements';
import {name as app_name, version as app_version}  from '../../package.json';

import CustomHeader from '../ui/CustomHeader';
import SupportTile from '../ui/SupportTile';

import { getMerchantDetails } from '../../api_requests/getMerchantDetails';

import { storageGet } from '../../helpers/localStorage';
import { showAlert } from '../../helpers/showAlert.js';

import { styles } from '../styles/SupportStyles';

export default class SupportScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            merchantId: null,
            merchantName: null,
            user: null
        }

        this.handleHeaderIconPress = this.handleHeaderIconPress.bind(this);
    }

    async componentDidMount(){
        let merchantId = await storageGet("merchantId");
        let user = await storageGet("username");
        let data = await getMerchantDetails(merchantId);

        this.setState({
            merchantId: merchantId,
            merchantName: data.dba,
            user: user
        });
    }

    handleHeaderIconPress = () => {
        this.props.navigation.navigate("Main");
    }

    linkToTelephone = () => {
        let phoneNumber;
        if(Platform.OS === 'android'){
            phoneNumber = `tel:8009355961`;
        }
        else if(Platform.OS === "ios"){
            phoneNumber = `telprompt:8009355961`;
        }

        Linking.canOpenURL(phoneNumber).then(supported => {
            if(!supported){
                showAlert("Error!", "Phone number is not available.");
            }
            else{
                return Linking.openURL(phoneNumber);
            }
        })
    }

    linkToEmail = () => {
        let emailAddress = `mailto:support@processinginc.com`;

        Linking.canOpenURL(emailAddress).then(supported => {
            if(!supported){
                showAlert("Error!", "Email address does not exist.");
            }
            else{
                return Linking.openURL(emailAddress);
            }
        })
    }

    render() {
        return (
            <View style={styles.content}>
                <CustomHeader
                    iconName="chevron-left"
                    type="entypo"
                    title="Support"
                    handlePress={this.handleHeaderIconPress}
                    backgroundColor="#656565"
                    underlayColor="#656565"
                />
                <View style={styles.row}>
                    <SupportTile
                        iconName="mail"
                        iconType="entypo"
                        contact="support@processinginc.com"
                        supportText="Varies"
                        handlePress={this.linkToEmail}
                    />
                    <SupportTile
                        iconName="phone"
                        iconType="entypo"
                        contact="(800) 935-5961"
                        supportText="24/7 Support"
                        handlePress={this.linkToTelephone}
                    />
                </View>
                <View style={{marginTop: '10%'}} />
                <Button
                    title="Help Center"
                    containerStyle={styles.buttonContainer}
                    buttonStyle={styles.button}
                    titleStyle={{fontSize: 18}}
                />
                <View style={styles.diagnosticInfo}>
                    <View style={{alignItems: 'center'}}>
                        <Text style={styles.text}>Diagnostic Infomation</Text>
                    </View>
                    <View 
                        style={[styles.row, {
                            justifyContent: 'space-between', 
                            margin: '5%'
                        }]}
                    >
                        <View>
                            <Text style={styles.text}>Merchant Number: </Text>
                            <Text style={styles.text}>Merchant Name:</Text>
                            <Text style={styles.text}>App Name:</Text>
                            <Text style={styles.text}>App Version:</Text>
                            <Text style={styles.text}>App User:</Text>
                        </View>
                        <View>
                            <Text style={styles.text}>{this.state.merchantId}</Text>
                            <Text style={styles.text}>{this.state.merchantName}</Text>
                            <Text style={styles.text}>{app_name}</Text>
                            <Text style={styles.text}>{app_version}</Text>
                            <Text style={styles.text}>{this.state.user}</Text>
                        </View>
                    </View>
                </View>
            </View>
        )
    }
}
