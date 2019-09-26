import React from 'react';
import { Icon } from 'react-native-elements';

 const HeaderIcon = (props) => {
    return(
        <Icon
            name={props.name}
            type={props.type}
            size={props.size}
            color="white"
            iconStyle={{}}
            containerStyle={{height: '100%', paddingBottom: 50}}
            underlayColor={'#808080'}
            onPress={() => props.handlePress(props.name)}
        />
    );
 }

export default HeaderIcon;
