
import React, { Component } from 'react';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import LoginScreen from './components/LoginScreen';
import MainScreen from './components/MainScreen';
import PaymentScreen from './components/PaymentScreen';

/*
	Helpful links how I set up navigation
	https://facebook.github.io/react-native/docs/navigation
	https://reactnavigation.org/docs/en/hello-react-navigation.html
*/
const AppNavigator = createStackNavigator({
	Login: {
		screen: LoginScreen,
		navigationOptions: {
			header: null,
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
		}
	}

});

export default createAppContainer(AppNavigator);
