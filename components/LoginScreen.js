import React, { Component } from 'react';
import { View, Text, Button, TextInput, StyleSheet } from "react-native";
import SwitchComponent from './SwitchComponent';

export default class LoginScreen extends Component {
	constructor(props){
		super(props);

		this.state = {
			switchValue: false
		};
	}

	static navigationOptions = {
	};

	toggleSwitch = (value) => {
		this.setState({switchValue: value});
	}

	render() {
		const {navigate} = this.props.navigation;

		return (
			<View style={styles.container}>
				<View style={styles.loginTextSection}>
					<Text>On LoginScreen</Text>
				</View>
				<View style={styles.loginFormSection}>
					<TextInput 
						style={styles.textField}
						placeholder="Username"
						underlineColorAndroid="transparent"
					/>
					<TextInput 
						style={styles.textField}
						placeholder="Password"
						underlineColorAndroid="transparent"
					/>
				</View>
				<View style={styles.rememberMeSection}>
					<Text>Hello</Text>
					<SwitchComponent
						toggleSwitch={this.toggleSwitch}
						switchValue={this.state.switchValue}
					/>
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
	},
	loginFormSection: {
		width: '80%',
		marginBottom: 15
	},
	rememberMeSection: {
		flexDirection: 'row'
	},
	textField: {
		height: 45,
		borderColor: 'gray',
		borderWidth: 2,
		borderRadius: 10,
		marginBottom: 10
	}
});