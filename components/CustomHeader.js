import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Header } from 'react-native-elements';
//Components
import HeaderIcon from './HeaderIcon';

export default class CustomHeader extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
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

//Styles
const styles = StyleSheet.create({
    headerText: {
        fontSize: 30,
        color: '#fff',
        paddingBottom: 30
    },
});
