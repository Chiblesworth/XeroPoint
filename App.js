
import React from 'react';
import {
	createDrawerNavigator,
	createStackNavigator,
	createAppContainer,
	SafeAreaView,
	DrawerItems,
	NavigationActions,
	StackActions,
} from 'react-navigation';
import { Button, Icon } from 'react-native-elements';
import { View, StyleSheet, Image } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import LoginScreen from './components/screens/LoginScreen';
import MainScreen from './components/screens/MainScreen';
import PaymentScreen from './components/screens/PaymentScreen';
import SettingScreen from './components/screens/SettingScreen';
import FeesScreen from './components/screens/FeesScreen';
import TipsScreen from './components/screens/TipsScreen';
import SignatureScreen from './components/screens/SignatureScreen';
import ReceiptScreen from './components/screens/ReceiptScreen';
import HistoryScreen from './components/screens/HistoryScreen';
import BatchPaymentScreen from './components/screens/BatchPaymentScreen';
import ViewReceiptScreen from './components/screens/ViewReceiptScreen';
import SupportScreen from './components/screens/SupportScreen';
import AdvancedSettingScreen from './components/screens/AdvancedSettingScreen';
import CardReaderScreen from './components/screens/CardReaderScreen';
import LocationScreen from './components/screens/LocationScreen';

/*
	Helpful links how I set up navigation
	https://facebook.github.io/react-native/docs/navigation
	https://reactnavigation.org/docs/en/hello-react-navigation.html
	Implements both stack and drawer navigation.
	Stack for main screens, drawer for settings etc.
*/

const MainStack = createStackNavigator(
	{
		Main: {screen: MainScreen, navigationOptions: {header: null}},
		Payment: {screen: PaymentScreen, navigationOptions: {header: null}},
		Signature: {screen: SignatureScreen, navigationOptions: {header: null}},
		Receipt: {screen: ReceiptScreen, navigationOptions: {header: null}}
	},
);

const HistoryStack = createStackNavigator(
	{
		History: {screen: HistoryScreen, navigationOptions: {header: null}},
		BatchPayments: {screen: BatchPaymentScreen, navigationOptions: {header: null}},
		ViewReceipt: {screen: ViewReceiptScreen, navigationOptions: {header: null}}
	}
);

const SettingStack = createStackNavigator(
	{
		Settings: {screen: SettingScreen, navigationOptions: {header: null}},
		Fees: {screen: FeesScreen, navigationOptions: {header: null}},
		Tips: {screen: TipsScreen, navigationOptions: {header: null}},
		Advanced: {screen: AdvancedSettingScreen, navigationOptions: {header: null}},
		CardReader: {screen: CardReaderScreen, navigationOptions: {header: null}},
		Location: {screen: LocationScreen, navigationOptions: {header: null}}
	}
);

const SupportStack = createStackNavigator(
	{
		Support: {screen: SupportScreen, navigationOptions: {header: null}}
	}
);

const DrawerStack = createDrawerNavigator(
	{
		Main: {screen: MainStack, navigationOptions: {drawerLabel: () => null}},
		History: {
			screen: HistoryStack,
			navigationOptions: {drawerIcon: (<Icon name="computer" type="material" color="#fff" size={25}/>)}
		},
		Settings: {
			screen: SettingStack,
			navigationOptions: {drawerIcon: (<Icon name="settings" type="feather" color="#fff" size={25}/>)}
		},
		Support: {
			screen: SupportStack,
			navigationOptions: {drawerIcon: (<Icon name="person" type="material" color="#fff" size={25} />)}
		}
	},
	{
		navigationOptions: {
			header: null
		},
		drawerBackgroundColor: '#2D2D2D',
		drawerType: "back",
		contentOptions: {
			labelStyle: {
				fontSize: 22,
				color: '#fff'
			}
		},
		contentComponent: (props) => {
			return (<View>
				<SafeAreaView forceInset={{top: 'always', horizontal: 'never'}}>
					<DrawerItems {...props} />
					<Button
						icon={<Icon name="power" type="feather" color="#fff" size={25}/>}
						type="solid"
						title="Sign Out"
						onPress={() => signOut(props)}
						buttonStyle={styles.button}
						titleStyle={styles.buttonTitle}
					/>
					<View style={{marginBottom: '45%'}} />
					<View style={styles.drawerLogo}>
						<Image
							source={require("./images/logo.png")}
							transform={[{scale: 0.4}]}
						/>
					</View>
				</SafeAreaView>
			</View>)
		}
	},
);

const DrawerNavigation = createStackNavigator({
	DrawerStack: {
		screen: DrawerStack
	},
});

const PrimaryNavigation = createStackNavigator({
	Login: {
		screen: LoginScreen,
		navigationOptions: {
			header: null
		}
	}, 
	DrawerStack: {
		screen: DrawerNavigation,
		navigationOptions: {
			header: null
		}
	},
	
});

const signOut = (props) => {
	//Where the idea came from
	//https://stackoverflow.com/questions/43090884/resetting-the-navigation-stack-for-the-home-screen-react-navigation-and-react-n
	//Delete saved token and use storage get/set
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

export default createAppContainer(PrimaryNavigation);

//Styles for drawer signOut button
const styles = StyleSheet.create({
	button: {
		backgroundColor: '#2D2D2D',
		marginRight: 100
	},
	buttonTitle: {
		fontSize: 22,
		color: 'white',
		marginLeft: 30
	}, 
	drawerLogo: {
		marginLeft: '-48%'
	}
})