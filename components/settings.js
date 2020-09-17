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
                        <SettingsList.Header headerStyle={{ marginTop: 15, padding: 10 }} headerText='user experience' />
                        <SettingsList.Item
                            title='Support'                       
                        />
                        <SettingsList.Item
                            title='Privacy Policy'
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