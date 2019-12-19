import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    batchContainer: {
        borderColor: "#696969",
        borderWidth: 1,
        height: '100%'
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    text: {
        padding: 10,
        fontSize: 16,
        color: "#000"
    },
    batchInfoContainer: {
        borderRadius: 20,
        borderWidth: 2,
        borderColor: "#2E2B2B",
        width: '25%',
        height: 115,
        alignItems: 'center',
        justifyContent: 'space-evenly',
    },
    infoText: {
        padding: 10,
        borderRadius: 20
    },
});