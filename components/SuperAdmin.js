import React, { Component, useState, useContext, } from 'react';
import { Image, StyleSheet, SafeAreaView, FlatList, Dimensions, Share, ScrollView } from 'react-native';
import { Container, Header, Content, Card, CardItem, Thumbnail, Text, Button, Icon, Left, Body, Drawer, View, ListItem, Right, Radio, List, Title, ActionSheet, Form, Picker, Item, Input, Label } from 'native-base';
import * as Font from 'expo-font';
const { width: screenWidth } = Dimensions.get('window');
import { Ionicons, AntDesign } from '@expo/vector-icons';
import * as firebase from 'firebase';
import { min } from 'react-native-reanimated';
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
        email: "",
        data: "",
        deletinggroup: "",
        deletinguser: ""
    }
    async componentDidMount() {
        await Font.loadAsync({
            'Roboto': require('native-base/Fonts/Roboto.ttf'),
            'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
            ...Ionicons.font,
        })
        this.setState({ loading: false })
        firebase.firestore().collection('THREADS').get().then((querySnapshot) => {
            querySnapshot.forEach(documentSnapshot => {
                let groupnames = documentSnapshot.data();
                const names = groupnames.name
                options = [names]
            });
        })
    }
    deletepartgroup = () => {
        const dbRef = firebase.firestore().collection('THREADS')
        dbRef.delete().then((res) => {
            alert(res);
        })
    }
    deletepartuser = () => {
        const ref = firebase.firestore().collection('users').doc(users.this.state.deletinguser)
        ref.delete().then((res) => {
            alert(res);
        })
    }
    GroupHandler = () => {
        if (!this.state.groupname) {
            alert('enter group name to navigate to next page')
        } else {
            this.props.navigation.navigate('adduser', { name: this.state.groupname })
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
                <ScrollView>
                    <View style={{ margin: 25, }}>
                        <Text style={styles.title}>Create a NeW Group</Text>
                        <Item rounded style={styles.item}>
                            <Input placeholder='Group Name Goes here'
                                onChangeText={(groupname) => this.setState({ groupname })}
                                value={this.state.groupname}
                            />
                        </Item>
                    </View>
                    <Button style={styles.button}
                        onPress={this.GroupHandler}
                    >
                        <Text>Next step</Text>
                    </Button>
                    <View style={{ margin: 25, }}>

                        <Text style={styles.title}>Delete particular Group</Text>
                        <Item rounded style={styles.item}>
                            <Input placeholder='Group Name to delete' style={styles.item}
                                onChangeText={(deletinggroup) => this.setState({ deletinggroup })}
                                value={this.state.deletinggroup}
                            />
                        </Item>
                        <Button style={styles.adduser} onPress={this.deletepartgroup}>
                            <Text>Delete</Text>
                        </Button>
                    </View>
                    <View style={{ margin: 25, }}>

                        <Text style={styles.title}>Delete All Groups</Text>

                        <Text>Danger,</Text>
                        <Text note>by doing this action all the groups including their messages that are present in the database will be deleted</Text>

                        <Button style={styles.adduser} >
                            <Text>Delete</Text>
                        </Button>
                    </View>
                    <View style={{ margin: 25, }}>

                        <Text style={styles.title}>Delete particular User</Text>
                        <Item rounded style={styles.item}>
                            <Input placeholder='User email to delete' style={styles.item}
                                onChangeText={(deletinguser) => this.setState({ deletinguser })}
                                value={this.state.deletinguser}
                            />
                        </Item>
                        <Button style={styles.adduser}
                            onPress={this.deletepartuser}
                        >
                            <Text>Delete</Text>
                        </Button>
                    </View>
                </ScrollView>
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
    },
    title: {
        fontSize: 20,

        fontWeight: 'bold',
        textTransform: 'capitalize',
        color: 'red',
        borderBottomWidth: 5

    }
});