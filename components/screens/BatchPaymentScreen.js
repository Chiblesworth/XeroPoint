import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Header } from 'react-native-elements';
//Components
import HeaderIcon from '../HeaderIcon';

export default class BatchPaymentScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            batchPayments: this.props.navigation.state.params.batchPayments
        };

        this.handleHeaderIconPress = this.handleHeaderIconPress.bind(this);
    }

    componentDidMount() {
        console.log("In batch payments screen")
        console.log(this.state.batchPayments)
    }

    handleHeaderIconPress() {
        this.props.navigation.navigate("History");
    }

    render() {
        return (
            <View>
                <Header
                    leftComponent={
                        <HeaderIcon
                            name="chevron-left"
                            type="entypo"
                            size={60}
                            handlePress={this.handleHeaderIconPress}
                        />
                    }
                    centerComponent={
                        <Text style={styles.headerText}>Payments</Text>
                    }
                    backgroundColor="#808080"
                    containerStyle={{ borderBottomWidth: 0 }}
                />
                <View style={styles.payment}>
                    <View style={styles.row}>
                        <Text>Hello</Text>
                        <Text>Hello</Text>
                    </View>
                </View>
            </View>
        );
    }
}

//Styles
const styles = StyleSheet.create({
    headerText: {
        fontSize: 25,
        color: 'white',
        paddingBottom: 30
    },
    payment: {
        borderWidth: 1,
        borderColor: 'black',
    },
    row: {
        margin: 10,
        width: '100%',
        flexDirection: 'row',
    }
})