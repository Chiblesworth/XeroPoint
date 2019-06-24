import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Header, Button, Icon } from 'react-native-elements';
import HeaderIcon from './HeaderIcon';

export default class SettingScreen extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
        };

        this.handleHeaderIconPress = this.handleHeaderIconPress.bind(this);
    }

    handleHeaderIconPress(){
        this.props.navigation.navigate("Main");
    }

    render() {
        const settingsArray = ["Location", "Signature", "Tips", "Printers", "Card Reader", "Advanced"];
        let settingsContent = []; //This holds the <Button> code

        for(const [index, setting] of settingsArray.entries()){
            settingsContent.push(
                <Button 
                    key={index}
                    icon={
                        <Icon 
                            name="chevron-right"
                            type="entypo"
                            size={40}
                            color="white"
                        />
                    }
                    iconRight
                    title={setting}
                    buttonStyle={styles.button}
                    titleStyle={styles.buttonTitle}
                />
            )
        }
        return (
            <View style={styles.mainContainer}>
                <View stlye={styles.header}>
                    <Header 
                        leftComponent={
                            <HeaderIcon 
                                name="chevron-left"
                                type="entypo"
                                size={70}
                                handlePress={this.handleHeaderIconPress}
                            /> 
                        }
                        centerComponent={
                            <Text style={styles.headerText}>Settings</Text>
                        }
                        backgroundColor='#808080'
                        containerStyle={{ borderBottomWidth: 0 }}
                    />
                </View>
                <View style={styles.container}>
                    {settingsContent}
                </View>
            </View>
        );
    }
}

//Styles
const styles = StyleSheet.create({
    mainContainer: {
        height: '100%',
        backgroundColor: '#808080'
    },
    header: {
        width: '100%',
        height: 70
    },
    headerText: {
        fontSize: 40,
        color: 'white',
        paddingBottom: 20
    },
    button: {
        justifyContent: 'space-between',
        backgroundColor: '#808080',
        borderBottomWidth: 2,
        borderBottomColor: '#E8E8E8',
    },
    buttonTitle: {
        fontSize: 30
    }
});