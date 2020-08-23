import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import FormButton from "../components/FormButton";
import FormInput from "../components/FormInput";
import { IconButton, Title } from "react-native-paper";
import colors from "../config/colors";
import { firebase } from "../components/firebase";
import useStatusBar from "../utils/useStatusBar";

const AddRoomScreen = ({ navigation }) => {
  useStatusBar("dark-content");
  const [roomName, setRoomName] = useState("");

  const handleButtonPress = () => {
    if (roomName.length > 0) {
      firebase
        .firestore()
        .collection("THREADS")
        .add({
          name: roomName,
          latestMessage: {
            text: `You have Created the Group  ${roomName}`,
            createdAt: new Date().getTime(),
          },
        })
        .then((docRef) => {
          docRef.collection("MESSAGES").add({
            text: `You have joined the Group ${roomName}`,
            createdAt: new Date().getTime(),
            system: true,
          });

          navigation.navigate("Home");
        });
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.closeButtonContainer}>
        <IconButton
          icon="close-circle"
          size={36}
          color={colors.secondary}
          onPress={() => navigation.goBack()}
        />
      </View>
      <View style={styles.innerContainer}>
        <Title style={styles.title}> Create a new Chat Room</Title>
        <FormInput
          labelName="Room Name"
          value={roomName}
          onChangeText={(text) => setRoomName(text)}
          clearButtonMode="while-editing"
        />
        <FormButton
          title="Create"
          modeValue="contained"
          labelStyle={styles.buttonLabel}
          onPress={() => handleButtonPress()}
          disabled={roomName.length === 0}
        />
      </View>
    </View>
  );
};

export default AddRoomScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  closeButtonContainer: {
    position: "absolute",
    top: 30,
    right: 0,
    zIndex: 1,
  },
  innerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
  },
  buttonLabel: {
    fontSize: 22,
  },
});
