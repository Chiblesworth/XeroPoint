import React, { Component } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Header } from 'react-native-elements';
import HeaderIcon from './HeaderIcon';
import FeeDisplay from './FeeDisplay';
import AsyncStorage from '@react-native-community/async-storage';

export default class FeeScreen extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
            serviceFee: "0",
            tax: "0"
        };

        this.handleHeaderIconPress = this.handleHeaderIconPress.bind(this);
        this.handleServiceFeeChange = this.handleServiceFeeChange.bind(this);
        this.handleTaxFeeChange = this.handleTaxFeeChange.bind(this);
    }

    componentDidMount() {
        AsyncStorage.getItem("serviceFee").then((fee) => {
            this.setState({serviceFee: fee});
        });
        AsyncStorage.getItem("taxFee").then((fee) => {
            this.setState({tax: fee});
        });
    }

    handleHeaderIconPress() {
        this.props.navigation.navigate("Settings");
    }

    handleServiceFeeChange(newFee) {
        AsyncStorage.setItem("serviceFee", newFee).then(() => {
            this.setState({serviceFee: newFee});
        });
    }

    handleTaxFeeChange(newFee) {
        AsyncStorage.setItem("taxFee", newFee).then(() => {
            this.setState({tax: newFee});
        });
    }

    render() {
        return (
            <View style={styles.mainContainer}>
                <View stlye={styles.header}>
                    <Header 
                        leftComponent={
                            <HeaderIcon 
                                name="chevron-left"
                                type="entypo"
                                size={70}
                                handlePress={this.handleHeaderIconPress}
                            /> 
                        }
                        centerComponent={
                            <Text style={styles.headerText}>Additional Fees</Text>
                        }
                        backgroundColor='#808080'
                        containerStyle={{ borderBottomWidth: 0 }}
                    />
                </View>
                <ScrollView>
                    <View>
                        <FeeDisplay
                            mainTitle="Service Fee" 
                            feeAmount={this.state.serviceFee}
                            handleFeeChange={this.handleServiceFeeChange}
                        />
                    </View>
                    <View style={styles.divider}>
                        <FeeDisplay
                            mainTitle="Tax" 
                            feeAmount={this.state.tax}
                            handleFeeChange={this.handleTaxFeeChange}
                        />
                    </View>
                </ScrollView>
            </View>
        );
    }
}

//Styles
const styles = StyleSheet.create({
    mainContainer: {
        height: '100%',
        backgroundColor: '#808080'
    },
    header: {
        width: '100%',
        height: 70
    },
    headerText: {
        fontSize: 30,
        color: 'white',
        paddingBottom: 20
    },
    divider: {
        marginTop: 45
    }
});