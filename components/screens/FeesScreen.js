import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';

import CustomHeader from '../CustomHeader';
import FeeDisplay from '../FeeDisplay';

import { storageGet, storageSet } from '../../helpers/localStorage';

import { styles } from '../styles/FeeStyles';

export default class FeeScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            serviceFee: "0",
            tax: "0",
            collectServiceFee: false,
            collectTaxFee: false
        };
    }

    async componentDidMount() {
        let collectServiceFee = await storageGet("collectServiceFee");
        let collectTaxFee = await storageGet("collectTaxFee");
        let serviceFee = await storageGet("serviceFee");
        let taxFee = await storageGet("taxFee");


        collectServiceFee = JSON.parse(collectServiceFee);
        collectTaxFee = JSON.parse(collectTaxFee);
        
        //Set defaults
        if(collectServiceFee === null){
            storageSet("collectServiceFee", true);
            collectServiceFee = true;
        }

        if(collectTaxFee === null){
            storageSet("collectTaxFee", false);
            collectTaxFee = false;
        }

        if(serviceFee === null){
            storageSet("serviceFee", 5);
            serviceFee = 5;
        }

        if(taxFee === null){
            storageSet("taxFee", 10);
            taxFee = 5;
        }

        this.setState({
            collectServiceFee: collectServiceFee,
            collectTaxFee: collectTaxFee,
            serviceFee: serviceFee,
            tax: taxFee
        });
    }

    handleHeaderIconPress = () => {
        this.props.navigation.pop();
    }

    handleServiceFeeChange = (newFee) => {
        this.setState({ serviceFee: newFee }, () => {
            storageSet("serviceFee", newFee);
        });
    }

    handleTaxFeeChange = (newFee) => {
        this.setState({ tax: newFee }, () => {
            storageSet("taxFee", newFee);
        });
    }

    handleSwitchPress = (switchHit) => {
        (switchHit === "Service Fee")
            ? this.setState({ collectServiceFee: !this.state.collectServiceFee }, () => {
                storageSet("collectServiceFee", this.state.collectServiceFee.toString());
            })
            : this.setState({ collectTaxFee: !this.state.collectTaxFee }, () => {
                storageSet("collectTaxFee", this.state.collectTaxFee.toString());
            });
    }

    render() {
        return (
            <View style={styles.mainContainer}>
                <CustomHeader
                    iconName="chevron-left"
                    type="entypo"
                    title="Additional Fees"
                    handlePress={this.handleHeaderIconPress}
                    backgroundColor="#656565"
                />
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