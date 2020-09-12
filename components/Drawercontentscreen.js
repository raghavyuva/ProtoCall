import {
    DrawerContentScrollView,
    DrawerItem
} from '@react-navigation/drawer';
import React, { Component, useContext, useEffect, useState } from 'react';
import { Image, StyleSheet, FlatList, ScrollView, View, Linking, AsyncStorage, Alert, Dimensions } from 'react-native';
import { Container, Header, Content, Button, ListItem, Icon, Left, Body, Right, Card, CardItem, List, ActionSheet } from 'native-base';
import * as Font from 'expo-font';
import { Ionicons, FontAwesome5, MaterialCommunityIcons, Feather, SimpleLineIcons, Octicons, Fontisto, FontAwesome, MaterialIcons } from '@expo/vector-icons';
const { width: screenWidth } = Dimensions.get('window');
import * as firebase from 'firebase';
import {
    Avatar,
    Text,
    Title,
    Caption,
    Paragraph,
    Drawer,
    TouchableRipple,
    Switch
} from 'react-native-paper';
console.disableYellowBox = true
import {AuthContext} from '../navigation/AuthProvider';


export function DrawerContent(props) {
    const { user } = useContext(AuthContext);

const currentUser = user.toJSON();
    const [users, setUsers] = useState([]);
    useEffect(() => {
        const unsubscribe = firebase.firestore().collection('users')
        .doc(currentUser.uid).onSnapshot(document=>{
            let data = document.data();
            setUsers(data);
        })
    })

    return (
        <View style={{ flex: 1, backgroundColor: 'black' }}>
            <View style={styles.drawerContent}>
                <View style={styles.userInfoSection}>
                    <View style={{ flexDirection: 'row', marginTop: 15 }}>
                        <Avatar.Image
                            source={{
                                uri: users.avatar
                            }}
                            size={80}
                            style={styles.image}
                           
                        />
                        <View style={{ marginLeft: 15, flexDirection: 'column' }}>
                            <Title style={styles.title} numberOfLines={1}> {users.displayName} </Title>
                            <Caption style={styles.caption}> {users.number} </Caption>
                        </View>
                    </View>
                    <View style={styles.row}>
                        <View style={styles.section}>
                        <Paragraph style={[styles.paragraph, styles.caption]}>{users.email}</Paragraph>
                        </View>
                        <View style={styles.section}>
                            <Paragraph style={[styles.paragraph, styles.caption]}></Paragraph>

                        </View>

                    </View>

                </View>
                <DrawerContentScrollView {...props}>
                    <Drawer.Section style={styles.drawerSection}>
                        <DrawerItem
                            icon={({ color, size }) => (
                                <Feather name="settings" size={24} color="white" />
                            )}
                            labelStyle={{ color: 'white' }}
                            label="Settings"
                            style={{ backgroundColor: 'orange', marginTop: 20 }}
                            onPress={() => props.navigation.navigate('settings' )}
                        />
                        <DrawerItem
                            icon={({ color, size }) => (
                                <SimpleLineIcons name="support" size={24} color="white" />
                            )}
                            labelStyle={{ color: 'white' }}
                            label="Support"
                            style={{ backgroundColor: 'green', marginTop: 20 }}
                            onPress={() => Linking.openURL('https://example.in')}

                        />
                        <DrawerItem
                            icon={({ color, size }) => (
                                <Octicons name="mail-read" size={24} color="white" />
                            )}
                            labelStyle={{ color: 'white' }}
                            label="privacy policy and terms"
                            style={{ backgroundColor: '#b94c57', marginTop: 20 }}
                            onPress={() => props.navigation.navigate('external', { screen: 'segment' })}
                        />
                        <DrawerItem
                            icon={({ color, size }) => (
                                <FontAwesome5 name="hire-a-helper" size={24} color="white" />
                            )}
                            labelStyle={{ color: 'white' }}
                            label="Hire-Helper"
                            style={{ backgroundColor: 'blue', marginTop: 20 }}
                            onPress={() => Linking.openURL('https://raghav.orak.in/')}

                        />
                        <DrawerItem
                            icon={({ color, size }) => (
                                <FontAwesome name="telegram" size={24} color="white" />
                            )}
                            labelStyle={{ color: 'white' }}
                            label="join official channel"
                            style={{ backgroundColor: 'red', marginTop: 20 }}
                            onPress={() => Linking.openURL('https://t.me/orakin')}

                        />
                        <DrawerItem
                            icon={({ color, size }) => (
                                <MaterialIcons name="feedback" size={24} color="white" />
                            )}
                            labelStyle={{ color: 'white' }}
                            label="feedback"
                            style={{ backgroundColor: '#6b028d', marginTop: 20 }}
                            // onPress={() => Actions.report()}
                            onPress={() => props.navigation.navigate( 'feedback')}
                        />
                        <DrawerItem
                            icon={({ color, size }) => (
                                <FontAwesome name="question-circle" size={24} color="white" />
                            )}
                            labelStyle={{ color: 'white' }}
                            label="FAQs"
                            style={{ backgroundColor: '#0f4c75', marginTop: 20 }}
                            // onPress={() => Actions.report()}
                            onPress={() => props.navigation.navigate('faqs')}
                        />
                    </Drawer.Section>
                </DrawerContentScrollView>
                <Drawer.Section style={styles.bottomDrawerSection}>
                    <DrawerItem
                        icon={({ color, size }) => (
                            <MaterialCommunityIcons name="exit-to-app" size={24} color="white" />
                        )}
                        label="Sign Out"
                        labelStyle={{ color: 'white' }}
                        onPress={()=>firebase.auth().signOut()}
                    />
                </Drawer.Section>
            </View>

        </View>
    );
}
const styles = StyleSheet.create({
    drawerContent: {
        flex: 1,
    },
    title: {
        fontSize: 18,
        marginTop: 15,
        fontWeight: 'bold',
        color: 'white',
    },
    caption: {
        fontSize: 14,
        color: 'white',
    },
    userInfoSection: {
        paddingLeft: 20,
    },
    row: {
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    section: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 15,
    },
    paragraph: {
        fontWeight: 'bold',
        marginRight: 3,
    },
    drawerSection: {
        marginTop: 3,
    },
    bottomDrawerSection: {
        marginBottom: 15,
        borderTopColor: 'yellow',
        borderTopWidth: 3,
        backgroundColor:'#7558'
    },
    preference: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    label: {
        color: "white"
    }
})