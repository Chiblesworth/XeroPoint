import React, { Component } from 'react';
import { View, Text, StyleSheet} from 'react-native';
import { Header, Overlay, Button, Input } from 'react-native-elements';

export default class TipOverlay extends Component {
    constructor(props) {
        super(props);

        this.state = {
        }

        this.newCustomTips = [];

        this.handleTipChange = this.handleTipChange.bind(this);
    }

    handleTipChange(tipAmount, index) {
        console.log("Tip amount " + tipAmount)
        console.log("index is " + index)
        this.newCustomTips[index] = tipAmount;
    }

    render() {
        const rows = [];

        for(let i = 0; i < this.props.customTips.length; i++){
            rows.push(
                <View key={i} style={styles.row}>
                            <View>
                                <Text style={styles.tipHeader}>Custom Tip {i + 1}:</Text>
                            </View>
                            <View>
                                <Input
                                    placeholder={this.props.customTips[i]}
                                    containerStyle={styles.inputContainer}
                                    inputContainerStyle={styles.inputContainerStyle}
                                    onChangeText={(text) => this.handleTipChange(text, i)}
                                />
                            </View>
                            <View>
                                <Text style={styles.percentSign}>%</Text>
                            </View>
                        </View>
            )
        }
        return (
            <Overlay
                isVisible={this.props.visible}
                onBackdropPress={() => this.props.handleClose()}
            >
                <View style={styles.container}>
                    <Text style={styles.title}>Adjust Tip Amounts</Text>
                    <Text style={styles.text}>Here you can set custom tip percentages</Text>
                    {/* <View style={styles.row}>
                        <View>
                            <Text style={styles.tipHeader}>Custom Tip 1:</Text>
                        </View>
                        <View>
                            <Input
                                placeholder={this.props.customTips[0]}
                                containerStyle={styles.inputContainer}
                                inputContainerStyle={styles.inputContainerStyle}
                                onChangeText={(text) => this.setState({newCustomTips: [...this.state.newCustomTips, text]})}
                            />
                        </View>
                        <View>
                            <Text style={styles.percentSign}>%</Text>
                        </View>
                    </View>
                    <View style={styles.row}>
                        <View>
                            <Text style={styles.tipHeader}>Custom Tip 2:</Text>
                        </View>
                        <View>
                            <Input
                                placeholder={this.props.customTips[1]}
                                containerStyle={styles.inputContainer}
                                inputContainerStyle={styles.inputContainerStyle}
                                onChangeText={(text) => this.setState({newCustomTips: [...this.state.newCustomTips, text]})}
                            />
                        </View>
                        <View>
                            <Text style={styles.percentSign}>%</Text>
                        </View>
                    </View> */}
                    {rows}
                    <Button 
                        onPress={() => console.log(this.newCustomTips)}
                    />
                </View>
            </Overlay>
        );
    }
}

//Styles
const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 25,
        marginBottom: 25
    },
    text: {
        fontSize: 20,
        marginBottom: 25
    },
    row: {
        flexDirection: 'row'
    },
    inputContainer: {
        width: 60,
        height: 50,
        borderColor: 'black',
        borderWidth: 4
    },
    inputContainerStyle: {
        paddingTop: 7
    },
    tipHeader: {
        marginRight: 30,
        marginTop: 15,
        fontSize: 20,
    },
    percentSign: {
        marginTop: 10,
        fontSize: 27
    },
});
