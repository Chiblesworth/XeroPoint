import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Overlay, Button } from 'react-native-elements';

import { styles } from '../styles/ConfirmRefundOverlayStyles';

export default class ConfirmRefundOverlay extends Component {
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
                    <Text style={styles.text}>Are you sure?</Text>
                    <Button
                        type="solid"
                        title="Yes"
                        containerStyle={styles.buttonContainer}
                        titleStyle={styles.text}
                        onPress={() => this.props.action()}
                    />
                    <Button
                        type="solid"
                        title="No"
                        containerStyle={styles.buttonContainer}
                        titleStyle={styles.text}
                        onPress={() => this.props.handleClose()}
                    />
                </View>
            </Overlay>
        );
    }
}
