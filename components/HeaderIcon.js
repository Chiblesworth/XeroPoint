import React from 'react';
import { Icon } from 'react-native-elements';

 const HeaderIcon = (props) => {
    return(
        <Icon
            name={props.name}
            type={props.type}
            size={60}
            color="white"
            iconStyle={{paddingBottom: 40}}
            underlayColor={'#808080'}
            onPress={() => props.handlePress(props.name)}
        />
    );
 }

export default HeaderIcon;
