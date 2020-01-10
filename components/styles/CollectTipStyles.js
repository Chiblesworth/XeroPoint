import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        marginBottom: 20,
    },

    totalContainer: {
        flexDirection: 'column',
        marginLeft: '2%',
        marginRight: '2%'
    },
    text: {
        fontSize: 25,
        color: '#fff'
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
        backgroundColor: '#0080FF'        
    },
    activeTabTextStyle: {
        color: '#fff'
    },
});