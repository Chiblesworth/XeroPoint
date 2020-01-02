import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    subTitle: {
        fontSize: 25,
        color: '#fff',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'center'
    },
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    feeText: {
        fontSize: 50,
        color: '#fff'
    },
    buttonContainer: {
        width: '50%',
        height: 75,
    },
    editButton: {
        backgroundColor: '#FFC502'
    },
    saveButton: {
        backgroundColor: '#7CFC00'
    },
    buttonTitle: {
        fontSize: 30,
        paddingRight: 15,
        color: '#000'
    },
    inputContainer: {
        width: '30%',
        height: 80,
        paddingTop: -10
    },
    input: {
        fontSize: 50,
        color: '#fff'
    },
    switch: {
        alignItems: 'flex-end',
        marginRight: 10,
        marginBottom: 20
    },
});