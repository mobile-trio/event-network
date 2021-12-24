import React,{useState} from "react";
import { View } from "react-native";
import PropTypes from "prop-types";
import styles from "./styles";
import MenuButton from "../../components/MenuButton/MenuButton";
import Firebase from '../../../firebaseConfig';

export default function DrawerContainer(props) {
  const { navigation } = props;
  const [user, setUser] = useState()
  Firebase.auth().onAuthStateChanged( (currentUser) => {
    setUser(currentUser)
  })
  return (
    <View style={styles.content}>
      <View style={styles.container}>
        <MenuButton
          title="HOME"
          source={require("../../../assets/icons/home.png")}
          onPress={() => {
            navigation.navigate("Home");
            navigation.closeDrawer();
          }}
        />
        <MenuButton
          title="EVENT ADD"
          source={require("../../../assets/icons/home.png")}
          onPress={() => {
            navigation.navigate("Event Add");
            navigation.closeDrawer();
          }}
        />
        <MenuButton
          title="CATEGORIES"
          source={require("../../../assets/icons/category.png")}
          onPress={() => {
            navigation.navigate("Categories");
            navigation.closeDrawer();
          }}
        />
        <MenuButton
          title="SEARCH"
          source={require("../../../assets/icons/search.png")}
          onPress={() => {
            navigation.navigate("Search");
            navigation.closeDrawer();
          }}
        />
        {!Firebase.auth().currentUser&&

        <MenuButton
          title="LOGIN"
          source={require("../../../assets/icons/home.png")}
          onPress={() => {
            navigation.navigate("Login");
            navigation.closeDrawer();
          }}
        />
        }
      {!user&&
        <MenuButton
          title="REGISTER"
          source={require("../../../assets/icons/home.png")}
          onPress={() => {
            navigation.navigate("Register");
            navigation.closeDrawer();
          }}
        />
      }
      {user&&
      <MenuButton
          title="PROFILE"
          source={require("../../../assets/icons/home.png")}
          onPress={() => {
            navigation.navigate("Profile");
            navigation.closeDrawer();
          }}
        />}
      {user&&
      <MenuButton
          title="Logout"
          source={require("../../../assets/icons/home.png")}
          onPress={() => {
            Firebase.auth().signOut()
          }}
        />}
      </View>
    </View>
  );
}

DrawerContainer.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }),
};
