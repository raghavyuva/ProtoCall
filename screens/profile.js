import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, View, Dimensions,TouchableOpacity } from 'react-native';
import { Container, Button, Card, CardItem, Left, ListItem, List, Body, Right, Thumbnail, Content, Header, Icon, Title, Item, Input, Text, Label } from 'native-base';
import { Constants, } from 'expo';
import * as Permissions from 'expo-permissions';
import * as Font from 'expo-font';
import { EvilIcons, AntDesign, FontAwesome, Entypo, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import Loading from '../components/Loading';
import { Avatar } from 'react-native-elements';
const TAB_BAR_HEIGHT = 20;
import * as firebase from 'firebase';
import { FlatList } from 'react-native-gesture-handler';
require('firebase/auth');
import { BottomSheet } from 'react-native-btr';
require('firebase/firestore');
const { width: screenWidth } = Dimensions.get('window');
export default class Profile extends React.Component {
    constructor(props) {
        super(props);
    }
    state = {
        searchText: "",
        isSelected: false,
        search_bar_enabled: false,
        loading: true,
        filteredData: [],
        data: [],
        avatar:null,

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
    toggling = () => {
        this.setState({ search_bar_enabled: !this.state.search_bar_enabled });
        this.setState({ searchText: "" });
        this.setState({ filteredData: "" })
    }
    get firestore() {
        return firebase.firestore()
    }
    get uid() {
        return (firebase.auth().currentUser || {}).uid
    }
    get timestamp() {
        return Date.now()
    }
    async componentDidMount() {
        const subscriber = firebase.firestore()
            .collection('users')
            .doc(this.uid)
            .onSnapshot(documentSnapshot => {
                let datarecieved = documentSnapshot.data();
                this.setState({ data: datarecieved })
            })
        this.setState({ loading: false })
    }

    render() {
        if (this.state.loading) {
            return (
                <Loading />
            );
        }
        return (
            <Container style={{ backgroundColor: 'black' }}>
                <View>
                    {this.state.search_bar_enabled == false ? (
                        <>
                            <Header style={{ backgroundColor: '#221f3b' }}>
                                <Left>
                                    <Button transparent onPress={()=>{
                  this.props.navigation.openDrawer();
                }}>
                                        <Icon name='menu' />
                                    </Button>
                                </Left>
                                <Body>
                                    <Title>Profile</Title>
                                </Body>
                                <Right>
                                    <Button transparent onPress={() => this.props.navigation.goBack()} >
                                        <Icon name='arrow-left' type='Feather' />
                                    </Button>
                                </Right>
                            </Header>
                        </>

                    ) : (
                            <Header searchBar rounded style={{ backgroundColor: '#221f3b' }}>
                                <Item>
                                    <Icon name="ios-search" />
                                    <Input placeholder="What you are looking for?" clearButtonMode='always' onChangeText={this.search} value={this.state.searchText} autoCapitalize='none' autoCorrect={false} />
                                    <Button transparent enable={this.state.enable} onPress={this.toggling}>
                                        <Entypo name="cross" size={26} color="red" />
                                    </Button>
                                </Item>
                                <Button transparent>
                                    <Text>Search</Text>
                                </Button>
                            </Header>
                        )
                    }

                </View>
                <Card style={{ backgroundColor: 'black' }}>
                    <CardItem style={{ backgroundColor: 'black' }}>
                        <Left>
                            <Avatar
                                rounded
                                source={{ uri: this.state.data.avatar }}
                                size='xlarge'
                                showAccessory
                                onAccessoryPress={this._toggleBottomNavigationView}
                            />
                            <Body>
                                <Text style={{ color: 'white', fontSize: 28, fontWeight: 'bold', }}>{this.state.data.displayName}</Text>

                            </Body>
                        </Left>

                    </CardItem>
                    <CardItem style={{ backgroundColor: "yellow" }}>
                        <Left>
                        <Entypo name="mail" size={24} color="black" />
                            <Text style={{ color: 'black', fontSize: 14, fontWeight: 'bold', }}>{this.state.data.email}</Text>
                        </Left>
                        <Button transparent style={{margin:3}}>
                        <FontAwesome name="volume-control-phone" size={24} color="black" /> 
                        <Text style={{ color: 'black', fontSize: 14, fontWeight: 'bold', }}>{this.state.data.number}</Text>
                        </Button>
                    </CardItem>
                </Card>
                <View>

                </View>
                <View style={{ backgroundColor: 'grey', position: 'absolute', bottom: 0, width: screenWidth }}>
                    <ListItem style={{ alignSelf: 'center' }}>
                        <Button style={{ alignSelf: 'center', justifyContent: 'center', alignContent: 'center', backgroundColor: 'black' }} onPress={() => {
                            firebase.auth().signOut();
                        }} >
                            <Text style={{ color: 'white', fontSize: 20, textAlign: 'center', textTransform: 'capitalize' }}> Logout </Text>
                        </Button>
                    </ListItem>
                </View >
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