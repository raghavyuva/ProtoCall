import React from "react";
import { StyleSheet, Text, View, ActivityIndicator,ImageBackground } from "react-native";
import colors from "../config/colors";

const Loading = () => {
  return (
    <View style={styles.container}>
<ImageBackground source={require('../assets/logo.png')} style={{width:200,height:200,marginTop:50}}>
      <ActivityIndicator size='large' color={colors.primary} />
      </ImageBackground>
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
