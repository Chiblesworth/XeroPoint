import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Overlay, Button, Icon } from 'react-native-elements';

import { styles } from '../styles/AuthorizationOverlayStyles';

export default class AuthorizationOverlay extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let iconName, iconContainerColor;

        if(this.props.title === "Approved"){
            iconName = "checkcircle";
            iconContainerColor = '#287C28';
        }
        else if(this.props.title === "Declined"){
            iconName = "closecircle";
            iconContainerColor = '#E50F0F';
        }

        (this.props.isRefund)
            ? refundText = "Refund"
            : refundText = "";
        
        
        return (
            <Overlay
                isVisible={this.props.visible}
                onBackdropPress={() => this.props.handleClose(this.props.title)}
                height='40%'
                width='85%'
                borderRadius={10}
            >
                <View style={styles.container}>
                    <View style={styles.row}>
                        <Text style={styles.title}>{refundText + " " + this.props.title}!</Text>
                        <Icon
                            type="antdesign"
                            name={iconName}
                            containerStyle={styles.iconContainer}
                            iconStyle={{color: iconContainerColor}}
                        />
                    </View>
                    <View style={styles.approvedData}>
                        <View style={styles.row}>
                            <Text style={styles.text}>Date: {this.props.formatedDate}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.text}>Time: {this.props.formatedTime}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.text}>Amount: ${this.props.determineAmount()}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.text}>
                                AuthCode:
                                {(this.props.authCode === null) ? " None available." : this.props.authCode}
                            </Text>
                        </View>
                    </View>
                    <Button 
                        title="Okay"
                        onPress={() => this.props.handleClose(this.props.title)}
                        containerStyle={styles.buttonContainer}
                        titleStyle={styles.buttonTitle}
                    />
                </View> 
            </Overlay>
        );
    }
}