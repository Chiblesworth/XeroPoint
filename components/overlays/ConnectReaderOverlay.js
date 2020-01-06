import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Overlay, Button } from 'react-native-elements';

import { styles } from '../styles/ConnectReaderOverlayStyles';

export default class ConnectReaderOverlay extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Overlay
                isVisible={this.props.isVisible}
                onBackdropPress={() => this.props.handleClose()}
                height='30%'
                width='75%'
                borderRadius={10}
            >
                <View style={styles.container}>
                    <Text style={styles.text}>Select Connect Method</Text>
                    <Button
                        type="solid"
                        title="Audio"
                        containerStyle={styles.buttonContainer}
                        titleStyle={styles.text}
                        onPress={() => this.props.connectAudioReader()}
                    />
                    <Button
                        type="solid"
                        title="Bluetooth"
                        containerStyle={styles.buttonContainer}
                        titleStyle={styles.text}
                        onPress={() => this.props.connectBluetoothReader()}
                    />
                </View>
            </Overlay>
        );
    }
}
