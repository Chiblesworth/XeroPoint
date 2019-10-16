import React from 'react';
import { Icon } from 'react-native-elements';

 const HeaderIcon = (props) => {
    return(
        <Icon
            name={props.name}
            type={props.type}
            size={props.size}
            color="#fff"
            iconStyle={{}}
            containerStyle={{height: '100%', paddingBottom: 50}}
            underlayColor={'#454343'}
            onPress={() => props.handlePress(props.name)}
            
        />
    );
 }

export default HeaderIcon;
