import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    subTitle: {
        fontSize: 25,
        color: '#fff',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'center',
        padding: '2%'
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
        height: '100%',
    },
    editButton: {
        backgroundColor: '#FFC502'
    },
    saveButton: {
        backgroundColor: '#7CFC00'
    },
    buttonTitle: {
        fontSize: 30,
        paddingRight: '5%',
        color: '#000'
    },
    inputContainer: {
        width: '30%',
        height: 80,
    },
    input: {
        fontSize: 50,
        color: '#fff'
    },
    switch: {
        alignItems: 'flex-end',
        marginRight: '2%',
    },
});