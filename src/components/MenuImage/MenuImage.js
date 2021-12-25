import React from "react";
import { TouchableOpacity, Image } from "react-native";
import PropTypes from "prop-types";
import styles from "./styles";
import { MaterialIcons } from '@expo/vector-icons';

export default function MenuImage(props) {
  return (
    <TouchableOpacity style={styles.headerButtonContainer} onPress={props.onPress}>
      <MaterialIcons name="menu" size={24} color="black" />
    </TouchableOpacity>
  );
}

MenuImage.propTypes = {
  onPress: PropTypes.func,
};
