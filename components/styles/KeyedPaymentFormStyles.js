import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    form: {
        width: '100%',
        alignItems: 'center'
    },
    spacer: {
        marginBottom: '4%'
    },
    row: {
        flexDirection: 'row',
        width: '100%'
    },
    inputContainer: {
        width: '84%',
        borderRadius: 15,
        backgroundColor: '#fff'
    },
    input: {
        paddingLeft: 20,
        fontSize: 14
    },
    rowInputContainer: {
        width: '64%',
        marginLeft: '17%',
        borderRadius: 15,
        backgroundColor: '#fff'
    },
    zipAddressRowContainers: {
        width: "64%",
        marginLeft: '17%',
        borderRadius: 15,
        backgroundColor: '#fff'
    },
    zipAddressRowContainersOneUsed: {
        width: "84%",
        borderRadius: 15,
        backgroundColor: '#fff'
    },
    rowInputs: {
        paddingLeft: 10,
        fontSize: 16
    },
    cvvContainer: {
        borderRadius: 15,
        backgroundColor: '#fff',
        width: '25%',
        marginLeft: '5%'
    },
    cvvInput: {
        paddingLeft: 30,
        fontSize: 14
    },
    buttonContainer: {
        width: '80%',
    },
    buttonTitle: {
        fontSize: 16
    },
    errorText:{
       color: '#F00',
       marginLeft: '5%'
    }
});
