import React, { Component } from 'react';
import {
  ImageBackground,
  SafeAreaView, StyleSheet, Dimensions, FlatList, TextInput, AsyncStorage, Alert, TouchableOpacity
} from 'react-native';
import { Container, Header, Content, Item, Input, Button, Text, View, Thumbnail, Card, Form, Label, CardItem, ActionSheet } from 'native-base';
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
export default class Signuppage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {
        email: "",
        pass: '',
        username: '',
        number: '',
        number: '',
        usn: '',
        avatar: null,
      },
      errorm: null,
    };
  }

  state = {
    loading: true,
    visible: false,
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

    let remoteUri = null
    try {
      await firebase.auth().createUserWithEmailAndPassword(this.state.user.email, this.state.user.pass)
      let db = this.firestore.collection('users').doc(this.uid)

      db.set({
        displayName: this.state.user.username,
        email: this.state.user.email,
        number: this.state.user.number,
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
              <Item stackedLabel>
                <Label style={styles.fieldtitle} >Phone Number</Label>
                <Input style={styles.fieldinput} onChangeText={(number) => this.setState({ user: { ...this.state.user, number } })} value={this.state.user.number} />
              </Item>

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
    backgroundColor: '#6b028d',
    textAlign: 'center',
  },
  logo: {
    width: 200,
    height: 200,
    alignSelf: "center",
  },
  card: {
    marginTop: screenHeight - 750,
    backgroundColor: '#b94c57'
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