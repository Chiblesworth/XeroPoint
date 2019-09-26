import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Header } from 'react-native-elements';
//Components
import HeaderIcon from '../HeaderIcon';
import MerchantInfo from '../MerchantInfo';

export default class ViewReceiptScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            payment: this.props.navigation.state.params.payment
        };

        this.handleHeaderIconPress = this.handleHeaderIconPress.bind(this);
    }

    componentWillMount() {
        console.log(this.state.payment)
    }

    handleHeaderIconPress() {
        this.props.navigation.pop();
    }

    render() {
        let payment = this.props.navigation.state.params.payment; 
  
        return (
            <View style={{backgroundColor: '#ECE7E7', height: '100%'}}>
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
                        <Text style={styles.headerText}>#{payment.invoice}</Text>
                    }
                    backgroundColor="#808080"
                    containerStyle={{ borderBottomWidth: 0 }}
                />
                <View style={styles.receiptContainer}>
                    <MerchantInfo />
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
    receiptContainer: {
        backgroundColor: '#fff',
        height: '100%',
        margin: 20
    }
});
