import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Header } from 'react-native-elements';
import HeaderIcon from './HeaderIcon';

export default class PaymentScreen extends Component {
    constructor(props){
        super(props);

        this.state = {
            amountCharged: this.props.navigation.state.params.amountCharged,
        }

        this.handleHeaderIconPress = this.handleHeaderIconPress.bind(this);
    }

    handleHeaderIconPress() {
        this.props.navigation.navigate("Main");
    }

    render(){
        return (
            <View style={styles.mainContainer}>
                <View stlye={styles.header}>
                    <Header 
                        leftComponent={
                            <HeaderIcon 
                                name="chevron-left"
                                type="entypo"
                                handlePress={this.handleHeaderIconPress}
                            /> 
                        }
                        backgroundColor='#808080'
                        containerStyle={{ borderBottomWidth: 0 }}
                    />
                </View>
                <View style={styles.container}>
                    <View style={styles.mainScreenTextSection}>
                        <Text style={styles.simpleText}>CHARGE AMOUNT</Text>
                        <Text style={styles.amountText}>
                            {this.state.amountCharged}
                        </Text>
                    </View>
                </View>
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
    container: {
		justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#808080'
    },
    mainScreenTextSection: {
        marginBottom: 15,
        alignItems: 'center',
        color: 'white'
    },
    simpleText: {
        fontSize: 30,
        color: 'white'
    },
    amountText: {
        fontSize: 70,
        color: 'white'
    }
});


{/* <HeaderIcon 
                            name="chevron-left"
                            type="entypo"
                            handlePress={this.handleHeaderIconPress}
                        />
                    </Header> */}