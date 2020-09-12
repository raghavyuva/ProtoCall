import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";

import LoginScreen from "../screens/LoginScreen";
import SignupScreen from "../screens/SignupScreen";
import Welcome from "../screens/welcome";

const Stack = createStackNavigator();

const AuthContainer = () => {
  return (
    <Stack.Navigator initialRouteName="welcome" headerMode="none">
      <Stack.Screen name='welcome' component={Welcome}/>
            <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
    </Stack.Navigator>
  );
};

export default AuthContainer;
