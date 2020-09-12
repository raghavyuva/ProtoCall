import React, { Component, useState, useContext, } from 'react';
import { Image, StyleSheet, SafeAreaView, FlatList, Dimensions, Share, ScrollView,TouchableOpacity } from 'react-native';
import { Container, Header, Content, Card, CardItem, Thumbnail, Text, Button, Icon, Left, Body, Drawer, View, ListItem, Right, Radio, List, Title, ActionSheet, Form, Picker, Item, Input, Label } from 'native-base';
import * as Font from 'expo-font';
const { width: screenWidth } = Dimensions.get('window');
import { Avatar as Avatarr, Tooltip, Paragraph, Caption } from 'react-native-elements';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import * as firebase from 'firebase';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import { BottomSheet } from 'react-native-btr';
import { Avatar } from 'react-native-elements';
import { EvilIcons, FontAwesome5, Entypo, MaterialCommunityIcons, } from '@expo/vector-icons';
let options = []
export default class SuperAdmin extends React.Component {
    constructor(props) {
        super(props);
    }
    state = {
        loading: true,
        groupname: "",
        password: "",
        searchText: "",
        isSelected: false,
        search_bar_enabled: false,
        loading: true,
        filteredData: [],
        passparam: [],
        avatar: null,
    }
    getPermissionAsync = async () => {
        if (Constants.platform.android) {
            const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
            if (status !== 'granted') {
                alert('Sorry, we need camera roll permissions to make this work!');
            }
        }
    };
    componentDidMount() {
        this.getPermissionAsync();
    }
    _toggleBottomNavigationView = () => {
        //Toggling the visibility state of the bottom sheet
        this.setState({ visible: !this.state.visible });
    };
    _pickImagefromCamera = async () => {

        try {
            let result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });
            if (!result.cancelled) {
                this.setState({ avatar: result.uri });
            }

            console.log(result);
        } catch (E) {
            console.log(E);
        }
    };
    _pickImagefromGallery = async () => {
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });
            if (!result.cancelled) {
                this.setState({ avatar: result.uri });
            }

            console.log(result);
        } catch (E) {
            console.log(E);
        }
    }
    async componentDidMount() {
        await Font.loadAsync({
            'Roboto': require('native-base/Fonts/Roboto.ttf'),
            'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
            ...Ionicons.font,
        })
        this.setState({ loading: false })
    }
    GroupHandler = () => {
        if (!this.state.groupname) {
            alert('enter group name to navigate to next page')
        } else {
            this.state.passparam.push({ groupname: this.state.groupname , avatar: this.state.avatar,grouppassword: this.state.password })
            this.props.navigation.navigate('adduser', { data: this.state.passparam});
            this.setState({groupname:'',avatar:"",password:""});
        }
    }
    render() {
        if (this.state.loading) {
            return (
                <Container></Container>
            );
        }
        return (
            <Container style={{backgroundColor:'black'}}>

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
                            <Title> Super Admin</Title>
                        </Body>
                        <Right>
                            <Button transparent onPress={() => this.props.navigation.goBack()} >
                                <Icon name='arrow-left' type='Feather' />
                            </Button>
                        </Right>
                    </Header>
                </View>
                <ScrollView>
                    <View style={{ margin: 25, }}>
                        <Text style={styles.title}>Create a NeW Group</Text>
                        <Avatarr
              rounded
              size={200}
              onAccessoryPress={this._toggleBottomNavigationView}
              showAccessory
              source={{
                uri: this.state.avatar == null ? 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.gkvITielFNQyvCU5ME77XwHaG4%26pid%3DApi&f=1' : (this.state.avatar)
              }}
              containerStyle={{ backgroundColor: "green", justifyContent: "center", alignSelf: 'center',marginTop:5 }}
            />
                        <Item rounded style={styles.item}>
                            <Input placeholder='Group Name Goes here'
                                onChangeText={(groupname) => this.setState({ groupname })}
                                value={this.state.groupname}
                                style={{color:"white"}}
                            />
                        </Item>
                        <Item rounded style={styles.item}>
                            <Input placeholder='Group password Goes here'
                                onChangeText={(password) => this.setState({ password })}
                                value={this.state.password}
                                style={{color:"white"}}
                            />
                        </Item>
                    </View>
                    <Button style={styles.button}
                        onPress={this.GroupHandler}
                    >
                        <Text>Next Step</Text>
                    </Button>
                </ScrollView>
                <BottomSheet
              visible={this.state.visible}
              onBackButtonPress={this._toggleBottomNavigationView}
              onBackdropPress={this._toggleBottomNavigationView}
            >
              <CardItem style={styles.bottomNavigationView}>
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text style={{ padding: 20, fontSize: 25, color: "white", fontWeight: 'bold' }}>
                    Select one
              </Text>
                  <TouchableOpacity onPress={this._pickImagefromGallery}>
                    <Avatar rounded icon={{ name: 'image', color: 'white', type: 'font-awesome' }} size={80} iconStyle={{ color: 'black' }}
                      overlayContainerStyle={{ backgroundColor: 'orange' }} containerStyle={{ marginLeft: 8, backgroundColor: 'red', marginBottom: 2 }}>
                    </Avatar>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={this._pickImagefromCamera}>
                    <Avatar rounded icon={{ name: 'camera', color: 'white', type: 'font-awesome' }} size={80} iconStyle={{ color: 'black' }}
                      overlayContainerStyle={{ backgroundColor: 'orange' }} containerStyle={{ marginLeft: 8, backgroundColor: 'red', marginBottom: 2 }}>
                    </Avatar>
                  </TouchableOpacity>
                </View>
              </CardItem>
            </BottomSheet>
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
        backgroundColor: '#0c0c',
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

    },
    screen: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#6b028d',
        textAlign: 'center',
      },
      logo: {
        width: 200,
        height: 200,
        alignSelf: "center",
      },
      fieldtitle: {
        color: 'white',
      },
      fieldinput: {
        color: 'white'
      },
      submission: {
        marginTop: 15,
        borderColor: null,
        borderBottomColor:null,
        borderRadius:null,
      },
      submit: {
        backgroundColor: 'black',
        borderRadius: 26,
        justifyContent: 'center',
        width: screenWidth - 100,
        alignSelf: 'center'
      },
      submittext: {
        color: 'white',
        textTransform: 'capitalize',
      },
      signup: {
        color: 'white',
        fontSize: 20
      },
      error: {
        color: 'red',
        fontWeight: 'bold',
        fontSize: 24,
      },
      MainContainer: {
        flex: 1,
        margin: 2,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: Platform.OS === 'ios' ? 20 : 0,
        backgroundColor: '#E0F7FA',
      },
      bottomNavigationView: {
        backgroundColor: '#0E043B',
        width: '100%',
        height: 250,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 23
      },
});