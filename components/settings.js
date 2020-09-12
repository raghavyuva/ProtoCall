import React, { Component, useState } from 'react';
import { Image, StyleSheet, SafeAreaView, FlatList, Dimensions, Share, TouchableOpacity, Alert } from 'react-native';
import { Container, Header, Content, Card, CardItem, Thumbnail, Text, Button, Icon, Left, Body, Drawer, View, Item, Input, Title, Right } from 'native-base';
import * as Font from 'expo-font';
const { width: screenWidth } = Dimensions.get('window');
import SettingsList from 'react-native-settings-list';
import { EvilIcons, AntDesign, FontAwesome5, Entypo, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

export default class Settings extends React.Component {
    constructor() {
        super();
        this.onValueChange = this.onValueChange.bind(this);
        this.state = { switchValue: false, };
    }
    state = {
        searchText: "",
        isSelected: false,
        search_bar_enabled: false,
        loading: true,
        filteredData: [],
        data: [],
    }
    toggling = () => {
        this.setState({ search_bar_enabled: !this.state.search_bar_enabled });
    }
    render() {
        return (
            <View style={{ backgroundColor: 'black', flex: 1 }}>
                <View>
                            <Header style={{ backgroundColor: '#221f3b' }}>
                                <Left>
                                    <Button transparent onPress={() => {
                                        this.props.navigation.openDrawer();
                                    }}>
                                        <Icon name='menu' />
                                    </Button>
                                </Left>
                                <Body>
                                    <Title>Settings</Title>
                                </Body>
                                <Right>
                                    <Button transparent onPress={() => this.props.navigation.goBack()} >
                                        <Icon name='arrow-left' type='Feather' />
                                    </Button>
                                </Right>
                            </Header>

                </View>
                <View style={{ backgroundColor: '#EFEF', flex: 1 }}>
                    <SettingsList borderColor='#c8c' defaultItemSize={50}>
                        <SettingsList.Header headerStyle={{ marginTop: 15, margin: 10 }} headerText='Discovery' />
                        <SettingsList.Item
                            icon={
                                <Icon name='eye' color='red' style={{ color: 'white', margin: 10, backgroundColor: 'blue', padding: 4,borderRadius:25 }} />
                            }
                            hasSwitch={true}
                            switchState={this.state.switchValue}
                            switchOnValueChange={this.onValueChange}
                            hasNavArrow={false}
                            title='Show me on tinder'
                        />

                        <SettingsList.Header headerStyle={{ marginTop: 15, padding: 10 }} headerText='Push Notifications' />
                        <SettingsList.Item
                            icon={
                                <Icon name='new' color='red' style={{ color: 'white', margin: 10, backgroundColor: 'green', padding: 4 ,borderRadius:25}} type='Entypo' />
                            }
                            hasSwitch={true}
                            switchState={this.state.switchValue}
                            switchOnValueChange={this.onValueChange}
                            hasNavArrow={false}
                            title='New Matches'
                            onPress={() => Alert.alert('Route To Notifications Page')}
                        />
                        <SettingsList.Item
                            icon={
                                <Icon name='chat' color='red' style={{ color: 'white', margin: 10, backgroundColor: 'red', padding: 4,borderRadius:25 }} type='Entypo' />
                            }
                            hasSwitch={true}
                            switchState={this.state.switchValue}
                            switchOnValueChange={this.onValueChange}
                            hasNavArrow={false}
                            title='Messages'
                            onPress={() => Alert.alert('Route To Control Center Page')}
                        />
                        <SettingsList.Item
                            icon={
                                <Icon name='heart' color='red' style={{ color: 'white', margin: 10, backgroundColor: 'orange', padding: 4,borderRadius:25 }} type='Entypo' />
                            }
                            hasSwitch={true}
                            switchState={this.state.switchValue}
                            switchOnValueChange={this.onValueChange}
                            hasNavArrow={false}
                            title='Super likes'
                            onPress={() => Alert.alert('Route To Do Not Disturb Page')}
                        />
                        <SettingsList.Item
                            icon={
                                <Icon name='trending-up' color='red' style={{ color: 'white', margin: 10, backgroundColor: 'black', padding: 4,borderRadius:25 }} type='Feather' />
                            }
                            hasSwitch={true}
                            switchState={this.state.switchValue}
                            switchOnValueChange={this.onValueChange}
                            hasNavArrow={false}
                            title='Top Likes'
                            onPress={() => Alert.alert('Route To Do Not Disturb Page')}
                        />
                        <SettingsList.Header headerStyle={{ marginTop: 15, padding: 10 }} headerText='Gender' />
                        <SettingsList.Item

                            icon={
                                <Icon name='male' color='red' style={{ color: 'white', margin: 10, backgroundColor: '#6D4B73', padding: 4,borderRadius:25}} type='FontAwesome' />
                            }
                            hasSwitch={false}
                            switchState={this.state.switchValue}
                            switchOnValueChange={this.onValueChange}
                            hasNavArrow={false}
                            title='Male'
                            onPress={() => Alert.alert('Route To General Page')}
                        />
                        <SettingsList.Item
                            icon={
                                <Icon name='female' color='red' style={{ color: 'white', margin: 10, backgroundColor: '#6A6010', padding: 4,borderRadius:25 }} type='FontAwesome' />
                            }

                            switchState={this.state.switchValue}
                            switchOnValueChange={this.onValueChange}
                            hasNavArrow={false}
                            title='Female'
                            onPress={() => Alert.alert('Route To Display Page')}
                        />
                        <SettingsList.Header headerStyle={{ marginTop: 15, padding: 10 }} headerText='Maximum Distance' />
                        <SettingsList.Item

                            title='Support'
                            onPress={() => Alert.alert('Route To General Page')}
                        />
                        <SettingsList.Item

                            title='Privacy Policy'
                            onPress={() => Alert.alert('Route To Display Page')}
                        />
                    </SettingsList>
                </View>
            </View>
        );
    }
    onValueChange(value) {
        this.setState({ switchValue: value });
    }

}
const styles = StyleSheet.create({
    Container: {
        backgroundColor: 'black'
    }
});