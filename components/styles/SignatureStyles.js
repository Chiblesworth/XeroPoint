import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
    },
    row: {
        flexDirection: 'row',
    },
    collectTipContainer: {
        backgroundColor: '#454343',
    },
    totalContainer: {
        flexDirection: 'column'
    },
    signatureContainer: {
        flex: 1,
        borderBottomWidth: 3,
        borderBottomColor: '#000',
    },
    signature: {
        height: '80%',
        width: '100%'
    },
    totalContainer: {
        flexDirection: 'column'
    },
    textSection: {
        alignItems: 'center'
    },
    text: {
        fontSize: 25
    },
    lowerSection: {
        backgroundColor: '#454343',
        height: '35%',
        alignItems: 'center'
    },
    spacer: {
        marginLeft: '20%',
        marginRight: '20%'
    },
    buttonContainer: {
        margin: '5%',
        width: '20%',
        borderRadius: 15
    },
    titleStyle: {
        fontSize: 25
    }
});