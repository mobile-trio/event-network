import React,{useState} from "react";
import { View } from "react-native";
import PropTypes from "prop-types";
import styles from "./styles";
import MenuButton from "../../components/MenuButton/MenuButton";
import firebase from 'firebase';
import { MaterialIcons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons'; 

export default function DrawerContainer(props) {
  const { navigation } = props;
  const [user, setUser] = useState()
  firebase.auth().onAuthStateChanged( (currentUser) => {
    setUser(currentUser)
  })
  return (
    <View style={styles.content}>
      <View style={styles.container}>
        <MenuButton
          title="HOME"
          onPress={() => {
            navigation.navigate("Home");
            navigation.closeDrawer();
          }}><MaterialIcons name="home" size={24} color="black" /></MenuButton>
        {user&&<MenuButton
          title="EVENT ADD"
          onPress={() => {
            navigation.navigate("Event Add");
            navigation.closeDrawer();
          }}
        ><MaterialIcons name="event" size={24} color="black" /></MenuButton>}
        {user&&<MenuButton
          title="SEARCH"
          onPress={() => {
            navigation.navigate("Search");
            navigation.closeDrawer();
          }}
        ><MaterialIcons name="search" size={24} color="black" /></MenuButton>}
        {!user&&

        <MenuButton
          title="LOGIN"
          onPress={() => {
            navigation.navigate("Login");
            navigation.closeDrawer();
          }}
        ><MaterialIcons name="event" size={24} color="black" /></MenuButton>
        }
      {!user&&
        <MenuButton
          title="REGISTER"
          onPress={() => {
            navigation.navigate("Register");
            navigation.closeDrawer();
          }}
        ><MaterialIcons name="event" size={24} color="black" /></MenuButton>
      }
      {user&&
      <MenuButton
          title="PROFILE"
          onPress={() => {
            navigation.navigate("Profile");
            navigation.closeDrawer();
          }}
        ><FontAwesome name="user-circle-o" size={24} color="black" /></MenuButton>
        }
      {user&&
      <MenuButton
          title="Logout"
          onPress={() => {
            firebase.auth().signOut()
          }}
        ><MaterialIcons name="logout" size={24} color="black" /></MenuButton>}
      </View>
    </View>
  );
}

DrawerContainer.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }),
};
