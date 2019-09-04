import React, { Component } from 'react';
import { View } from 'react-native';
//Components
import NumberPadRow from './NumberPadRow';

export default class NumberPad extends Component {
	constructor(props) {
    	super(props);
	}

  	render() {
		return (
    		<View>
        		<NumberPadRow handlePress={this.props.handlePress} rowNumbers={["1","2","3"]}/>
				<NumberPadRow handlePress={this.props.handlePress} rowNumbers={["4","5","6"]}/>
				<NumberPadRow handlePress={this.props.handlePress} rowNumbers={["7","8","9"]}/>
				<NumberPadRow handlePress={this.props.handlePress} rowNumbers={["refund","0","delete"]}/>
      		</View>
		);
	}
}
