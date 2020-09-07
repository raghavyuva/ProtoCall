// import component
import React, { Component } from 'react'
import { Image, StyleSheet, SafeAreaView, FlatList, Dimensions, Share } from 'react-native';
import { Container, Header, Content, Card, CardItem, Thumbnail, Text, Button, Icon, Left, Body, Drawer, View, ListItem, Right, Radio, List, Title, ActionSheet, Item, Input } from 'native-base';
import MultiSelect from 'react-native-multiple-select';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import firebase from 'firebase';
import 'firebase/auth';
import 'firebase/firestore';
const { width: screenWidth } = Dimensions.get('window');
require('firebase/storage');
export default class adduser extends React.Component {
    state = {
        selectedItems: [],
        list: [],
        selectedItemsArray: [],
        uploadingarray: [],
    };
    Groupname = this.props.route.params.name

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

            });
        return () => subscriber();
    }
    onSelectedItemsChange = (selectedItems) => {
        this.setState({ selectedItems });
        this.state.selectedItemsArray.push({ selectedItems })
    };
    colors = ['#1b262c', '#0f4c75', '#3282b8', '#6b028d', "#221f3b",]
    submit = () => {
        console.log(this.state.selectedItemsArray);
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
                    users: this.state.selectedItemsArray[this.state.selectedItemsArray.length - 1]
                });
                docRef.collection('Users').doc(this.Groupname).set({
                    users: this.state.selectedItemsArray[this.state.selectedItemsArray.length - 1]
                })
                alert(`you have successfully created the group ${this.Groupname}`)
                this.props.navigation.navigate("Home");
            });
        firebase.firestore().collection('Members').doc(this.Groupname).set({
            createdAt: new Date().getTime(),
            Groupname: this.Groupname,
            users: this.state.selectedItemsArray[this.state.selectedItemsArray.length - 1]
        })
    }
    render() {

        const { selectedItems } = this.state;
        return (
            <View style={{ flex: 1 }}>
                <MultiSelect
                    items={this.state.list}
                    uniqueKey="email"
                    ref={(component) => { this.multiSelect = component }}
                    onSelectedItemsChange={this.onSelectedItemsChange}
                    selectedItems={selectedItems}
                    selectText={`Add users to group ${this.Groupname}`}
                    searchInputPlaceholderText="Search user email"
                    onChangeInput={(text) => console.log(text)}
                    styleTextDropdown={{ color: 'white', textAlign: 'center' }}
                    displayKey='email'
                    submitButtonColor='red'
                    styleItemsContainer={{ backgroundColor: '#6b028d' }}
                    styleTextDropdownSelected={{ color: 'white', textAlign: 'center' }}
                    styleRowList={{ backgroundColor: 'black' }}
                    styleDropdownMenuSubsection={{ backgroundColor: 'red' }}
                    styleListContainer={{ backgroundColor: 'red' }}
                    tagTextColor='black'
                    itemTextColor='white'
                    hideSubmitButton={false}
                />
                <View style={{ position: 'absolute', bottom: 0 }}>
                    <Button style={{ justifyContent: 'center', alignSelf: 'center', backgroundColor: 'green', borderRadius: 20, width: screenWidth }}
                        onPress={this.submit}
                    >
                        <Text>
                            Finish
            </Text>
                    </Button>
                </View>
            </View>
        );
    }
}

