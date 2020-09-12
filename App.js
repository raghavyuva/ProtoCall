import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View ,Dimensions} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import AuthContainer from "./navigation/AuthContainer";
import * as Font from 'expo-font';
const { width: screenWidth } = Dimensions.get('window');
import { Ionicons, AntDesign } from '@expo/vector-icons';
import * as firebase from 'firebase';
import colors from "./config/colors";
import Providers from "./navigation";
import Loading from "./components/Loading";
export default function App() {
  const [loading,setLoading] = useState(true);
  useEffect(()=>{
    Font.loadAsync({
      'Roboto': require('native-base/Fonts/Roboto.ttf'),
      'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
      ...Ionicons.font,
  })
   setLoading(false);
  })
  if (loading) {
    <Loading/>
  }
  return <Providers />;
}
