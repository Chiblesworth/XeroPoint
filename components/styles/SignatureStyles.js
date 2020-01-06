import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        marginTop: '2%'
    },
    row: {
        flexDirection: 'row',
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
        height: 25,
        width: '100%',
        backgroundColor: 'red'
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
        marginTop: 30,
        width: '20%',
        borderRadius: 15
    },
    titleStyle: {
        fontSize: 25
    }
});