import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        borderBottomWidth: 1,
        borderBottomColor: '#454343',
        width: '100%',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    text: {
        padding: 10,
        fontSize: 16,
        color: '#000'
    },
    statusContainer: {
        alignItems: 'center',
        height: 25,
        borderRadius: 5
    }
});