import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Header } from 'react-native-elements';

import HeaderIcon from './HeaderIcon';

import { styles } from './styles/CustomHeaderStyles';

export default class CustomHeader extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View>
                <Header
                    leftComponent={
                        <HeaderIcon
                            name={this.props.iconName}
                            type={this.props.type}
                            size={50}
                            handlePress={this.props.handlePress}
                        />
                    }
                    centerComponent={
                        <Text style={styles.headerText}>{this.props.title}</Text>
                    }
                    backgroundColor={this.props.backgroundColor}
                    containerStyle={{ borderBottomWidth: 0 }}
                />
            </View>
        );
    }
}
