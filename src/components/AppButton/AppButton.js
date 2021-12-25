import React from 'react';
import { View, Button, StyleSheet, TouchableOpacity, Text } from "react-native";

const AppButton = ({ onPress, title,disabled }) => (
  <TouchableOpacity onPress={onPress} style={styles.appButtonContainer} disabled={disabled}>
    <Text style={styles.appButtonText}>{title}</Text>
  </TouchableOpacity>
);

export default AppButton;

const styles = StyleSheet.create({
  // ...
  appButtonContainer: {
    elevation: 8,
    backgroundColor: "#009688",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginVertical:6
  },
  appButtonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    alignSelf: "center",
    textTransform: "uppercase"
  }
});