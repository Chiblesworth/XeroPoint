import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 25,
        marginBottom: 25
    },
    text: {
        fontSize: 20,
        marginBottom: 25
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    inputContainer: {
        width: 55,
        height: 40,
    },
    inputContainerStyle: {
        paddingTop: 15
    },
    tipHeader: {
        marginRight: 30,
        marginTop: 15,
        fontSize: 20,
    },
    percentSign: {
        marginTop: 10,
        fontSize: 27
    },
    //Two button containers here because it was the only way I was able to add space between the two buttons.
    //Could not get justifyContent: 'space-between' to work with the current set up.
    buttonContainer: {
        width: 100,
        height: 50,
        marginTop: 130,
        //marginRight: 40,
    },
    buttonContainer2: {
        width: 100,
        height: 50,
        marginTop: 130,
        marginLeft: 40,
    },
    buttonStyle: {
        width: 100,
        height: 50,
        backgroundColor: '#fff'
    }
});