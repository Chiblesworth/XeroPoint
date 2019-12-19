import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Overlay } from 'react-native-elements';

import { styles } from '../styles/EmvProcessOverlayStyles';

export default class EmvProcessOverlay extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Overlay
                isVisible={this.props.isVisible}
                height='15%'
                width='80%'
                overlayBackgroundColor='#938D8D'
                borderRadius={10}
                onBackdropPress={() => this.props.handleClose()}
                overlayStyle={styles.overlay}
            >
                <View style={styles.container}>
                    <Text style={styles.text}>{this.props.message}</Text>
                </View>
            </Overlay>
        );
    }
}
