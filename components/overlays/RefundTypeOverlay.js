import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Overlay, Button } from 'react-native-elements';

import { styles } from '../styles/RefundTypeOverlayStyles';

export default class RefundTypeOverlay extends Component {
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
                    <Text style={styles.text}>Select Refund Type</Text>
                    <Button
                        type="solid"
                        title="Partial"
                        containerStyle={styles.buttonContainer}
                        titleStyle={styles.text}
                        onPress={() => this.props.handleRefundType("partial")}
                    />
                    <Button
                        type="solid"
                        title="Full"
                        containerStyle={styles.buttonContainer}
                        titleStyle={styles.text}
                        onPress={() => this.props.handleRefundType("full")}
                    />
                </View>
            </Overlay>
        );
    }
}
