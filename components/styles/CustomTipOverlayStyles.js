import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    headerRow: {
        flexDirection: 'row',
        marginBottom: 20
    },
    row: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        width: '100%'
    },
    column: {
        flexDirection: 'column'
    },
    tipAdjustmentForm: {
        backgroundColor: '#fff',
        width: '100%',
        borderStyle: 'solid',
        borderColor: '#fff',
        borderRadius: 15,
    },
    text: {
        fontSize: 20,
        marginBottom: 10
    },
    dollarSign: {
        fontSize: 20,
        paddingLeft: 40,
        marginBottom: 10
    },
    amount: {
        fontSize: 20,
        paddingLeft: 20,
        marginBottom: 10
    },
    buttonContainer: {
        width: 100,
        height: 50
    },
    buttonStyle: {
        backgroundColor: '#454343'
    },
    applyButtonStyle: {
        backgroundColor: '#fff'
    },
    headerText: {
        color: '#fff',
        fontSize: 25,
        marginTop: 8,
        marginLeft: 25
    },
    inputContainer: {
        width: 170,
    },
    input: {
        borderBottomWidth: 0,
    },
    inputStyle: {
        fontSize: 20,
        paddingTop: 0,
        color: 'grey'
    },
    divider: {
        backgroundColor: '#000',
        height: 2,
        width: '100%'
    },
    applySection: {
        alignItems: 'center'
    },
    disabledButton: {
        backgroundColor: '#fff'
    },
});