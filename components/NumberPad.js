import React, { Component } from 'react';
import { View, Text } from 'react-native';
import NumberPadRow from './NumberPadRow';

export default class NumberPad extends Component {
	constructor(props) {
    	super(props);
		
		this.state = {
    	};
	}

  	render() {
		return (
    		<View>
        		<NumberPadRow rowNumbers={["1","2","3"]}/>
				<NumberPadRow rowNumbers={["4","5","6"]}/>
				<NumberPadRow rowNumbers={["7","8","9"]}/>
      		</View>
		);
	}
}
