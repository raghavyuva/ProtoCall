
import React, { useState, useContext, useEffect } from "react";
import {
    StyleSheet,
    Image,
    ActivityIndicator,
    ImagePickerIOS,
    TouchableOpacity,
    Dimensions,
    FlatList
} from "react-native";
import { Video, Audio } from 'expo-av';
import { Header, Text, Button, Icon, Body, View, ListItem, Right, List, Item, Input, Picker } from 'native-base';
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
import { EvilIcons, AntDesign, FontAwesome, Entypo, } from '@expo/vector-icons';
import { Avatar } from 'react-native-elements';
import { BottomSheet } from 'react-native-btr';
import { Ionic, MaterialIcons } from '@expo/vector-icons';
import { IconButton, Card, } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { AuthContext } from '../navigation/AuthProvider';
import Loading from "../components/Loading";
console.disableYellowBox = true;
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import firebase from 'firebase';
import 'firebase/auth';
import 'firebase/firestore';
require('firebase/storage');
const allselected = []
export default class Adduser extends React.Component {
    constructor(props) {
        super(props);
    }
    Groupname = this.props.route.params.name;
    state = {
        list: [],
        filteredData: [],
        searchText: "",
        selectedItem: null,
        loading: true,
        currentIndex:null,
        arrayofusers:[],
    }
    search = (searchText, ) => {
        this.setState({ searchText: searchText });

        let filteredData = this.state.list.filter(function (item) {

            return item.email.toLowerCase().includes(searchText);
        });

        this.setState({ filteredData: filteredData });
    };
    onPressHandler(id,index) {
        let renderData = [...this.state.list];
        for (let data of renderData) {
            if (data.id == id) {
                data.selected = (data.selected == null) ? true : !data.selected;
                break;
            }
            if (data.selected==true) {
             this.setState({currentIndex:index})
             console.log(this.state.currentIndex);
            }
        }
        this.setState({ renderData });
    }
    componentDidMount() {
        const subscriber = firebase.firestore()
            .collection('users')
            .onSnapshot(querySnapshot => {
                const users = [];

                querySnapshot.forEach(documentSnapshot => {
                    users.push({
                        ...documentSnapshot.data(),
                        key: documentSnapshot.id,
                    });
                });
                this.setState({ list: users })
                this.setState({ loading: false });
            });
        return () => subscriber();
    }
    colors = ['#1b262c', '#0f4c75', '#3282b8', '#6b028d', "#221f3b",]
    submit = () => {
        firebase
            .firestore()
            .collection("THREADS")
            .add({
                name: this.Groupname,
                latestMessage: {
                    text: `Admin has Created the Group  ${this.Groupname}`,
                    createdAt: new Date().getTime(),
                },
            })
            .then((docRef) => {
                docRef.collection("MESSAGES").add({
                    text: `You have joined the Group ${this.Groupname}`,
                    createdAt: new Date().getTime(),
                    system: true,
                });
                docRef.collection('Users').add({
                    users: this.state.selectedItem,
                })
                navigation.navigate("Home");
            });
    }
    FlatListItemSeparator = () => <View style={styles.line} />;
    render() {

        if (this.state.loading) {
            return <Loading />
        }
        return (
            <View style={{ backgroundColor: '#0f4c75' }}>
                <Text style={styles.title}>Add users to Group {this.Groupname} </Text>
                <Header searchBar rounded style={{ backgroundColor: '#0f4c75' }}>
                    <Item>
                        <Icon name="ios-search" />
                        <Input placeholder="search users by email" clearButtonMode='while-editing'
                            onChangeText={this.search} value={this.state.searchText} autoCapitalize='none' autoCorrect={false}

                        />
                        <Button transparent onPress={() => {
                            this.setState({ searchText: '' })
                            this.setState({ filteredData: '' })
                        }}>
                            <Entypo name="cross" size={26} color="red" />
                        </Button>
                    </Item>
                    <Button transparent>
                        <Text>Search</Text>
                    </Button>

                </Header>
                <View style={{ flexDirection: 'row', margin: 10 }}>
                    <Right>
                        <Button style={styles.button} onPress={this.submit}>
                            <Text style={{ color: 'black' }}>Create Group</Text>
                        </Button>
                    </Right>
                </View>
                <FlatList
                    ItemSeparatorComponent={this.FlatListItemSeparator}
                    showsHorizontalScrollIndicator={false}
                    data={this.state.filteredData && this.state.filteredData.length > 0 ? this.state.filteredData : this.state.list}
                    extraData={this.state.selectedItem}
                    onScrollAnimationEnd
                    renderItem={({ item, index }) => (
                        <TouchableOpacity
                            onPress={() => this.onPressHandler(item.id,item.index)}
                        >
                            <Card
                                style={item.selected == true
                                    ? {
                                        padding: 10,
                                        borderRadius: 5,
                                        backgroundColor: '#6b028d',
                                    }
                                    : {
                                        padding: 10,
                                        borderRadius: 5,
                                        backgroundColor: '#221f3b',
                                    }
                                }>


                                <Text style={{ color: 'white' }}>{item.username}</Text>
                                <Text numberOfLines={1}
                                    style={{ color: 'white' }}
                                >{item.email}</Text>

                            </Card>
                        </TouchableOpacity>
                    )}
                    keyExtractor={item => item.id.toString()}
                />
            </View>
        );
    }
}
const styles = StyleSheet.create({
    item: {
        margin: 20,
        marginLeft: 20,
        backgroundColor: 'black'
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        textTransform: 'capitalize',
        color: '#FFF',
    },
    button: {
        borderRadius: 20,
        backgroundColor: '#fff',
        justifyContent: "center",
    },
    line: {
        height: 0.5,
        width: "100%",
        marginTop: 10,
        backgroundColor: "rgba(255,255,255,0.5)"
    },
});
