import React from 'react';
import { View, Text, Button, StyleSheet } from "react-native";

export default class MainScreen extends React.Component {
    static navigationOptions = {
	};

    render() {
        const {navigate} = this.props.navigation;
        
        return (
            <View style={styles.container}>
                <View style={styles.mainScreenText}>
                    <Text>On MainScreen</Text>
                </View>
                <View>
                    <Button
                        title="Back to Login"
						onPress={() => navigate('Login')}
                    />
                </View>
            </View>
        );
    }
}

//Styles
const styles = StyleSheet.create({
    container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
    },
    mainScreenText: {
        marginBottom: 25,
    }
});