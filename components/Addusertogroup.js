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
        data: [],
        passedparam: null,
        uploadingparams: [],
    };
    get firestore() {
        return firebase.firestore()
    }
    get uid() {
        return (firebase.auth().currentUser || {}).uid
    }
    get timestamp() {
        return Date.now()
    }
    uploadPhotoAsync = async (uri, filename) => {
        return new Promise(async (res, rej) => {
            const response = await fetch(uri);
            const file = await response.blob();
            let upload = firebase.storage().ref(filename).put(file)
            upload.on(
                "state_changed",
                snapshot => { },
                err => {
                    rej(err);
                },
                async () => {
                    const url = await upload.snapshot.ref.getDownloadURL();
                    res(url);
                }
            );
        });
    };
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
        firebase.firestore().collection('users')
            .doc(this.uid)
            .onSnapshot(documentSnapshot => {
                let datarecieved = documentSnapshot.data();
                this.setState({ data: datarecieved })
            })
        console.log(this.props.route.params.data);
        return () => subscriber();
    }
    onSelectedItemsChange = (selectedItems) => {
        this.setState({ selectedItems });
        this.state.selectedItemsArray.push({ selectedItems })
    };
    colors = ['#1b262c', '#0f4c75', '#3282b8', '#6b028d', "#221f3b",]
    submit = async () => {
        let remoteUri = null;
        try {
            let db = firebase.firestore().collection("THREADS").doc(this.props.route.params.data[0].groupname)

            db.set({
                name: this.props.route.params.data[0].groupname,
                password: this.props.route.params.data[0].grouppassword,
                avatar: null,
                latestMessage: {
                    text: `Admin has Created the Group  ${this.props.route.params.data[0].groupname}`,
                    createdAt: new Date().getTime(),
                    Messageby: this.state.data.displayName
                },
            })
            {/*
            .then((docRef) => {
                docRef.collection("MESSAGES").add({
                    text: `You have joined the Group ${this.props.route.params.data[0].groupname}`,
                    createdAt: new Date().getTime(),
                    system: true,
                    users: this.state.selectedItemsArray[this.state.selectedItemsArray.length - 1]
                });
                docRef.collection('Users').doc(this.props.route.params.data[0].groupname).set({
                    users: this.state.selectedItemsArray[this.state.selectedItemsArray.length - 1]
                })
                alert(`you have successfully created the group ${this.props.route.params.data[0].groupname}`)
            });
        */}
            if (this.props.route.params.data[0].avatar !== null) {
                remoteUri = await this.uploadPhotoAsync(this.props.route.params.data[0].avatar, `Groupavatars/${this.uid}`)
                db.set({ avatar: remoteUri }, { merge: true });
            }

            this.props.navigation.navigate("Home");
            firebase.firestore().collection('users').doc(this.uid).update({
                Groupname: [this.props.route.params.data[0].groupname],
            })
            firebase.firestore().collection('Members').doc(this.props.route.params.data[0].groupname).set({
                createdAt: new Date().getTime(),
                Groupname: this.props.route.params.data[0].groupname,
                users: this.state.selectedItemsArray[this.state.selectedItemsArray.length - 1]
            })
        } catch (error) {
            alert(error);
        }

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
                    selectText={`Add users to group ${this.props.route.params.data[0].groupname} `}
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

