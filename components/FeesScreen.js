import React, { Component } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Header } from 'react-native-elements';
import HeaderIcon from './HeaderIcon';
import FeeDisplay from './FeeDisplay';
import { storageGet, storageSet } from './localStorage';

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

    async componentDidMount() {
        let serviceFee = await storageGet("serviceFee");
        let taxFee = await storageGet("taxFee");
        
        this.setState({ serviceFee: serviceFee, tax: taxFee});
    }

    handleHeaderIconPress() {
        this.props.navigation.navigate("Settings");
    }

    handleServiceFeeChange(newFee) {
        let key = "serviceFee";

        storageSet(key, newFee);
        this.setState({serviceFee: newFee});
    }

    handleTaxFeeChange(newFee) {
        let key = "taxFee";
        
        storageSet(key, newFee);
        this.setState({tax: newFee});
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
                {/* Wrapped this a ScrollView so the keyboard doesn't cover input areas. */}
                <ScrollView>
                    <View>
                        <FeeDisplay
                            mainTitle="Service Fee" 
                            feeAmount={this.state.serviceFee}
                            handleFeeChange={this.handleServiceFeeChange}
                        />
                    </View>
                    <View style={styles.divider}/>
                        <View style={styles.extraPadding}>
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
        marginTop: 20,
        borderBottomColor: 'white',
        borderBottomWidth: 8
    },
    extraPadding: {
        marginTop: 20
    }
});