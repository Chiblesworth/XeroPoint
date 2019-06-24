import React, { Component } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Header, Input, Button } from 'react-native-elements';
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
                                size={70}
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
                <ScrollView contentContainerStyle={styles.scrollView}>
                    <Input 
                        placeholder="1234 5678 9012 3..."
                        placeholderTextColor="gray"
                        leftIcon={{type: 'entypo', name: 'credit-card', size: 25, color: 'gray'}}
                        inputContainerStyle={styles.inputContainer}
                        inputStyle={styles.input}
                        keyboardType="numeric"
                    />
                    <Button 
                        type="solid"
                        title="Charge"
                        containerStyle={styles.buttonContainer}
                        titleStyle={styles.buttonTitle}
                    />
                    <Button 
                        type="solid"
                        title="Connect Card Reader"
                        containerStyle={styles.buttonContainer}
                        buttonStyle={styles.button}
                        titleStyle={styles.buttonTitle}
                    />
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
    container: {
		justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#808080'
    },
    mainScreenTextSection: {
        marginBottom: 15,
        alignItems: 'center',
    },
    simpleText: {
        fontSize: 30,
        color: 'white'
    },
    amountText: {
        fontSize: 70,
        color: 'white'
    },
    scrollView: {
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 25,
        marginRight: 25
    },
    inputContainer: {
        marginBottom: 20,
        borderStyle: 'solid',
        borderColor: 'black',
        borderRadius: 25,
        backgroundColor: 'white'  
    },
    input: {
        paddingLeft: 20
    },
    buttonContainer: {
        width: '92%',
        height: 40,
        marginBottom: 20,
        backgroundColor: '#D3D3D3'
    },
    button: {
        backgroundColor: '#D3D3D3'
    },
    buttonTitle: {
        fontSize: 25
    },
});