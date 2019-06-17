import React, { Component } from 'react';
import { View, Text, Button, StyleSheet } from "react-native";
import NumberPad from './NumberPad';

//Am going to need to find a way have number pad communicate with the main text on screen
export default class MainScreen extends Component {
    static navigationOptions = {
	};

    render() {
        const {navigate} = this.props.navigation;
        
        return (
            <View style={styles.container}>
                <View style={styles.mainScreenText}>
                    <Text>On MainScreen</Text>
                </View>
                <View>
                    <NumberPad />
                </View>
            </View>
        );
    }
}

//Styles
const styles = StyleSheet.create({
    container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
    },
    mainScreenText: {
        marginBottom: 25,
    }
});