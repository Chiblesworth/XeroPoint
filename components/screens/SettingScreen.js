import React, { Component } from 'react';
import { View } from 'react-native';
import { Button, Icon } from 'react-native-elements';

import CustomHeader from '../CustomHeader';

import { styles } from '../styles/SettingStyles';

export default class SettingScreen extends Component {
    constructor(props) {
        super(props);
    }

    handleHeaderIconPress = () => {
        this.props.navigation.navigate("Main");
    }

    handleButtonPress = (setting) => {
        if(setting === "Additional Fees"){
            console.log("Pressed fees button");
            this.props.navigation.navigate("Fees");
        }
        else if(setting === "Tips"){
            this.props.navigation.navigate("Tips");
        }
        else if(setting === "Advanced"){
            this.props.navigation.navigate("Advanced");
        }
        else if(setting === "Card Reader"){
            this.props.navigation.navigate("CardReader");
        }
        else if(setting === "Location"){
            this.props.navigation.navigate("Location");
        }
    }

    render() {
        const settingsArray = ["Location", "Additional Fees", "Signature", "Tips", "Card Reader", "Advanced"];
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
                    onPress={() => this.handleButtonPress(setting)}
                    buttonStyle={styles.button}
                    titleStyle={styles.buttonTitle}
                />
            )
        }
        
        return (
            <View style={styles.mainContainer}>
                <CustomHeader 
                    iconName="chevron-left"
                    type="entypo"
                    title="Settings"
                    handlePress={this.handleHeaderIconPress}
                    backgroundColor="#656565"
                />
                <View style={styles.container}>
                    {settingsContent}
                </View>
            </View>
        );
    }
}