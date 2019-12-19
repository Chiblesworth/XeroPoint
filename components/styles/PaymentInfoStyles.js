import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        margin: 15,
    },
    row: {
        flexDirection: 'row',
        marginLeft: 10
    },
    text: {
        color: '#000',
        fontSize: 14,
        letterSpacing: 0.5
    },
    statusContainer: {
        marginTop: 55,
        marginBottom: 55,
        width: '30%',
        height: 35,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    statusText: {
        color: '#fff',
        fontSize: 16
    }
});