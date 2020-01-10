import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#656565'
	},
	logo: {
		marginTop: '-30%',
		marginLeft: '5%'
	},
	loginFormSection: {
		width: '90%',
		marginTop: "-45%"
	},
	policyTextSection: {
		marginLeft: 38,
		marginRight: 15,
		marginBottom: 25
	},
	policyText: {
		color: '#fff',
		fontSize: 17
	},
	policyLinks: {
		color: '#0080FF',
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
		color: '#fff'
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
		color: '#fff'
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