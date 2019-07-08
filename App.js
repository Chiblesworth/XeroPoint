
import React from 'react';
import { createDrawerNavigator, 
		 createStackNavigator, 
		 createAppContainer, 
		 SafeAreaView, 
		 DrawerItems, 
		 NavigationActions, 
		 StackActions
		} from 'react-navigation';
import LoginScreen from './components/LoginScreen';
import MainScreen from './components/MainScreen';
import PaymentScreen from './components/PaymentScreen';
import SettingScreen from './components/SettingScreen';
import FeesScreen from './components/FeesScreen';
import { Button, Icon } from 'react-native-elements';
import { View, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';


/*
	Helpful links how I set up navigation
	https://facebook.github.io/react-native/docs/navigation
	https://reactnavigation.org/docs/en/hello-react-navigation.html
	Implements both stack and drawer navigation.
	Stack for main screens, drawer for settings etc.
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
		},
		contentComponent: (props) => (
			<View>
				<SafeAreaView forceInset={{top: 'always', horizontal: 'never'}}>
					<DrawerItems {...props} />
					<Button
						icon={
							<Icon 
								name="power"
								type="feather"
								color="white"
								size={25}
							/>
						}
						type="solid"
						title="Sign Out"
						onPress={() => signOut(props)}
						buttonStyle={styles.button}
						titleStyle={styles.buttonTitle} 
					/>
				</SafeAreaView>
			</View>
		)
	}
);

const signOut = (props) => {
	//Where the idea came from
	//https://stackoverflow.com/questions/43090884/resetting-the-navigation-stack-for-the-home-screen-react-navigation-and-react-n
	
	AsyncStorage.setItem("stayLoggedIn", "False").then(() => {
		props.navigation.dispatch(StackActions.reset({
			index: 0,
			key: null,
			actions: [
				NavigationActions.navigate({routeName: 'Login'})
			]
		}))
	})
}
export default createAppContainer(DrawerNavigation);

//Styles for drawer signOut button
const styles = StyleSheet.create({
	button: {
		backgroundColor: '#808080',
		marginRight: 100
	},
	buttonTitle: {
		fontSize: 25,
		color: 'white',
		marginLeft: 30
	}
})