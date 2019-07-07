import React, { Component } from 'react';
import { View, Text, Linking, StyleSheet } from "react-native";
import SwitchToggle from 'react-native-switch-toggle';
import { Input, Button } from 'react-native-elements';
import base64 from 'react-native-base64';
import utf8 from 'utf8';
import axios from 'axios';

export default class LoginScreen extends Component {
	constructor(props){
		super(props);

		this.state = {
			switchValue: false,
			username: "",
			password: ""
		};

		this.toggleSwitch = this.toggleSwitch.bind(this);
		this.encodeString = this.encodeString.bind(this);
		this.signIn = this.signIn.bind(this);
	}

	toggleSwitch() {
		this.setState({switchValue: !this.state.switchValue});
	}

	encodeString(text, inputField) {
		//let bytes = utf8.encode(text);
		//let encodedText = base64.encode(bytes);

		if(inputField === "Username"){
			this.setState({username: text})
		}
		else{
			this.setState({password: text})
		}
	}

	signIn() {
		console.log(this.state.username)
		console.log(this.state.password)
		axios.post('https://api.mxmerchant.com/checkout/v3/payment?echo=true', {}, {
			auth: {
				username: this.state.username,
				password: this.state.password
			}
		})
			.then((response) => {
				console.log(response);
				
			})
			.catch((error) => {
				console.log(error.response);
				console.log(error.request)
			})
	}

	render() {
		const {navigate} = this.props.navigation;

		return (
			<View style={styles.container}>
				<View style={styles.loginTextSection}>
					<Text>On LoginScreen</Text>
				</View>
				<View style={styles.loginFormSection}>
					<Input 
						placeholder="Username"
						placeholderTextColor="grey"
						inputContainerStyle={styles.inputContainer}
						inputStyle={styles.input}
						onChangeText={(text) => this.encodeString(text, "Username")}
					/>
					<Input 
						placeholder="Password"
						placeholderTextColor="grey"
						secureTextEntry={true}
						inputContainerStyle={styles.inputContainer}
						inputStyle={styles.input}
						onChangeText={(text) => this.encodeString(text, "Password")}
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
						type="solid"
						title="Sign In"
						onPress={this.signIn}
						containerStyle={styles.buttonContainer}
						titleStyle={styles.buttonTitle}
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
		alignItems: 'center',
		backgroundColor: '#808080'
	},
	loginTextSection: {
		marginBottom: 25,
	},
	loginFormSection: {
		width: '90%'
	},
	policyTextSection: {
		marginLeft: 38,
		marginRight: 15,
		marginBottom: 25
	},
	policyText: {
		color: 'white',
		fontSize: 17
	},
	policyLinks: {
		color: 'blue',
		fontSize: 17
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
		color: 'white'
	},
	inputContainer: {
		height: 60,
		width: '100%',
		borderColor: '#403D3D',
		borderWidth: 2,
		borderRadius: 10,
		marginBottom: 10,
		backgroundColor: '#403D3D'
	},
	input: {
		color: 'white'
	},
	signInButton: {
		width: '80%',
		height: 60
	},
	buttonContainer: {
		width: '100%',
		height: 60
	},
	buttonTitle: {
		fontSize: 20
	}
});