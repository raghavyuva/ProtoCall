import React from "react";
import { StyleSheet, Text, View, Dimensions } from "react-native";
import { TextInput } from "react-native-paper";
import colors from "../config/colors";

const { width, height } = Dimensions.get("screen");

const FormInput = ({ labelName, ...otherProps }) => {
  return (
    <View>
      <TextInput
        label={labelName}
        style={styles.input}
        numberOfLines={1}
        {...otherProps}
      />
    </View>
  );
};

export default FormInput;

const styles = StyleSheet.create({
  input: {
    marginTop: 10,
    marginBottom: 10,
    width: width / 1.5,
    height: height / 15,
    color: colors.light,
  },
});
