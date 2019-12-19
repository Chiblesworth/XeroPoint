import { StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    approvedData: {
        alignItems: 'flex-start',
        marginRight: '20%',
        marginBottom: '10%'
    },
    title: {
        fontSize: 25,
        marginBottom: 25
    },
    text: {
        fontSize: 18
    },
    row: {
        flexDirection: 'row'
    },
    iconContainer: {
        marginTop: 5,
        marginLeft: 15
    },
    icon: {
        color: 'green'
    },
    buttonContainer: {
        width: 100,
        height: 50,
    },
    buttonTitle: {
        fontSize: 20,
        color: '#fff'
    }
});
