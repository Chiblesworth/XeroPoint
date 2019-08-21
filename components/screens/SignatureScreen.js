import React, { Component } from 'react';
import { View, Text, StyleSheet} from 'react-native';
import { Button } from 'react-native-elements';
import { StackActions, NavigationActions } from 'react-navigation';
import SignatureCapture from 'react-native-signature-capture';
//Components
import CollectTip from '../CollectTip';
import CustomTipOverlay from '../overlays/CustomTipOverlay';
//Helpers
import { defaultTips } from '../../helperMethods/defaultTips';
import { getCustomTipsArray } from '../../helperMethods/customTips';
import { storageGet } from '../../helperMethods/localStorage';
import { stringToBoolean } from '../../helperMethods/stringToBoolean';


defaultTips.push("Other");

const resetAction = StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({ routeName: 'Main' })],
}); //Reset stack if payment is cancelled

export default class SignatureScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            orientation: "landscape", //Switch when closing the Overlay
            tipArray: [], //Will be either defaultTips or customTips
        };

        this.test = this.test.bind(this);
    }

    async componentWillMount() {
        let selectedDefaultTip = await storageGet("selectedDefaultTip");
        let useCustomTips = await storageGet("useCustomTips");
        let customTipsBool = await stringToBoolean(useCustomTips);

        if(customTipsBool){
            let customTipArray = await getCustomTipsArray();
            this.setState({tipArray: [...customTipArray]}, () => {
                console.log("In state now");
                console.log(this.state.tipArray);
            });
        }
        else{
            this.setState({tipArray: [...defaultTips]}, () => {
                console.log("In state now");
                console.log(this.state.tipArray);
            });
        }
    }

    componentDidMount() {
        //this.test();
    }

    test() {
        //console.log(this.state.tipArray)
    }

    render() {
        return (
            <View style={styles.container}>
                <CollectTip
                    tipArray={this.state.tipArray}
                />
                <View style={styles.signatureContainer}>
                    <SignatureCapture
                        style={styles.signature}
                        ref="sign"
                        saveImageFileInExtStorage={false}
                        showNativeButtons={false}
                        showTitleLabel={true}
                        viewMode={this.state.orientation}
                    />
                </View>
                <View style={styles.textSection}>
                    <Text style={styles.text}>Please sign your signature above.</Text>
                </View> 
                <View style={styles.lowerSection}>
                    <View style={styles.row}>
                        <Button
                            title="Cancel"
                            //onPress={() => this.handleCancelPress()}
                            borderRadius={25}
                            containerStyle={styles.buttonContainer}
                            buttonStyle={[styles.buttonStyle, {backgroundColor: 'red'}]}
                            titleStyle={styles.titleStyle}
                        />
                        <View style={styles.spacer}></View>
                        <Button
                            title="Continue"
                            //onPress={() => this.handleContinuePress()}
                            borderRadius={25}
                            containerStyle={styles.buttonContainer}
                            buttonStyle={styles.buttonStyle}
                            titleStyle={styles.titleStyle}
                        />
                    </View>
                </View>
                <CustomTipOverlay 
                />
            </View>
        );
    }
}

//Styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        marginTop: 25
    },
    row: {
        flex: 1,
        flexDirection: 'row',
        marginBottom: 40
    },
    totalContainer: {
        flexDirection: 'column'
    },
    signatureContainer: {
        flex: 1,
        borderBottomWidth: 3,
        borderBottomColor: 'black'
    },
    signature: {
        flex: 1
    },
    totalContainer: {
        flexDirection: 'column'
    },
    textSection: {
        alignItems: 'center'
    },
    text: {
        fontSize: 25
    },
    lowerSection: {
        backgroundColor: '#808080',
        height: 120,
        alignItems: 'center'
    },
    spacer: {
        marginLeft: 50,
        marginRight: 50
    },
    buttonContainer: {
        marginTop: 30,
        height: 60,
        width: 150,
        borderRadius: 25
    },
    buttonStyle: {
        height: 60,
        width: 150,
        borderRadius: 25
    },
    titleStyle: {
        fontSize: 25
    }
});