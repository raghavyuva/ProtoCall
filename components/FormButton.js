import React from "react";
import { StyleSheet, Text, View, Dimensions } from "react-native";
import { Button } from "react-native-paper";
import colors from "../config/colors";

const { width, height } = Dimensions.get("screen");

const FormButton = ({ modeValue, title, ...otherProps }) => {
  return (
    <Button
      mode={modeValue}
      style={styles.button}
      contentStyle={styles.buttonContainer}
      {...otherProps}
    >
      {title}
    </Button>
  );
};

export default FormButton;

const styles = StyleSheet.create({
  button: {
    marginTop: 10,
  },
  buttonContainer: {
    width: width / 2,
    height: height / 15,
    // color: colors.primary,
  },
});
