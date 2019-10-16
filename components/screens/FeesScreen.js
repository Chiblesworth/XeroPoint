import React, { Component } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
//Components
import CustomHeader from '../CustomHeader';
import FeeDisplay from '../FeeDisplay';
//Helper Methods
import { storageGet, storageSet } from '../../helperMethods/localStorage';
import { stringToBoolean } from '../../helperMethods/stringToBoolean';

export default class FeeScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            serviceFee: "0",
            tax: "0",
            collectServiceFee: false,
            collectTaxFee: false
        };

        this.handleHeaderIconPress = this.handleHeaderIconPress.bind(this);
        this.handleServiceFeeChange = this.handleServiceFeeChange.bind(this);
        this.handleTaxFeeChange = this.handleTaxFeeChange.bind(this);
        this.handleSwitchPress = this.handleSwitchPress.bind(this);
    }

    async componentWillMount() {
        let collectServiceFee = await storageGet("collectServiceFee");
        let collectTaxFee = await storageGet("collectTaxFee");
        let serviceFee = await storageGet("serviceFee");
        let taxFee = await storageGet("taxFee");

        collectServiceFee = await stringToBoolean(collectServiceFee);
        collectTaxFee = await stringToBoolean(collectTaxFee);

        this.setState({
            collectServiceFee: collectServiceFee,
            collectTaxFee: collectTaxFee,
            serviceFee: serviceFee,
            tax: taxFee
        });
    }

    handleHeaderIconPress() {
        this.props.navigation.navigate("Settings");
    }

    handleServiceFeeChange(newFee) {
        storageSet("serviceFee", newFee);
        this.setState({ serviceFee: newFee });
    }

    handleTaxFeeChange(newFee) {
        storageSet("taxFee", newFee);
        this.setState({ tax: newFee });
    }

    handleSwitchPress(switchHit) {
        if (switchHit === "Service Fee") {
            this.setState({ collectServiceFee: !this.state.collectServiceFee }, () => {
                storageSet("collectServiceFee", this.state.collectServiceFee.toString());
            });
        }
        else {
            this.setState({ collectTaxFee: !this.state.collectTaxFee }, () => {
                storageSet("collectTaxFee", this.state.collectTaxFee.toString());
            });
        }
    }

    render() {
        return (
            <View style={styles.mainContainer}>
                <View stlye={styles.header}>
                    <CustomHeader
                        iconName="chevron-left"
                        type="entypo"
                        title="Additional Fees"
                        handlePress={this.handleHeaderIconPress}
                        backgroundColor="#656565"
                    />
                </View>
                <View style={{ paddingTop: 10 }} />
                {/* Wrapped this a ScrollView so the keyboard doesn't cover input areas. */}
                <ScrollView>
                    <View>
                        <FeeDisplay
                            mainTitle="Service Fee"
                            feeAmount={this.state.serviceFee}
                            handleFeeChange={this.handleServiceFeeChange}
                            swtichPress={this.handleSwitchPress}
                            switchValue={this.state.collectServiceFee}
                        />
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.extraPadding}>
                        <FeeDisplay
                            mainTitle="Tax Fee"
                            feeAmount={this.state.tax}
                            handleFeeChange={this.handleTaxFeeChange}
                            swtichPress={this.handleSwitchPress}
                            switchValue={this.state.collectTaxFee}
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
        backgroundColor: '#454343'
    },
    header: {
        width: '100%',
        height: 70
    },
    headerText: {
        fontSize: 30,
        color: 'white',
        paddingBottom: 30
    },
    divider: {
        marginTop: 20,
        borderBottomColor: 'white',
        borderBottomWidth: 4
    },
    extraPadding: {
        marginTop: 20
    }
});