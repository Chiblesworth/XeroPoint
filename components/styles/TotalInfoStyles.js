import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        margin: 15,
        marginRight: 20,
        alignItems: 'flex-end',
    },
    row: {
        justifyContent: 'space-around',
        flexDirection: 'row',
        padding: '2%'
    },
    text: {
        fontSize: 18,
        color: '#000',
        letterSpacing: 0.5
    },
    additionBar: {
        borderBottomWidth: 1,
        borderColor: '#000',
        width: '50%'
    }
});