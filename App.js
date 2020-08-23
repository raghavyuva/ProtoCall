import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import AuthContainer from "./navigation/AuthContainer";

import colors from "./config/colors";
import Providers from "./navigation";

export default function App() {
  return <Providers />;
}
