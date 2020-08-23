import React, { useState, useContext } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Title, IconButton } from "react-native-paper";

import FormButton from "../components/FormButton";
import FormInput from "../components/FormInput";
import colors from "../config/colors";
import { AuthContext } from "../navigation/AuthProvider";

const SignupScreen = ({ navigation }) => {
  const { register } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <View style={styles.container}>
      <Title style={styles.titleText}> Welcome to Chat App</Title>
      <FormInput
        labelName="Email"
        value={email}
        autoCapitalize="none"
        onChangeText={(userEmail) => setEmail(userEmail)}
      />
      <FormInput
        labelName="Password"
        value={password}
        secureTextEntry
        autoCapitalize="none"
        onChangeText={(userPassword) => setPassword(userPassword)}
      />
      <FormButton
        title="Signup"
        modeValue="contained"
        labelStyle={styles.loginButtonLabel}
        onPress={() => register(email, password)}
      />
      <IconButton
        icon="keyboard-backspace"
        size={30}
        style={styles.navButton}
        color={colors.primary}
        onPress={() => navigation.goBack()}
      />
    </View>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.light,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  titleText: {
    fontSize: 24,
    marginBottom: 10,
  },
  loginButtonLabel: {
    fontSize: 22,
  },
  navButtonText: {
    fontSize: 16,
  },
});
