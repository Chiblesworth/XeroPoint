import React, { Component } from 'react';
import { View } from 'react-native';

import NumberPadRow from './NumberPadRow';

export default class NumberPad extends Component {
	constructor(props) {
    	super(props);
	}

  	render() {
		return (
    		<View>
        		<NumberPadRow handlePress={this.props.handlePress} rowNumbers={["1","2","3"]} isDisabled={this.props.isDisabled}/>
				<NumberPadRow handlePress={this.props.handlePress} rowNumbers={["4","5","6"]} isDisabled={this.props.isDisabled}/>
				<NumberPadRow handlePress={this.props.handlePress} rowNumbers={["7","8","9"]} isDisabled={this.props.isDisabled}/>
				<NumberPadRow handlePress={this.props.handlePress} rowNumbers={["refund","0","delete"]} isDisabled={this.props.isDisabled}/>
      		</View>
		);
	}
}
