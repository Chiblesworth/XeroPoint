import React, { Component } from 'react';
import { View, Text, Button, TextInput, Linking, StyleSheet } from "react-native";
import SwitchToggle from 'react-native-switch-toggle';

export default class LoginScreen extends Component {
	constructor(props){
		super(props);

		this.state = {
			switchValue: false
		};

		this.toggleSwitch = this.toggleSwitch.bind(this);
	}

	toggleSwitch(){
		this.setState({switchValue: !this.state.switchValue});
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
				<View style={styles.policyTextSection}>
					<Text style={styles.policyText}>
						By signing up you accept the Terms of {" "}
						<Text 
							style={styles.policyLinks}
							onPress={() => Linking.openURL('https://google.com')}
						>
							Terms of Serive {" "}
						</Text>
						and our {" "} 
						<Text style={styles.policyLinks}>
							Privacy Policy
						</Text>
					</Text>
				</View>
				<View style={styles.rememberMeSection}>
					<Text style={styles.rememberMeText}>Keep Me Signed In</Text>
					<SwitchToggle
						switchOn={this.state.switchValue}
						onPress={this.toggleSwitch}
						circleColorOff="white"
						circleColorOn="white"
						backgroundColorOn="blue"
					/>
				</View>
				<View style={styles.signInButton}>
					<Button
						title="Sign In"
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
		width: '80%'
	},
	policyTextSection: {
		marginLeft: 45,
		marginBottom: 25
	},
	policyText: {
		color: 'black',
		fontSize: 15
	},
	policyLinks: {
		color: 'blue',
		fontSize: 15
	},
	rememberMeSection: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginLeft: 50,
		marginRight: 50,
		marginBottom: 20
	},
	rememberMeText: {
		flex: 1,
		fontSize: 20,
		color: 'black'
	},
	textField: {
		height: 60,
		borderColor: 'gray',
		borderWidth: 2,
		borderRadius: 10,
		marginBottom: 10,
		fontSize: 18
	},
	signInButton: {
		width: '80%',
		height: 60
	}
});