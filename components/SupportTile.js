import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';

const SupportTile = (props) => {
    return (
        <View style={styles.supportContainer}>
            <Icon
                name={props.iconName}
                type={props.iconType}
                color="#fff"
                size={60}
            />
            <View style={{ padding: 10 }} />
            <Text style={styles.text}>{props.contact}</Text>
            <View style={{ padding: 10 }} />
            <Text style={[styles.text, { color: "#BABABA" }]}>{props.supportText}</Text>
        </View>
    );
}

export default SupportTile;

//Styles
const styles = StyleSheet.create({
    supportContainer: {
        alignItems: 'center',
        backgroundColor: '#656565',
        height: '100%',
        width: '45%',
        marginTop: 20,
        marginRight: 4,
        marginLeft: 15,
        borderRadius: 10,
    },
    text: {
        color: '#fff',
        fontSize: 15
    }
});