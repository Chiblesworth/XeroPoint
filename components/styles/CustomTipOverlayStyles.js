import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    headerRow: {
        flexDirection: 'row',
        marginBottom: '10%'
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        width: '100%',
        padding: '1%'
    },
    tipAdjustmentForm: {
        backgroundColor: '#fff',
        width: '100%',
        borderStyle: 'solid',
        borderColor: '#fff',
        borderRadius: 10,
    },
    text: {
        fontSize: 20,
    },
    amount: {
        fontSize: 20,
        marginRight: '48%'      
    },
    buttonContainer: {
        width: '28%',
        height: '10%'
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
        margin: '2%'
    },
    inputContainer: {
        width: 178,
        marginRight: '10%'
    },
    inputStyle: {
        fontSize: 20,
        paddingTop: 0,
        color: '#454343'
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