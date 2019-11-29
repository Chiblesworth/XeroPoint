import React, { Component } from 'react';
import { View, Text, FlatList, Alert, StyleSheet } from 'react-native';
import { Header, SearchBar, ListItem } from 'react-native-elements';
//Components
import HeaderIcon from '../HeaderIcon';
//Helper Methods
import { storageGet, storageSet } from '../../helpers/localStorage';

//Want to fix this using the endpoints filter feature instead of sending a list to this screen. LOOK INTO THIS AFTER RECIPET IS DONE
export default class SearchCustomerScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            customers: [],
            search: "",
            merchantId: null
        }

        this.updateSearch = this.updateSearch.bind(this);
        this.navigateToPayment = this.navigateToPayment.bind(this);
        this.getFilteredCustomers = this.getFilteredCustomers.bind(this);
        this.filterCustomers = this.filterCustomers.bind(this);
        this.handleSelectedCustomer = this.handleSelectedCustomer.bind(this);
    }

    navigateToPayment() {
        this.props.navigation.navigate("Payment");
    }

    updateSearch(text) {
        this.setState({ search: text }, () => {
            this.getFilteredCustomers();
        });
    }

    async getFilteredCustomers() {
        let encodedUser = await storageGet("encodedUser");
        let merchantId = await storageGet("merchantId");

        let headers = {
            'Authorization': 'Basic ' + encodedUser,
            'Content-Type': 'application/json; charset=utf-8'
        }
        this.setState({customers: []});

        fetch(`https://sandbox.api.mxmerchant.com/checkout/v3/customer?merchantId=${merchantId}&filter=${this.state.search}`, {
            method: "GET",
            headers: headers,
            // qs: { merchantId: merchantId, filter: this.state.search.toString() }
        }).then((response) => {
            return response.json();
        }).then((Json) => {
            this.filterCustomers(Json.records);
        });
    }

    filterCustomers(records) {
        let filteredCustomers = [];

        if(!!records){
            for(let i = 0; i < records.length; i++){
                if(records[i].name !== "UNKNOWN"){
                    filteredCustomers.push(records[i]);
                }
            }
        }

        this.setState({customers: filteredCustomers});
    }

    handleSelectedCustomer(customer) {
        Alert.alert("Customer Added", customer.name + " was added to payment!");
        storageSet("selectedCustomerId", customer.id.toString());
        this.navigateToPayment();
    }

    renderEmpty = () => {
        return (
            <View>
                <Text style={styles.newCustomerText}>"{this.state.search}"</Text>
            </View>
        );
    }

    renderCustomers = (customer) => {
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
            <View style={styles.mainContainer}>
                <View style={styles.header}>
                    <Header
                        leftComponent={
                            <HeaderIcon
                                name="chevron-left"
                                type="entypo"
                                size={50}
                                handlePress={() => this.navigateToPayment()}
                            />
                        }
                        backgroundColor='#454343'
                        containerStyle={{ borderBottomWidth: 0 }}
                        centerComponent={
                            <SearchBar
                                placeholder="Search"
                                containerStyle={styles.searchContainer}
                                inputContainerStyle={styles.inputContainer}
                                onChangeText={(text) => this.updateSearch(text)}
                                value={this.state.search}
                            />
                        }
                        centerContainerStyle={styles.centerComponent}
                    />
                </View>
                {/* {this.state.customers.length > 0 &&
                    this.renderCustomers()
                } */}
                {this.renderCustomers()}
            </View>
        )
    }
}

//Styles 
const styles = StyleSheet.create({
    mainContainer: {
        height: '100%',
        backgroundColor: '#454343'
    },
    header: {
        width: '100%',
        height: 70,
        marginBottom: 25
    },
    searchContainer: {
        backgroundColor: 'white',
        width: '100%',
        marginLeft: 20,
        borderStyle: 'solid',
        borderColor: 'white',
        borderRadius: 25,
    },
    inputContainer: {
        backgroundColor: 'white',
        borderStyle: 'solid',
        borderColor: 'white',
        borderRadius: 25,
    },
    listItemTitle: {
        color: 'white',
        fontSize: 20,
        marginLeft: 25
    },
    listContainer: {
        backgroundColor: '#454343',
        width: '100%'
    },
    centerComponent: {
        paddingBottom: 20
    },
    newCustomerText: {
        color: 'white',
        fontSize: 20,
        marginLeft: 50
    }
})