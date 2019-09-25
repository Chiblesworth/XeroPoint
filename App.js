
import React from 'react';
import {
	createDrawerNavigator,
	createStackNavigator,
	createAppContainer,
	SafeAreaView,
	DrawerItems,
	NavigationActions,
	StackActions
} from 'react-navigation';
import { Button, Icon } from 'react-native-elements';
import { View, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import LoginScreen from './components/screens/LoginScreen';
import MainScreen from './components/screens/MainScreen';
import PaymentScreen from './components/screens/PaymentScreen';
import SettingScreen from './components/screens/SettingScreen';
import FeesScreen from './components/screens/FeesScreen';
import TipsScreen from './components/screens/TipsScreen';
import SearchCustomerScreen from './components/screens/SearchCustomerScreen';
import SignatureScreen from './components/screens/SignatureScreen';
import ReceiptScreen from './components/screens/ReceiptScreen';
import HistoryScreen from './components/screens/HistoryScreen';
import BatchPaymentScreen from './components/screens/BatchPaymentScreen';

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
		},
		SearchCustomer: {
			screen: SearchCustomerScreen,
			navigationOptions: {
				header: null
			}
		},
		Signature: {
			screen: SignatureScreen,
			navigationOptions: {
				header: null
			}
		},
		Receipt: {
			screen: ReceiptScreen,
			navigationOptions: {
				header: null
			}
		}
	}
);

const HistoryStackNav = createStackNavigator(
	{
		History: {
			screen: HistoryScreen,
			navigationOptions: {
				header: null
			}
		},
		BatchPayments: {
			screen: BatchPaymentScreen,
			navigationOptions: {
				header: null
			}
		},
	}
);

const DrawerNavigation = createDrawerNavigator(
	{
		Main: {
			screen: StackNavigator
		},
		History: {
			screen: HistoryStackNav,
			navigationOptions: {
				header: null,
				drawerIcon: (
					<Icon
						name="computer"
						type="material"
						color="white"
						size={25}
					/>
				)
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
		},
		Fees: {
			screen: FeesScreen,
			navigationOptions: {
				header: null,
				drawerLabel: () => null
			}
		},
		Tips: {
			screen: TipsScreen,
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
				fontSize: 22,
				color: 'white'
			}
		},
		contentComponent: (props) => (
			<View>
				<SafeAreaView forceInset={{ top: 'always', horizontal: 'never' }}>
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
				NavigationActions.navigate({ routeName: 'Login' })
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
		fontSize: 22,
		color: 'white',
		marginLeft: 30
	}
})