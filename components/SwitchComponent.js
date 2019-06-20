import React from 'react';
import { View, Switch } from 'react-native';

export default SwitchComponent = (props) => {
    return (
        <View>
            <Switch
                onValueChange={props.toggleSwitch}
                value={props.switchValue}
            />
        </View>
    );
}