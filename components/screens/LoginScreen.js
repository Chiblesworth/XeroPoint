import React, { Component } from 'react';
import { View, Text, Linking, Image} from "react-native";
import { Input, Button } from 'react-native-elements';
import SwitchToggle from 'react-native-switch-toggle';
import base64 from 'react-native-base64';
import Orientation from 'react-native-orientation';

import { storageGet, storageSet } from '../../helpers/localStorage';
import { showAlert } from '../../helpers/showAlert';

import { authenticate } from '../../api_requests/authenticate';

import { styles } from '../styles/LoginStyles';



export default class LoginScreen extends Component {
	constructor(props){
		super(props);

		this.state = {
			switchValue: false,
			encodedUsername: null,
			encodedPassword: null
		};
	}

	async componentWillMount() {
		Orientation.lockToPortrait();
		let stayLoggedIn = await storageGet("stayLoggedIn");
		
		if(stayLoggedIn === "True"){
			this.props.navigation.navigate("Main");
		}
	}

	toggleSwitch = () => {
		this.setState({switchValue: !this.state.switchValue});
	}

	encodeString = (text, inputField) => {
		(inputField === "Username") 
		? this.setState({encodedUsername: base64.encode(text)})
		: this.setState({encodedPassword: base64.encode(text)});
	}

	signIn = async () => {
		let encodedString = base64.encode(base64.decode(this.state.encodedUsername) + 
			":" + base64.decode(this.state.encodedPassword));

		let headers = {
			'Authorization' : 'Basic ' + encodedString,
			'Content-Type' : 'application/json; charset=utf-8'
		}

		let data = await authenticate(headers);

		if(data === 200){
			if(this.state.switchValue){
				storageSet("stayLoggedIn", "True");
			}
			storageSet("encodedUser", encodedString);
			storageSet("username", base64.decode(this.state.encodedUsername));
			this.props.navigation.navigate("Main")
		}
		else{
			showAlert("Validation Error", "There was an error in your request. Please try again.");
		}
	}

	render() {
		const {navigate} = this.props.navigation;

		return (
			<View style={styles.container}>
				<View style={styles.logo}>
					<Image
						source={require("../../images/logo.png")}
						transform={[{scale: 0.8}]}
					/>
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
						By signing up you accept the {" "}
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