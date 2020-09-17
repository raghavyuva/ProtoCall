import React, { Component } from 'react';
import {
  ImageBackground,
  SafeAreaView, StyleSheet, Dimensions, FlatList, TextInput, AsyncStorage, Alert, TouchableOpacity,Modal,TouchableWithoutFeedback
} from 'react-native';
import { Container, Header, Content, Item, Input, Button, Text, View, Thumbnail, Card, Form, Label, CardItem, ActionSheet,Icon } from 'native-base';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { ListItem, Avatar as Avatarr, Tooltip, Paragraph, Caption } from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import { BottomSheet } from 'react-native-btr';
'use strict';
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
import * as firebase from 'firebase';
import { Avatar } from 'react-native-elements';
import data from './countries';
const defaultFlag = data.filter(
  obj => obj.name === 'India'
  )[0].flag
export default class Signuppage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {
        email: "",
        pass: '',
        username: '',
        avatar: null,
      },
      errorm: null,
      flag: defaultFlag,
    modalVisible: false,
    phoneNumber: '',

    };
  }

  state = {
    loading: true,
    visible: false,
  }
  onChangeText(key, value) {
    this.setState({
      [key]: value
    })
  }
  showModal() {
    this.setState({ modalVisible: true })
  }
  hideModal() {
    this.setState({ modalVisible: false })
    // Refocus on the Input field after selecting the country code
    this.refs.PhoneInput._root.focus()
  }
  async getCountry(country) {
    const countryData = await data
    try {
      const countryCode = await countryData.filter(
        obj => obj.name === country
      )[0].dial_code
      const countryFlag = await countryData.filter(
        obj => obj.name === country
      )[0].flag
      // Set data from user choice of country
      this.setState({ phoneNumber: countryCode, flag: countryFlag })
      await this.hideModal()
    }
    catch (err) {
      console.log(err)
    }
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
        this.setState({ user: { ...this.state.user, avatar: result.uri } });
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
        this.setState({ user: { ...this.state.user, avatar: result.uri } });
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
  onSignupPress = async () => {
    if (!this.state.user.avatar || !this.state.user.username) {
      alert('sorry you can\'t leave any of the fields');
    } else {
      if (this.state.phoneNumber.length == 13) {
        let remoteUri = null
        try {
          await firebase.auth().createUserWithEmailAndPassword(this.state.user.email, this.state.user.pass)
          let db = this.firestore.collection('users').doc(this.uid)
    
          db.set({
            displayName: this.state.user.username,
            email: this.state.user.email,
            number: this.state.phoneNumber,
            avatar: null,
          })
          if (this.state.user.avatar !== null) {
            remoteUri = await this.uploadPhotoAsync(this.state.user.avatar, `avatars/${this.uid}`)
            db.set({ avatar: remoteUri }, { merge: true })
          }
        }
        catch (error) {
          alert(error);
        }
      }
    else{
      alert('phone number must be valid one')
    }

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
  onloginpress = () => {
    this.props.navigation.navigate('Login');
  }
  render() {
    let { flag } = this.state
    const countryData = data
    if (this.state.loading) {
      return (
        <Container></Container>
      );
    }
    return (
      <Container style={styles.screen}>
        <Content>
          <Card style={styles.card}>
            <CardItem style={{ backgroundColor: 'yellow', }}></CardItem>
            <Avatarr
              rounded
              size={200}
              onAccessoryPress={this._toggleBottomNavigationView}
              showAccessory
              source={{
                uri: this.state.user.avatar == null ? 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse3.mm.bing.net%2Fth%3Fid%3DOIP.cffx9-JeWKLRNjDccUDTigHaFj%26pid%3DApi&f=1' : (this.state.user.avatar)
              }}
              containerStyle={{ backgroundColor: "green", justifyContent: "center", alignSelf: 'center',marginTop:5 }}
            />
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
            <Form ref="form"  >

              <Item stackedLabel>
                <Label style={styles.fieldtitle} >Username</Label>
                <Input style={styles.fieldinput} onChangeText={(username) => this.setState({ user: { ...this.state.user, username } })} value={this.state.user.username} />
              </Item>

              <Item stackedLabel>
                <Label style={styles.fieldtitle} >Email Address</Label>
                <Input style={styles.fieldinput} onChangeText={(email) => this.setState({ user: { ...this.state.user, email } })} value={this.state.user.email} />

              </Item>
              <View style={styles.container}>
                  <Item >
                 
                    <View>
                      <TouchableOpacity  onPress={() => this.showModal()}>
                      <Text style={{fontSize: 40}}>{flag}</Text>
                      </TouchableOpacity>
                      </View>
                    <Input
                     style={styles.fieldinput}
                      placeholder='7665544338'
                      placeholderTextColor='#adb4bc'
                      keyboardType={'phone-pad'}
                      returnKeyType='done'
                      autoCapitalize='none'
                      autoCorrect={false}
                      secureTextEntry={false}
                      ref='PhoneInput'
                      value={this.state.phoneNumber}
                      onChangeText={(val) => {
                        if (this.state.phoneNumber===''){
                          this.onChangeText('phoneNumber', '+91', + val)
                        } else {
                          this.onChangeText('phoneNumber', val)
                        }}
                      }
                    />
                    <Modal
                      animationType="slide" 
                      transparent={false}
                      visible={this.state.modalVisible}>
                      <View style={{ flex: 1,}}>
                        <View style={{ flex: 10, paddingTop: 10, backgroundColor: '#0e043b' }}>
                          <Text style={{fontSize: 24, color: '#fff'}}>Select Country</Text>
                          <View style={{ flex: 10, paddingTop: 10, backgroundColor: '#505' }}>
                          <FlatList
                            data={countryData}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={
                              ({ item }) =>
                                <TouchableWithoutFeedback 
                                  onPress={() => this.getCountry(item.name)}>
                                  <View 
                                    style={
                                      [
                                        styles.countryStyle, 
                                        {
                                          flexDirection: 'row', 
                                          alignItems: 'center',
                                          justifyContent: 'space-between'
                                        }
                                      ]
                                    }>
                                    <Text style={{fontSize: 45}}>
                                      {item.flag}
                                    </Text>
                                    <Text style={{fontSize: 20, color: '#fff'}}>
                                      {item.name} ({item.dial_code})
                                    </Text>
                                  </View>
                                </TouchableWithoutFeedback>
                            }
                          />
                          </View>
                        </View>
                        <TouchableOpacity
                          onPress={() => this.hideModal()} 
                          style={styles.closeButtonStyle}>
                          <Text style={styles.textStyle}>
                            Close
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </Modal>
                  </Item>
            </View>
              <Item stackedLabel>
                <Label style={styles.fieldtitle}>Password</Label>
                <Input style={styles.fieldinput} onChangeText={(pass) => this.setState({ user: { ...this.state.user, pass } })} value={this.state.user.pass} />
              </Item>
              {this.state.errorm && <Text style={styles.error}>{this.state.errorm}</Text>}
              <Item stackedLabel style={styles.submission}>
                <Button style={styles.submit} onPress={this.onSignupPress} ><Text style={styles.submittext}>sign up</Text></Button>
              </Item>
              <Item style={styles.fieldtitl} >
                <Label style={styles.fieldtitle}> Already a user? </Label>
                <TouchableOpacity><Text style={styles.signup} onPress={this.onloginpress} >Sign in</Text></TouchableOpacity>

              </Item>
            </Form>
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
    backgroundColor: '#0e043b',
    textAlign: 'center',
  },
  logo: {
    width: 200,
    height: 200,
    alignSelf: "center",
  },
  card: {
    marginTop: screenHeight - 750,
    backgroundColor: '#0e043b'
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
  textStyle: {
    padding: 5,
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold'
  },
  closeButtonStyle: {
    padding: 1,
    alignItems: 'center', 
    backgroundColor: '#0e043b',
  },
  input: {
    flex: 1,
    fontSize: 17,
    fontWeight: 'bold',
    color: '#fff',
  },


});