import React, { Component } from 'react';
import { View, Text, FlatList, Alert, StyleSheet } from 'react-native';
import { Header, SearchBar, ListItem} from 'react-native-elements';
import HeaderIcon from './HeaderIcon';
import AsyncStorage from '@react-native-community/async-storage';

export default class SearchCustomerScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            customers: this.props.navigation.state.params.customers,
            search: "",
            merchantId: null
        }

        this.filteredCustomers = this.state.customers;

        this.updateSearch = this.updateSearch.bind(this);
        this.handleSelectedCustomer = this.handleSelectedCustomer.bind(this);
        this.navigateToPayment = this.navigateToPayment.bind(this);
    }

    componentDidMount() {
        AsyncStorage.getItem("merchantId").then((id) => {
            this.setState({merchantId: id});
        });
    }

    updateSearch = search => {
        this.setState({search: search});

        const newData = this.filteredCustomers.filter(item => {
            const itemData = `${item.name.toUpperCase()}`
            const textData = search.toUpperCase();

            return itemData.indexOf(textData) > -1;
        });

        this.setState({customers: newData});
    }

    handleSelectedCustomer(customerId, customerName) {
        Alert.alert(
            "Customer Added to Payment",
            `${customerName} added to payment.`
        )

        this.navigateToPayment(customerId);
    }

    navigateToPayment(customerId) {
        //Empty list before going back that way no duplicates are made
        this.setState({customers: null});
        this.filteredCustomers = null;

        this.props.navigation.navigate("Payment", {customerId: customerId});
    }

    // createNewCustomer() {
    //     AsyncStorage.getItem("encodedUser").then((encoded) => {
    //         let headers = {
    //             'Authorization' : 'Basic ' + encoded,
    //             'Content-Type' : 'application/json; charset=utf-8'
    //         }

    //         let data = {
    //             merchantId: this.state.merchantId,
    //             name: this.state.search,
    //             firstName: this.state.search
    //         }

    //         fetch("https://sandbox.api.mxmerchant.com/checkout/v3/customer", {
    //             method: "POST",
    //             headers: headers,
    //             body: JSON.stringify(data)
    //         }).then((response) => {
    //             console.log(response)
    //         });

    //         fetch("https://sandbox.api.mxmerchant.com/checkout/v3/customer", {
    //             method: "GET",
    //             headers: headers,
    //             qs: this.state.merchantId
    //         }).then((response) => {
    //             console.log(response.json())
    //         })

    //         Alert.alert(
    //             "Customer Added to Payment",
    //             `${this.state.search} added to payment.`
    //         )

    //         this.navigateToPayment();
    //     });
    // }

    renderHeader = () => {
        return (
            <View>
                <Header 
                    leftComponent={
                        <HeaderIcon 
                            name="chevron-left"
                            type="entypo"
                            size={70}
                            handlePress={() => this.navigateToPayment()}
                        /> 
                    }
                    backgroundColor='#808080'
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
        )
    }

    renderEmpty = () => {
        return (
            <View>
                <Text style={styles.newCustomerText}>"{this.state.search}"</Text>
                <Text style={styles.newCustomerText}>Cannot find customer. Will need to create the customer before payment is submitted.</Text>
            </View>
        );
    }

    render() {
        return (
            <View style={styles.mainContainer}>
                <FlatList
                    data={this.state.customers}
                    renderItem={({item}) => (
                        <ListItem
                            containerStyle={styles.listContainer}
                            title={`${item.name}`}
                            titleStyle={styles.listItemTitle}
                            onPress={() => this.handleSelectedCustomer(item.id, item.name)}
                        />
                    )}
                    keyExtractor={item => item.id.toString()}
                    ListHeaderComponent={this.renderHeader}
                    ListHeaderComponentStyle={styles.header}
                    ListEmptyComponent={this.renderEmpty}
                />
            </View>
        )
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
        backgroundColor: '#808080',
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