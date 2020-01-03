import React, { Component } from 'react';
import { View, Text, NativeEventEmitter } from 'react-native';
import { Button } from 'react-native-elements';
import RNAnyPay from 'react-native-any-pay';

import CustomHeader from '../CustomHeader';

const AnyPay = RNAnyPay.AnyPay;
const eventEmitter = new NativeEventEmitter(AnyPay);

export default class CardReaderScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cardReaderConnected: false,
            manufacturer: null,
            model: null,
            firmwareVersion: null,
            batteryLevel: null,
            interface: null
        };
    }

    async componentDidMount() {
        eventEmitter.addListener('CardReaderConnected', this.handleCardReaderConnect.bind(this));
        eventEmitter.addListener('CardReaderDisconnected', this.handleCardReaderDisconnect.bind(this));

        let connected = await AnyPay.isReaderConnected();

        this.setState({cardReaderConnected: connected}, () => {
            console.log(this.state.cardReaderConnected);
        });
    }

    handleCardReaderConnect = (event) => {
        let manufacturer;
        console.log(event.device);
        let deviceDetails = JSON.parse(event.device);

        console.log(deviceDetails);
        if(deviceDetails.detectedReaderType.includes("Walker")){
            manufacturer = "AnywhereCommerce";
        }

        AnyPay.isReaderConnected().then((connected) => {
            this.setState({
                cardReaderConnected: connected,
                manufacturer: manufacturer,
                model: deviceDetails.detectedReaderType,
                firmwareVersion: deviceDetails.firmwareVersion,
                batteryLevel: deviceDetails.batteryLevel
            }, () => {
                console.log(this.state);
            });
        });
    }

    handleCardReaderDisconnect = (event) => {
        console.log(event);
        AnyPay.isReaderConnected().then((connected) => {
            this.setState({
                cardReaderConnected: connected,
                manufacturer: null,
                model: null,
                firmwareVersion: null,
                batteryLevel: null
            }, () => {
                console.log(this.state);
            });
        });
    }

    handleHeaderIconPress = () => {
        this.props.navigation.pop();
    }

    handleButtonPress = async () => {
        console.log("Here in button press");
        (this.state.cardReaderConnected)
            ? AnyPay.disconnectReader()
            : AnyPay.connectBluetoothReader();
    }

    renderUnconnectedReader = () => {
        return (
            <View>
                <Text>No card reader connected</Text>
            </View>
        );
    }

    renderConnectedReader = () => {
        return (
            <View>
                <Text>Manufacturer: {this.state.manufacturer}</Text>
                <Text>Model: {this.state.model}</Text>
                <Text>Firmware Version: {this.state.firmwareVersion}</Text>
                <Text>Battery Level: {this.state.batteryLevel}</Text>
                <Text>Interface:</Text>
            </View>
        );
    }

    render() {
        return (
            <View>
                <CustomHeader
                    iconName="chevron-left"
                    type="entypo"
                    title="Card Reader"
                    handlePress={this.handleHeaderIconPress}
                    backgroundColor="#656565"
                />
                <View>
                    {(this.state.cardReaderConnected)
                        ? this.renderConnectedReader()
                        : this.renderUnconnectedReader()
                    }
                    <Button
                        type="solid"
                        title={(this.state.cardReaderConnected) ? "Disconnect Card Reader" : "Connect Card Reader"} 
                        onPress={() => this.handleButtonPress()}
                    />

                    <Button
                        type="solid"
                        title="test"
                        onPress={() => AnyPay.connectBluetoothReader()}
                    />
                </View>
            </View>
        );
    }
}
