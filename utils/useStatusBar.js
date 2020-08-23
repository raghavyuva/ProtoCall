import React, { useCallback } from "react";
import { StyleSheet, Text, View, StatusBar } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

const useStatusBar = (style, animated = true) => {
  useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle(style, animated);
    }, [])
  );
};

export default useStatusBar;
