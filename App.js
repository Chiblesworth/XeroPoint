
import React, { Component } from 'react';
import { createDrawerNavigator, createStackNavigator, createAppContainer } from 'react-navigation';
import LoginScreen from './components/LoginScreen';
import MainScreen from './components/MainScreen';
import PaymentScreen from './components/PaymentScreen';
import SettingScreen from './components/SettingScreen';
import FeesScreen from './components/FeesScreen';
import { Icon } from 'react-native-elements';

/*
	Helpful links how I set up navigation
	https://facebook.github.io/react-native/docs/navigation
	https://reactnavigation.org/docs/en/hello-react-navigation.html
*/

const StackNavigator = createStackNavigator(
	{
		Login: {
			screen: LoginScreen,
			navigationOptions: {
				header: null
			}
		},
		Main: {
			screen: MainScreen,
			navigationOptions: {
				header: null
			}
		},
		Payment: {
			screen: PaymentScreen,
			navigationOptions: {
				header: null
			}
		}
	}
);

const DrawerNavigation = createDrawerNavigator(
	{
		Main: {
			screen: StackNavigator
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
		},
		Fees: {
			screen: FeesScreen,
			navigationOptions: {
				header: null,
				drawerLabel: () => null
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

export default createAppContainer(DrawerNavigation);
