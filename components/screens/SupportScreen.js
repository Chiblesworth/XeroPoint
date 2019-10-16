import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';
import {name as app_name, version as app_version}  from '../../package.json';
//Componets
import CustomHeader from '../CustomHeader';
import SupportTile from '../SupportTile';
//Helper Methods
import { storageGet } from '../../helperMethods/localStorage';

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

    async componentWillMount(){
        let merchantId = await storageGet("merchantId");
        let encodedUser = await storageGet("encodedUser");
        let user = await storageGet("username");

        let headers = {
            'Authorization': 'Basic ' + encodedUser,
            'Content-Type': 'application/json; charset=utf-8'
        }
        
        fetch(`https://sandbox.api.mxmerchant.com/checkout/v3/merchant/${merchantId}`, {
            method: "GET",
            headers: headers    
        }).then((response) => {
            return response.json()
        }).then((Json) => {
            this.setState({
                merchantId: merchantId,
                merchantName: Json.dba,
                user: user
            });
        });
    }

    handleHeaderIconPress() {
        this.props.navigation.navigate("Main");
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
                />
                <View style={styles.row}>
                    <SupportTile
                        iconName="mail"
                        iconType="entypo"
                        contact="support@processinginc.com"
                        supportText="Varies"
                    />
                    <SupportTile
                        iconName="phone"
                        iconType="entypo"
                        contact="(800) 935-5961"
                        supportText="24/7 Support"
                    />
                </View>
                <View style={{marginTop: 30}} />
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
                            margin: 20,
                            marginLeft: 30,
                            marginRight: 30
                        }]}
                    >
                        <View>
                            <Text style={styles.text}>Merchant Number:</Text>
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

//Styles
const styles = StyleSheet.create({
    content: {
        backgroundColor: '#454343',
        height: '100%'
    },
    row: {
        flexDirection: 'row',
    },
    buttonContainer: {
        height: '10%',
        margin: 15,
        backgroundColor: '#656565'
    },
    button: {
        height: '100%',
        backgroundColor: '#656565'
    },
    diagnosticInfo: {
        height: '100%',
    },
    text: {
        color: '#fff',
        fontSize: 16,
        paddingTop: 7
    }
});
