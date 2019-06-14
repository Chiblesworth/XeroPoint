
import { React } from 'react';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import LoginScreen from './components/LoginScreen';

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
});

export default createAppContainer(AppNavigator);
