import React, { Component } from 'react'
import { Text, View, StyleSheet } from 'react-native'

export default class SupportScreen extends Component {
    render() {
        return (
            <View style={styles.content}>
                <Text> textInComponent </Text>
            </View>
        )
    }
}

//Styles
const styles = StyleSheet.create({
    content: {
        backgroundColor: '#454343',
        height: '100%'
    }
});
