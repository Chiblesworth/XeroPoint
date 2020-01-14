import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    payment: {
        borderWidth: 1,
        borderColor: '#000',
    },
    row: {
        padding: '4%',
        width: '100%',
        flexDirection: 'row',
    }, 
    paymentText: {
        fontSize: 18
    },
    statusContainer: {
        alignItems: 'center',
        height: 25,
        borderRadius: 5
    },
    closeBatchContainer: {
        height: 100,
        width: '100%'
    },
    buttonContainer: {
        height: '10%',
        margin: '5%'
    },
    buttonTitle: {
        fontSize: 18
    },
    disabledButton: {
        backgroundColor: '#b3b2b1'
    },
    disabledTitle: {
        color: '#fff'
    }
});