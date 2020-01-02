import React, { Component } from 'react';
import { Text, View, FlatList } from 'react-native';
import { Overlay, SearchBar, ListItem, Button } from 'react-native-elements';

import { storageGet, storageSet } from '../../helpers/localStorage';
import { showAlert } from '../../helpers/showAlert';

import { getCustomers } from '../../api_requests/getCustomers';

import { styles } from '../styles/SearchCustomerOverlayStyles';

export default class SearchCustomerOverlay extends Component {
    constructor(props) {
        super(props);

        this.state = {
            customers: [],
            search: "",
            merchantId: null
        }
    }

    updateSearch = (text) => {
        this.setState({search: text}, () => {
            this.getFilteredCustomers();
        }) 
    }

    getFilteredCustomers = async () => {
        let merchantId = await storageGet("merchantId");
        let data = await getCustomers(merchantId, this.state.search);
        
        this.filterCustomers(data.records);
    }

    filterCustomers = (customers) => { //Used to get rid of all the "UKNOWNN" customers MX Merchant creates
        let filterCustomers = [];

        if(!!customers){
            for(let i = 0; i < customers.length; i++){
                if(customers[i].name !== "UNKNOWN"){
                    filterCustomers.push(customers[i]);
                }
            }
        }

        console.log(filterCustomers);
        this.setState({customers: filterCustomers});
    }

    handleSelectedCustomer = (customer) => {
        showAlert("Customer Added", customer.name + " was added to the payment!");
        storageSet("selectedCustomerId", customer.id.toString()); //REMEMBER TO REMOVE AFTER PAYMENT IS DONE
        this.props.handleClose();
    }

    renderEmpty = () => {
        return (
            <View>
                <Text style={styles.newCustomerText}>"{this.state.search}"</Text>
            </View>
        );
    }

    renderCustomers = () => {
        return (
            <View>
                <FlatList
                    data={this.state.customers}
                    renderItem={({ item }) => (
                        <ListItem
                            containerStyle={styles.listContainer}
                            title={`${item.name}`}
                            titleStyle={styles.listItemTitle}
                            onPress={() => this.handleSelectedCustomer(item)}
                        />
                    )}
                    keyExtractor={item => item.id.toString()}
                    ListEmptyComponent={this.renderEmpty}
                />
            </View>
        );
    }

    render() {
        return (
            <Overlay
                isVisible={this.props.isVisible}
                fullScreen={true}
                overlayBackgroundColor="#454343"
            >
                <View>
                    <View style={styles.row}>
                        <Button
                            title="Cancel"
                            onPress={() => this.props.handleClose()}
                            containerStyle={styles.buttonContainer}
                            buttonStyle={styles.buttonStyle}
                            titleStyle={styles.titleStyle}
                        />
                        <SearchBar
                            placeholder="Search"
                            containerStyle={styles.searchContainer}
                            inputContainerStyle={styles.inputContainer}
                            onChangeText={(text) => this.updateSearch(text)}
                            value={this.state.search}
                        />
                    </View>
                    {this.renderCustomers()}
                </View>
            </Overlay>
        )
    }
}
