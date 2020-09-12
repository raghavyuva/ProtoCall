import {StatusBar} from 'expo-status-bar';
import React from 'react';
import Constants from 'expo-constants';

import {
    StyleSheet,
    View,
    Dimensions,
    TouchableOpacity,
    ImageBackground,
    ActivityIndicator
} from 'react-native';
import {
    Container,
    Button,
    Card,
    CardItem,
    Left,
    ListItem,
    List,
    Body,
    Right,
    Thumbnail,
    Content,
    Header,
    Icon,
    Title,
    Item,
    Input,
    Text,
    Label
} from 'native-base';
import * as Permissions from 'expo-permissions';
import * as Font from 'expo-font';
import {
    EvilIcons,
    AntDesign,
    FontAwesome,
    Entypo,
    MaterialCommunityIcons,
    Ionicons
} from '@expo/vector-icons';
import Loading from '../components/Loading';
import {Avatar} from 'react-native-elements';
const TAB_BAR_HEIGHT = 20;
import * as firebase from 'firebase';
import {FlatList} from 'react-native-gesture-handler';
require('firebase/auth');
import {BottomSheet} from 'react-native-btr';
require('firebase/firestore');
const {width: screenWidth} = Dimensions.get('window');
import * as ImagePicker from 'expo-image-picker';

export default class Editprofile extends React.Component {
    constructor(props) {
        super(props);
    }
    state = {
        loading: true,
        visible: false,
        avatar:null,
        username:'',
        email:"",
        number:""
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
            this.setState({avatar:result.uri});
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
            this.setState({avatar:result.uri});
          }
    
          console.log(result);
        } catch (E) {
          console.log(E);
        }
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
      get firestore() {
        return firebase.firestore()
      }
      get uid() {
        return (firebase.auth().currentUser || {}).uid
      }
      get timestamp() {
        return Date.now()
      }
      updateusername=()=>{
       if (!this.state.username) {
           alert('enter username to update');
       } else {
           
       }
      }
      updateavatar =()=>{
          if (!this.state.avatar) {
            alert('Add photo  to update');
          } else {
              
          }
      }
    render() {
        return (
            <Container style={styles.screen}>
            <Content>

              <Card style={styles.card}>
              <Avatar
                                rounded
                                source={{ uri: this.state.avatar }}
                                size='xlarge'
                                showAccessory
                                onAccessoryPress={this._toggleBottomNavigationView}
                                containerStyle={{backgroundColor:'red',alignSelf:'center'}}
                            />
                                              <Item stackedLabel style={styles.submission}>
                    <Button style={styles.submit}  onPress={this.updateavatar}><Text style={styles.submittext}>Update Avatar</Text></Button>
                  </Item>
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
                  <Item stackedLabel>
                    <Label style={styles.fieldtitle} >Change username</Label>
                    <Input style={styles.fieldinput}  onChangeText={(username) => this.setState({username:username  })} value={this.state.username}/>
                  </Item>
                  <Item stackedLabel style={styles.submission}>
                    <Button style={styles.submit}  onPress={this.updateusername}><Text style={styles.submittext}>Update UserName</Text></Button>
                  </Item>
              </Card>
            </Content>
          </Container>
        );
    }
}

const styles = StyleSheet.create({
    screen: {
      flex: 1,
      justifyContent: 'center',
      backgroundColor: 'black',
      textAlign: 'center',
    },
    logo: {
      width: 200,
      height: 200,
      alignSelf: "center",
    },
    card: {
      marginTop: 100,
      backgroundColor: '#23f4'
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