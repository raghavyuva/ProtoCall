import React from "react";
import { StyleSheet, Text, View, ActivityIndicator } from "react-native";
import colors from "../config/colors";

const Loading = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
};

export default Loading;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
