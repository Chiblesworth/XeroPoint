import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    content: {
        width: '100%',
        height: '100%',
        backgroundColor: '#454343'
    },
    header: {
        height: '10%',
        width: '100%'
    },
    spacer: {
        marginBottom: '6%'
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%',
    },
    rowDivider: {
        marginLeft: '10%'
    },
    chargedContainer: {
        alignItems: 'center',
        marginBottom: 10
    },
    text: {
        fontSize: 30,
        color: 'white'
    },
    amountText: {
        fontSize: 70,
        color: 'white'
    },
    scrollView: {
        width: '100%',
        alignItems: 'center'
    },
    buttonContainer: {
        width: '80%',
        height: '5%'
    },
    button: {
        backgroundColor: '#C8C8C8'
    },
    buttonTitle: {
        fontSize: 16
    },
    textarea: {
        width: '80%',
        borderRadius: 15,
        backgroundColor: 'white',
        fontSize: 16
    },
    inputContainer: {
        width: '84%',
        marginLeft: '8%',
        borderRadius: 15,
        backgroundColor: 'white'
    },
    input: {
        fontSize: 16,
        paddingLeft: 20
    }
});