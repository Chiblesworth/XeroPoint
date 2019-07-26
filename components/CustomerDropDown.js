import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import SearchableDropdown from 'react-native-searchable-dropdown';

var items = [
    {
      id: 1,
      name: 'JavaScript',
    },
    {
      id: 2,
      name: 'Java',
    },
    {
      id: 3,
      name: 'Ruby',
    },
    {
      id: 4,
      name: 'React Native',
    },
    {
      id: 5,
      name: 'PHP',
    },
    {
      id: 6,
      name: 'Python',
    },
    {
      id: 7,
      name: 'Go',
    },
    {
      id: 8,
      name: 'Swift',
    },
  ];
export default class CustomerDropDown extends Component {
    constructor(props) {
        super(props);
            this.state = {
                selectedItems: [

                ]
            }
    }

    render() {
        return (
            <View>
                {/* Single */}
                <SearchableDropdown
                    onItemSelect={(item) => {
                        const items = this.state.selectedItems;
                        items.push(item)
                        this.setState({ selectedItems: items });
                    }}
                    onRemoveItem={(item, index) => {
                        const items = this.state.selectedItems.filter((sitem) => sitem.id !== item.id);
                        this.setState({ selectedItems: items });
                    }}
                    containerStyle={styles.container}
                    textInputStyle={styles.input}
                    placeholder="Search or Add a new Customer"
                    placeholderTextColor="grey"
                    // itemStyle={{
                    //     padding: 10,
                    //     marginTop: 2,
                    //     backgroundColor: '#ddd',
                    //     borderColor: '#bbb',
                    //     borderWidth: 1,
                    //     borderRadius: 5,
                    // }}
                    itemStyle={styles.items}
                    itemTextStyle={styles.itemText}
                    // itemsContainerStyle={{ maxHeight: 140 }}
                    items={items}
                    resetValue={false}
                    listProps={
                        {
                        nestedScrollEnabled: true,
                        }
                    }
                    textInputProps={
                        {
                            onTextChange: () => {}
                        }
                    }
                />
            </View>
        );
    }
  }
//Styles
const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        marginBottom: 25,
        width: 340,
        borderStyle: 'solid',
        borderColor: 'black',
        borderTopEndRadius: 25,
        borderTopStartRadius: 25
    },
    input: {
        fontSize: 20,
        marginLeft: 15
    },
    items: {
        borderColor: 'black',
        borderBottomWidth: 1,
        borderBottomEndRadius: 5
    },
    itemText: {
        color: "grey",
        fontSize: 15,
        paddingLeft: 15
    }
})
