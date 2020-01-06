import React from 'react';
import { View, Text } from 'react-native';
import { Icon } from 'react-native-elements';

import { styles } from './styles/SupportTileStyles';
 
const SupportTile = (props) => {
    return (
        <View style={styles.supportContainer}>
            <Icon
                name={props.iconName}
                type={props.iconType}
                color="#fff"
                size={60}
            />
            <Text style={styles.text}>{props.contact}</Text>
            <View style={{ padding: '10%' }} />
            <Text style={[styles.text, { color: "#BABABA" }]}>{props.supportText}</Text>
        </View>
    );
}

export default SupportTile;