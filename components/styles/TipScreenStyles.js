import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    mainContainer: {
        height: '100%',
        backgroundColor: '#454343'
    },
    container: {
        borderBottomColor: '#fff',
        borderBottomWidth: 2,
        marginBottom: 20,
        width: '100%'
    },
    row: {
        flex: 1,
        flexDirection: 'row',
        width: '100%',
        marginBottom: 10,
    },
    text: {
        fontSize: 18,
        color: '#fff',
        paddingRight: 10,
        marginLeft: 10,
        marginBottom: 20
    },
    textContainer: {
        flex: 1,
    },
    switch: {
        alignItems: 'flex-end',
        marginRight: 10,
        marginBottom: 20
    },
    segmentedSection: {
        marginBottom: 20,
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