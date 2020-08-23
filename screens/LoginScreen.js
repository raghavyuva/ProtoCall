import React, { useState, useContext } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Title } from "react-native-paper";

import FormButton from "../components/FormButton";
import FormInput from "../components/FormInput";
import colors from "../config/colors";
import { AuthContext } from "../navigation/AuthProvider";

const LoginScreen = ({ navigation }) => {
  const { login } = useContext(AuthContext);
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
        title="Login"
        modeValue="contained"
        labelStyle={styles.loginButtonLabel}
        onPress={() => login(email, password)}
      />
      <FormButton
        title="New User! Signup"
        modeValue="text"
        uppercase={false}
        labelStyle={styles.navButtonText}
        onPress={() => navigation.navigate("Signup")}
      />
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.light,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  titleText: {
    fontSize: 24,
    marginBottom: 10,
  },
  loginButtonLabel: {
    fontSize: 20,
  },
  navButtonText: {
    fontSize: 16,
  },
});
