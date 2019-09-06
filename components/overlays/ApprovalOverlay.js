import React, { Component } from 'react';
import { View, Text, StyleSheet} from 'react-native';
import { Overlay, Button, Icon } from 'react-native-elements';

export default class ApprovalOverlay extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Overlay
                isVisible={this.props.visible}
                onBackdropPress={() => this.props.handleClose("approval")}
                height={300}
                width={350}
                borderRadius={25}
            >
                <View style={styles.container}>
                    <View style={styles.row}>
                        <Text style={styles.title}>{this.props.title}</Text>
                        <Icon
                            type="antdesign"
                            name="checkcircle"
                            containerStyle={styles.iconContainer}
                            iconStyle={styles.icon}
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
                            <Text style={styles.text}>Amount: </Text>
                            <Text style={styles.text}>${this.props.determineAmount()}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.text}>AuthCode: {this.props.authCode}</Text>
                        </View>
                    </View>
                    <Button 
                        title="Okay"
                        onPress={() => this.props.handleClose("approval")}
                        containerStyle={styles.buttonContainer}
                        buttonStyle={styles.buttonStyle}
                        titleStyle={styles.buttonTitle}
                    />
                </View>
            </Overlay>
        );
    }
}

//Styles
const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    approvedData: {
        alignItems: 'flex-start',
        marginRight: 125,
        marginBottom: 40
    },
    title: {
        fontSize: 25,
        marginBottom: 25
    },
    text: {
        fontSize: 20
    },
    row: {
        flexDirection: 'row'
    },
    iconContainer: {
        marginTop: 5,
        marginLeft: 15
    },
    icon: {
        color: 'green'
    },
    buttonContainer: {
        width: 100,
        height: 50,
    },
    buttonStyle: {
        backgroundColor: 'green'
    },
    buttonTitle: {
        fontSize: 20,
        color: 'white'
    }
});