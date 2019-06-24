
import React, { Component } from 'react';
import { createDrawerNavigator, createAppContainer } from 'react-navigation';
import LoginScreen from './components/LoginScreen';
import MainScreen from './components/MainScreen';
import PaymentScreen from './components/PaymentScreen';
import SettingScreen from './components/SettingScreen';
import { Icon } from 'react-native-elements';

/*
	Helpful links how I set up navigation
	https://facebook.github.io/react-native/docs/navigation
	https://reactnavigation.org/docs/en/hello-react-navigation.html
*/
const AppNavigator = createDrawerNavigator(
	{
		Login: {
			screen: LoginScreen,
			navigationOptions: {
				header: null,
				drawerLabel: () => null,
			}
		},
		Main: {
			screen: MainScreen,
			navigationOptions: {
				header: null,
			}
		},
		Payment: {
			screen: PaymentScreen,
			navigationOptions: {
				header: null,
				drawerLabel: () => null
			}
		},
		Settings: {
			screen: SettingScreen,
			navigationOptions: {
				header: null,
				drawerIcon: (
					<Icon 
						name="settings"
						type="feather"
						color="white"
						size={25}
					/>
				)
			}
		}
	},
	{
		drawerBackgroundColor: '#808080',
		contentOptions: {
			labelStyle: {
				fontSize: 25,
				color: 'white'
			}
		}		 
	}
);

export default createAppContainer(AppNavigator);
