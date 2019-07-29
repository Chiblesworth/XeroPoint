import React, { Component } from 'react';
import { Text, View, FlatList, StyleSheet } from 'react-native';
import { Header, Button, SearchBar, ListItem} from 'react-native-elements';
import HeaderIcon from './HeaderIcon';

export default class SearchCustomerScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            customers: this.props.navigation.state.params.customers,
            filteredCustomers: [],
            search: "",
            renderList: false
        }

        this.updateSearch = this.updateSearch.bind(this);
        // this.createFlatList = this.createFlatList.bind(this);
        // this.renderFlatList = this.renderFlatList.bind(this);
    }

    componentDidMount() {
    }

    updateSearch = search => {
        // this.setState({search}, () => {
        //     this.renderFlatList();
        // });
        this.setState({search: search});

        let filteredCustomers = this.state.customers.filter((item) => {
            return item.name.includes(search);
        });

        this.setState({filteredCustomers: filteredCustomers}, () => {
            console.log(this.state.filteredCustomers)
        });

    }

    // createFlatList() {
    //     console.log("Here in create list")
    //     console.log(this.state.renderList)
    //     //https://stackoverflow.com/questions/45666762/search-filter-with-react-native-on-flatlist
    //     //llook later
    //     return (
    //         <View style={styles.listContainer}>
    //              <FlatList
    //                 data={this.state.customers}
    //                 keyExtractor={(item) => `${item.id}`}
    //                 renderItem={({item}) => {
    //                     <ListItem
    //                         title={item.name}
    //                         titleStyle={styles.listItemTitle}
    //                     />
    //                 }}
    //             />
    //         </View>
    //     );
    // }

    // renderFlatList() {
    //     this.setState({renderList: true})
    // }

    render() {
        const {navigate} = this.props.navigation;

        return (
            <View style={styles.mainContainer}>
                <View stlye={styles.header}>
                    <Header 
                        leftComponent={
                            <HeaderIcon 
                                name="chevron-left"
                                type="entypo"
                                size={70}
                                handlePress={() => navigate("Payment")}
                            /> 
                        }
                        backgroundColor='#808080'
                        containerStyle={{ borderBottomWidth: 0 }}
                        centerComponent={
                            <Text style={styles.headerTitle}>Search for Customer</Text>
                        }
                    />
                </View>
                <View>
                    <SearchBar
                        placeholder="Search"
                        containerStyle={styles.searchContainer}
                        inputContainerStyle={styles.inputContainer}
                        onChangeText={this.updateSearch}
                        value={this.state.search}
                    />
                </View>
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
        height: 70
    },
    headerTitle: {
        fontSize: 25,
        color: 'white',
        paddingBottom: 30
    },
    searchContainer: {
        backgroundColor: 'white',
        width: '90%',
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
        fontSize: 30
    },
    listContainer: {
        backgroundColor: 'white',
        width: '100%'
    },
})