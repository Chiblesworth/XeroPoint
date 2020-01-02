import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        marginBottom: 25,
    },
    totalContainer: {
        flexDirection: 'column',
        marginLeft: 10,
        marginRight: 10
    },
    text: {
        fontSize: 25
    },
    tabsContainerStyle: {
        flex: 1,
        borderColor: '#454343'
    },
    tabStyle: {
        backgroundColor: '#fff',
        borderColor: '#000'
    },
    tabTextStyle: {
        fontSize: 18,
        color: '#000'
    },
    activeTabStyle: {
        backgroundColor: '#454343'
    },
    activeTabTextStyle: {
        color: '#fff'
    },
});