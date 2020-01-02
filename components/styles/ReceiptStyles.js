import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        height: '100%',
        backgroundColor: '#454343',
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 25,
        color: '#fff'
    },
    divider: {
        borderBottomColor: '#f2eee4',
        borderBottomWidth: 2,
        width: '80%',
        marginBottom: '8%'
    },
    titleStyle: {
        fontSize: 25
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        padding: '5%'
    },
    receiptButtonContainer: {
        width: '30%',
        height: '100%',
        margin: '10%'
    },
    receiptButtonStyle: {
        flexDirection: 'column',
    },
    receiptTitleStyle: {
        fontSize: 20
    },
    buttonContainer: {
        width: '60%'
    }
});