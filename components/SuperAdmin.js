import React, { Component, useState } from 'react';
import { Image, StyleSheet, SafeAreaView, FlatList, Dimensions, Share } from 'react-native';
import { Container, Header, Content, Card, CardItem, Thumbnail, Text, Button, Icon, Left, Body, Drawer, View, ListItem, Right, Radio, List, Title, ActionSheet, Form, Picker, Item, Input, Label } from 'native-base';
import * as Font from 'expo-font';
const { width: screenWidth } = Dimensions.get('window');
import { Ionicons, AntDesign } from '@expo/vector-icons';
import * as firebase from 'firebase';
let options = []
export default class SuperAdmin extends React.Component {
    constructor(props) {
        super(props);
    }
    state = {
        loading: true,
        groupname: "",
        gpassword: "",
        username: "",
        password: "",
        role: "Admin",
        email: "",
        selected: "0",
        data:""
    }
    onRoleValueChange() {
        this.setState({
            role: value
        });
    }
    onDataValueChange() {
        this.setState({
            selected: value
        });
    }
    async componentDidMount() {
        await Font.loadAsync({
            'Roboto': require('native-base/Fonts/Roboto.ttf'),
            'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
            ...Ionicons.font,
        })
        this.setState({ loading: false })
        firebase.firestore().collection('THREADS').get().then((querySnapshot) => {
            console.log('Total Group Name: ', querySnapshot.size);
            querySnapshot.forEach(documentSnapshot => {
                let groupnames = documentSnapshot.data();
                const names = groupnames.name
                options = [names]
            });
        })
    }
    GroupHandler = () => {
        if (this.state.groupname.length > 0) {
            firebase.firestore().collection('THREADS').add({
                name: this.state.groupname,
                password: this.state.gpassword,
                latestMessage: {
                    text: `You have created the group ${this.state.groupname}`,
                    createdAt: new Date().getTime(),
                },
            })
                .then((docRef) => {
                    docRef.collection("MESSAGES").add({
                        text: `You have joined the Group ${this.state.groupname}`,
                        createdAt: new Date().getTime(),
                        system: true,
                    });

                    alert(`You have Created the Group successfully with group name ${this.state.groupname} whose password is ${this.state.gpassword}`);
                    this.setState({ groupname: '' });
                    this.setState({ gpassword: "" });
                    //navigation can be defined
                });
        }
        else {
            alert('input fields cannot be as empty as like that');
        }
    }
    UserHandler = async () => {
        if (!this.state.email || !this.state.password || !this.state.username) {
            alert('input fields cannot be as empty as like that');
        } else {
            firebase
                .auth()
                .createUserWithEmailAndPassword(this.state.email, this.state.password)
                .then((response) => {
                    const uid = response.user.uid
                    const data = {
                        id: uid,
                        email: this.state.email,
                        username: this.state.username,
                        role: this.state.role,
                    };
                    const usersRef = firebase.firestore().collection('users')
                    usersRef
                        .doc(uid)
                        .set(data)
                        .then(() => {

                            alert(`user created as ${this.state.role},with username ${this.state.username} and password ${this.state.password}`)
                            this.setState({ username: "" });
                            this.setState({ password: "" });
                            this.setState({ role: "" });
                        })
                        .catch((error) => {
                            alert(error)
                        });
                })
                .catch((error) => {
                    alert(error)
                });


        }
    }
    render() {
        if (this.state.loading) {
            return (
                <Container></Container>
            );
        }
        return (
            <Container>
                <Header style={styles.header}>
                    <Text style={styles.admin}>Super Admin</Text>
                </Header>
                <View style={{ margin: 25, }}>
                    <Item rounded>
                        <Input placeholder='Group Name Goes here'
                            onChangeText={(groupname) => this.setState({ groupname })} value={this.state.groupname}
                        />
                    </Item>
                    <Item rounded style={styles.item}>
                        <Input placeholder='Enter password to protect'
                            style={styles.item}
                            onChangeText={(gpassword) => this.setState({ gpassword })} value={this.state.gpassword}
                        />
                    </Item>

                </View>
                <Button style={styles.button}
                    onPress={this.GroupHandler}
                >
                    <Text>Add Group</Text>
                </Button>
                <View style={{ margin: 25, }}>
                    <Item rounded style={styles.item}>
                        <Input placeholder='user name goes here'
                            style={styles.item}
                            onChangeText={(username) => this.setState({ username })} value={this.state.username}
                        />
                    </Item>
                    <Item rounded style={styles.item}>
                        <Input placeholder='email'
                            style={styles.item}
                            onChangeText={(email) => this.setState({ email })} value={this.state.email}
                        />
                    </Item>
                    <Item rounded style={styles.item}>
                        <Input placeholder='Enter password to protect the user'
                            style={styles.item}
                            onChangeText={(password) => this.setState({ password })} value={this.state.password}

                        />
                    </Item>
                    <Item rounded style={styles.item}>

                        <Picker

                            mode="dropdown"
                            style={{ width: 120 }}
                            selectedValue={this.state.role}
                            onValueChange={this.onRoleValueChange.bind(this)}
                        >
                            <Picker.Item label="Admin" value="key0" />
                            <Picker.Item label="Tutor" value="key1" />
                            <Picker.Item label="Client" value="key2" />
                        </Picker>

                    </Item>
                    <Item rounded style={styles.item}>
                        <Picker
                            style={{ width: 120 }}
                            mode="dropdown"
                            selectedValue={this.state.selected}
                            onValueChange={this.onDataValueChange.bind(this)}>
                            {options.map((item, index) => {
                                return (< Picker.Item label={item} value={index} key={index} />);
                            })}
                        </Picker>
                    </Item>
                    <Button style={styles.adduser}
                        onPress={this.UserHandler}

                    >
                        <Text>Add User</Text></Button>
                </View>
            </Container>
        );
    }
}
const styles = StyleSheet.create({
    item: {
        marginTop: 10
    },
    header: {
        color: 'white',
        backgroundColor: '#fc5c65',
        justifyContent: 'center',
    },
    admin: {
        color: 'white',
        marginTop: 13,
        fontSize: 20,
        fontWeight: 'bold',
        textTransform: 'capitalize',
    },
    button: {
        borderRadius: 20,
        backgroundColor: '#0c0c0c',
        width: 250,
        justifyContent: "center",
        alignSelf: 'center',
        paddingTop: 8
    },
    text: {
        color: 'white',
        marginTop: 13,
        fontSize: 18,
        fontWeight: 'bold',
        textTransform: 'capitalize',
    },
    adduser: {
        borderRadius: 20,
        backgroundColor: '#0c0c0c',
        width: 250,
        justifyContent: "center",
        alignSelf: 'center',
        marginTop: 15
    }
});