import React, { useState, useContext, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  ImagePickerIOS,
  TouchableOpacity
} from "react-native";
import {
  GiftedChat,
  Bubble,
  Send,
  SystemMessage,
  Actions,
} from "react-native-gifted-chat";
import { Ionic } from '@expo/vector-icons';
import colors from "../config/colors";
import { IconButton } from "react-native-paper";
import { AuthContext } from "../navigation/AuthProvider";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
console.disableYellowBox = true;
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
  const uploadImage = async (uri) => {
    return new Promise(async (res, rej) => {
      const response = await fetch(uri);
      const blob = await response.blob();
      let upload = firebase.storage().ref(`images/${currentUser.uid}/${Date.now()}`).put(blob)
      upload.on(
        "state_changed",
        snapshot => { },
        err => {
          rej(err);
        },
        async () => {
          const url = await upload.snapshot.ref.getDownloadURL();
          res(url);
          console.log(url);
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
  const sendrr = async () => {

  };
  useEffect(() => {
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

  const handlePickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        base64: true,
      });

      uploadImage(result.uri)
    } catch (error) {
      console.log("Camera Permission error");
    }
  };

  const renderActions = () => {
    return (
      <View style={{ marginRight: 10, flexDirection: 'row' }}>
        <Actions
          options={{
            ["send Image"]: handlePickImage,
          }}
          icon={() => (
            <MaterialCommunityIcons
              name={"attachment"}
              size={20}
              color={colors.medium}
            />
          )}
          onSend={
            sendrr
          }
        />
      </View>

    );
  };

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
          <IconButton icon="send-circle" size={36} color={colors.primary} />
        </View>
      </Send>
    );
  };

  const scrollToBottomComponent = () => {
    return (
      <View style={styles.bottomComponentContainer}>
        <IconButton
          icon="chervron-double-down"
          size={36}
          color={colors.secondary}
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
        <ActivityIndicator size={"large"} color={colors.primary} />
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
      placeholder="Start Chatting..."
      showUserAvatar
      alwaysShowSend
      scrollToBottom
      renderChatEmpty={renderLoading}
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
});
