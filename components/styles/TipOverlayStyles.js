import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 25,
        marginBottom: '10%'
    },
    text: {
        fontSize: 20,
        marginBottom: '10%'
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    inputContainer: {
        width: 55,
        height: 40,
    },
    inputContainerStyle: {
        paddingTop: '12%'
    },
    tipHeader: {
        margin: '8%',
        fontSize: 20,
    },
    percentSign: {
        marginTop: '5%',
        fontSize: 27
    },
    buttonContainer: {
        width: 100,
        height: 50,
        marginTop: '30%'
    },
    buttonStyle: {
        width: 100,
        height: 50,
        backgroundColor: '#fff'
    }
});