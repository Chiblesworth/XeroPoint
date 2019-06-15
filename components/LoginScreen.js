import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";

export default class LoginScreen extends React.Component {
	static navigationOptions = {
	};

	render() {
		const {navigate} = this.props.navigation;

		return (
			<View style={styles.container}>
				<View style={styles.loginTextSection}>
					<Text>On LoginScreen</Text>
				</View>
				<View>
					<Button 
						title="Skip Login"
						onPress={() => navigate('Main')}
					/>
				</View>
			</View>
		)
	}
}

//Styles see https://facebook.github.io/react-native/docs/style for ref
const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	loginTextSection: {
		marginBottom: 25,
	}
});