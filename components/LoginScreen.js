import React from "react";
import { View, Text } from "react-native";

export default class LoginScreen extends React.Component {
	static navigationOptions = {
	};

	render() {
		const {navigation} = this.props.navigation;

		return (
			<View>
				<Text>On LoginScreen</Text>
			</View>
		)
	}
}