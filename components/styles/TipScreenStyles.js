import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    mainContainer: {
        height: '100%',
        backgroundColor: '#454343'
    },
    container: {
        borderBottomColor: '#fff',
        borderBottomWidth: 2,
        marginBottom: '5%',
        width: '100%'
    },
    row: {
        flexDirection: 'row',
        width: '100%',
    },
    text: {
        fontSize: 18,
        color: '#fff',
        margin: '2%'
    },
    textContainer: {
        flex: 1,
    },
    switch: {
        alignItems: 'flex-end',
        margin: '3%'
    },
    segmentedSection: {
        margin: '3%'
    },
    tabsContainerStyle: {
        height: 70,
        borderColor: '#fff'
    },
    tabStyle: {
        backgroundColor: '#454343',
        borderColor: '#fff'
    },
    tabTextStyle: {
        fontSize: 20,
        color: '#fff'
    },
    activeTabStyle: {
        backgroundColor: '#fff'
    },
    activeTabTextStyle: {
        color: '#000'
    },
    buttonContainer: {
        width: '92%',
        height: 40,
        marginBottom: 25,
        marginLeft: 15
    },
    button: {
        backgroundColor: '#C8C8C8'
    },
    buttonTitle: {
        fontSize: 25
    },
});