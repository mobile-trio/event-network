import React from "react";
import { TouchableHighlight, Image, } from "react-native";
import PropTypes from "prop-types";
import styles from "./styles";
import { Ionicons } from '@expo/vector-icons'; 
import { MaterialIcons } from '@expo/vector-icons';

export default function DeleteButton(props) {
  return (
    <TouchableHighlight onPress={props.onPress} style={styles.btnContainer}>
      <MaterialIcons name="delete-outline" size={17} color="red" />
    </TouchableHighlight>
  );
}

