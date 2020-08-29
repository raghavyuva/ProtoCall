import React, { useState, useContext, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ActivityIndicator,
  ImagePickerIOS,
  TouchableOpacity,
  Dimensions,
  ImageBackground
} from "react-native";
import {
  GiftedChat,
  Bubble,
  Send,
  SystemMessage,
  Actions,
} from "react-native-gifted-chat";
import { Video, Audio } from 'expo-av';
import { CardItem } from 'native-base';
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
import { Avatar } from 'react-native-elements';
import { BottomSheet } from 'react-native-btr';
import { Ionic, MaterialIcons } from '@expo/vector-icons';
import colors from "../config/colors";
import { IconButton, } from "react-native-paper";
import { AuthContext } from "../navigation/AuthProvider";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
console.disableYellowBox = true;
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import { firebase } from '../components/firebase'
import useStatusBar from "../utils/useStatusBar";
import 'firebase/auth';
import 'firebase/firestore';
require('firebase/storage');
const RoomScreen = ({ route }) => {
  useStatusBar("light-content");
  const { user } = useContext(AuthContext);
  const currentUser = user.toJSON();
  const { thread } = route.params;
  const [messages, setMessages] = useState([]);
  const [imagePicked, setImagePicked] = useState();
  const [visible, setVisible] = useState();
  const [videoPicked, setVideoPicked] = useState();
  const [AudioPicked, setAudioPicked] = useState();
  const [admin,setAdmin] = useState(false);
  const Super = currentUser.email;
  // const [messages, setMessages] = useState([
  //   {
  //     _id: 0,
  //     text: "New Room Created",
  //     createdAt: new Date().getTime(),
  //     system: true,
  //   },
  //   {
  //     _id: 1,
  //     text: "Hello Guys",
  //     createdAt: new Date().getTime(),
  //     user: {
  //       _id: 2,
  //       name: "Test User",
  //     },
  //   },
  // ]);

  // const handleSend = (newMessage = []) => {
  //   setMessages(GiftedChat.append(messages, newMessage));
  // };
  const renderMessageVideo = (props) => {
    const { currentMessage } = props;
    return (
      <View style={{ padding: 20 }}>
        <Video
          useNativeControls
          shouldPlay={false}
          source={{ uri: currentMessage.video }}
          style={styles.video}
          accessibilityViewIsModal
        />
      </View>
    );
  };

  const handleSend = async (messages) => {
    const text = messages[0].text;
    firebase
      .firestore()
      .collection("THREADS")
      .doc(thread._id)
      .collection("MESSAGES")
      .add({
        text,
        createdAt: new Date().getTime(),
        user: {
          _id: currentUser.uid,
          email: currentUser.email,
        },
      });
    await firebase
      .firestore()
      .collection("THREADS")
      .doc(thread._id)
      .set(
        {
          latestMessage: {
            text,
            createdAt: new Date().getTime(),
          },
        },
        { merge: true }
      );
  };
  const _toggleBottomNavigationView = () => {
    setVisible(!visible);
  };
  const uploadImage = async (uri) => {
    return new Promise(async (res, rej) => {
      const response = await fetch(uri);
      const blob = await response.blob();
      let upload = firebase.storage().ref(`images/${currentUser.uid}/${Date.now()}`).put(blob)
      upload.on(
        "state_changed",
        snapshot => {
          setImagePicked(uri);
        },
        err => {
          rej(err);
        },
        async () => {
          const url = await upload.snapshot.ref.getDownloadURL();
          res(url);
          console.log(url);
          setImagePicked(null);
          firebase.firestore().collection('THREADS').doc(thread._id).collection('MESSAGES').add({
            image: url,
            createdAt: new Date().getTime(),
            user: {
              _id: currentUser.uid,
              email: currentUser.email,
            }
          })
          await firebase
            .firestore()
            .collection("THREADS")
            .doc(thread._id)
            .set(
              {
                latestMessage: {
                  image,
                  createdAt: new Date().getTime(),
                },
              },
              { merge: true }
            );
        })
    })
  }
  const uploadvideo = async (uri) => {
    return new Promise(async (res, rej) => {
      const response = await fetch(uri);
      const blob = await response.blob();
      let upload = firebase.storage().ref(`videos/${currentUser.uid}/${Date.now()}`).put(blob)
      upload.on(
        "state_changed",
        snapshot => {
          setVideoPicked(uri);
        },
        err => {
          rej(err);
        },
        async () => {
          const url = await upload.snapshot.ref.getDownloadURL();
          res(url);
          console.log(url);
          setVideoPicked(null);
          firebase.firestore().collection('THREADS').doc(thread._id).collection('MESSAGES').add({
            video: url,
            createdAt: new Date().getTime(),
            user: {
              _id: currentUser.uid,
              email: currentUser.email,
            }
          })
          await firebase
            .firestore()
            .collection("THREADS")
            .doc(thread._id)
            .set(
              {
                latestMessage: {
                  video,
                  createdAt: new Date().getTime(),
                },
              },
              { merge: true }
            );
        })
    });
  }
  const uploadAudio = async (uri) => {
//function for audio uploading
  }
  const _pickAudio = async () => {
    //pick audio and upload function to pass an uri,
  }
  useEffect(() => {
    if (Super == 'super@admin.com') {
      setAdmin(true)
    }
    const messagesListener = firebase
      .firestore()
      .collection("THREADS")
      .doc(thread._id)
      .collection("MESSAGES")
      .orderBy("createdAt", "desc")
      .onSnapshot((querySnapshot) => {
        const messages = querySnapshot.docs.map((doc) => {
          const firebaseData = doc.data();

          const data = {
            _id: doc.id,
            text: "",
            createdAt: new Date().getTime(),
            ...firebaseData,
          };
          if (!firebaseData.system) {
            data.user = {
              ...firebaseData.user,
              name: firebaseData.user.email,
            };
          }
          return data;
        });
        setMessages(messages);
      });
    return () => messagesListener();

  }, []);
  const ImagePickerComponent = async () => {
    const result = await ImagePicker.requestCameraRollPermissionsAsync();
    if (!result.granted) {
      alert("You need to enable camera");
    }
  };
  useEffect(() => {
    ImagePickerComponent();
  }, []);

  const _pickImagefromGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        base64: true,
        allowsEditing: true,
      });
      uploadImage(result.uri)
    } catch (error) {
      console.log("Camera Permission error");
      alert('something went wrong contact developer');
    }
  };
  const _pickImagefromCamera = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        base64: true,
        allowsEditing: true,
      });
      uploadImage(result.uri)
    } catch (error) {
      console.log("Camera Permission error");
      alert('something went wrong contact developer');
    }
  };
  const renderActions = () => {
    return (
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity onPress={_toggleBottomNavigationView}>
        <Avatar rounded icon={{ name: 'link', color: 'white', type:'material-community-icons' }} size={40} iconStyle={{ color: 'black' }}
                    overlayContainerStyle={{ backgroundColor: colors.primary }} containerStyle={{ marginLeft: 8, backgroundColor: 'red',marginBottom:2 }}>
                  </Avatar>
        </TouchableOpacity>
        <TouchableOpacity onPress={_pickImagefromCamera}>
                  <Avatar rounded icon={{ name: 'camera', color: 'white', type: 'font-awesome' }} size={40} iconStyle={{ color: 'black' }}
                    overlayContainerStyle={{ backgroundColor: colors.primary }} containerStyle={{ marginLeft: 8, backgroundColor: 'red',marginBottom:2 }}>
                  </Avatar>
                </TouchableOpacity>
        {imagePicked == null ? (
          <Text></Text>
        ) : (
            <View>
              <Image source={{ uri: imagePicked }} style={{ width: 200, height: 20, }} />
            </View>
          )
        }
        {videoPicked == null ? (
          <Text></Text>
        ) : (
            <Video source={{ uri: videoPicked }} style={{ width: 100, height: 50 }} />
          )}
        {AudioPicked == null ? (
          <Text></Text>
        ) : (
            <Audio source={{ uri: AudioPicked }} style={{ width: 100, height: 100 }} />
          )}
        <BottomSheet
          visible={visible}
          onBackButtonPress={_toggleBottomNavigationView}
          onBackdropPress={_toggleBottomNavigationView}
        >
          <CardItem style={styles.bottomNavigationView}>
            <View
              style={{
                flex: 1,
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}>
              <Text style={{ padding: 20, fontSize: 25, color: "white", fontWeight: 'bold' }}>
                Select one
              </Text>
              <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity onPress={_pickImagefromGallery}>
                  <Avatar rounded icon={{ name: 'image', color: 'black', type: 'font-awesome' }} size={60} iconStyle={{ color: 'black' }}
                    overlayContainerStyle={{ backgroundColor: 'orange' }} containerStyle={{ marginLeft: 2, backgroundColor: 'red' }}>
                  </Avatar>
                </TouchableOpacity>
                {/*
                <TouchableOpacity >
                  <Avatar rounded icon={{ name: 'file', color: 'black', type: 'font-awesome' }} size={60} iconStyle={{ color: 'black' }}
                    overlayContainerStyle={{ backgroundColor: 'orange' }} containerStyle={{ marginLeft: 8, backgroundColor: 'red' }}>
                  </Avatar>
                </TouchableOpacity>
                <TouchableOpacity >
                  <Avatar rounded icon={{ name: 'music', color: 'black', type: 'font-awesome' }} size={60} iconStyle={{ color: 'black' }}
                    overlayContainerStyle={{ backgroundColor: 'orange' }} containerStyle={{ marginLeft: 8, backgroundColor: 'red' }}>
                  </Avatar>
                </TouchableOpacity>
                */}
                <TouchableOpacity onPress={_pickVideo}>
                  <Avatar rounded icon={{ name: 'video-camera', color: 'black', type: 'font-awesome' }} size={60} iconStyle={{ color: 'black' }}
                    overlayContainerStyle={{ backgroundColor: 'orange' }} containerStyle={{ marginLeft: 8, backgroundColor: 'red' }}>
                  </Avatar>
                </TouchableOpacity>
              </View>
            </View>
          </CardItem>
        </BottomSheet>
      </View>

    );
  };
  const _pickVideo = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        base64: true,
      });
      uploadvideo(result.uri)
    } catch (error) {
      console.log("Camera Permission error");
      alert('something went wrong contact developer');
    }
  }
  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: colors.secondary,
          },
        }}
        textStyle={{
          right: {
            color: colors.white,
          },
        }}
      />
    );
  };
  const renderSend = (props) => {
    return (
      <Send {...props}>
        <View style={styles.sendingContainer}>
        <Avatar rounded icon={{ name: 'send', color: 'white', type: 'entyp' }} size={40} iconStyle={{ color: 'black' }}
                    overlayContainerStyle={{ backgroundColor: colors.primary }} containerStyle={{ marginRight: 8, backgroundColor: 'red',marginBottom:2 }}>
                  </Avatar>
        </View>
      </Send>
    );
  };

  const scrollToBottomComponent = () => {
    return (
      <View style={styles.bottomComponentContainer}>
        <IconButton
          icon="arrow-down"
          size={36}
          color='black'
          style={{backgroundColor:'red'}}
        />
      </View>
    );
  };

  const renderSystemMessage = (props) => {
    return (
      <SystemMessage
        {...props}
        wrapperStyle={styles.systemMessageWrapper}
        textStyle={styles.systemMessageText}
      />
    );
  };

  const renderLoading = () => {
    return (
      <View style={styles.loadingContainer}>
      <ActivityIndicator size={100} color={colors.primary} />
    </View>
    );
  };


  return (
    <GiftedChat
      messages={messages}
      //onSend={(newMessage) => handleSend(newMessage)}
      onSend={handleSend}
      //user={{ _id: 1, name: "User Test" }}
      user={{ _id: currentUser.uid }}
      renderBubble={renderBubble}
      renderSend={renderSend}
      renderActions={renderActions}
      scrollToBottomComponent={scrollToBottomComponent}
      renderLoading={renderLoading}
      renderSystemMessage={renderSystemMessage}
      placeholder="Type your message..."
      renderMessageVideo={renderMessageVideo}
      showUserAvatar
      alwaysShowSend
      scrollToBottom
      textInputProps
      renderChatEmpty={renderLoading}
      renderUsernameOnMessage={admin}
    />
  );
};

export default RoomScreen;

const styles = StyleSheet.create({
  sendingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  bottomComponentContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  systemMessageText: {
    fontSize: 14,
    color: colors.medium,
    fontWeight: "100",
  },
  screen: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#0E043B',
    textAlign: 'center',
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
    borderRadius: 15
  },
  logo: {
    fontSize: 24,
    textAlign: 'center',
    color: 'yellow',
  },
  card: {
    backgroundColor: '#0E043B',
    height: screenHeight
  },
  fieldtitle: {
    color: 'white',
  },
  fieldinput: {
    color: 'yellow',
    width: screenWidth - 60,
  },
  submission: {
    marginTop: 15,
    borderColor: null,
  },
  submit: {
    backgroundColor: '#5F7',
    borderRadius: 26,
    width: 170,
    justifyContent: 'center'
  },
  submittext: {
    color: 'black',
    textTransform: 'capitalize',
  },
  signup: {
    color: 'red',
    fontSize: 20
  },
  fieldtitl: {
    color: '#FFF',
    borderColor: null,
  },
  video: {
    width: screenWidth - 100,
    height: 300,
  }
});
