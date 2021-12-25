import React, { useEffect, useLayoutEffect, useState } from "react";
import { FlatList, Text, View, Image, TouchableHighlight, Pressable } from "react-native";
import styles from "./styles";
import MenuImage from "../../components/MenuImage/MenuImage";
import { getUserByEmail } from "../../data/MockDataAPI";
import { TextInput } from "react-native-gesture-handler";
import Firebase from "../../../firebaseConfig";
import AppButton from "../../components/AppButton/AppButton";
import firebase from "firebase";

export default function SearchScreen(props) {
  const { navigation } = props;

  const [email, setEmail] = useState("");
  const [user, setUser] = useState([]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <MenuImage
          onPress={() => {
            navigation.openDrawer();
          }}
        />
      ),
      headerTitle: () => (
        <View style={styles.searchContainer}>
          <Image style={styles.searchIcon} source={require("../../../assets/icons/search.png")} />
          <TextInput
            style={styles.searchInput}
            onChangeText={value=>setEmail(value)}
            value={email}
          />
          <AppButton onPress={()=>handleSearch()} title={<Image style={styles.searchIcon} source={require("../../../assets/icons/close.png")} />
        }/>

        </View>
      ),
      headerRight: () => <View />,
    });
  }, [email]);


  const handleSearch = () => {
    getUserByEmail(email).then((res)=>{
      setUser(res[0])
    })
  };

  const sendFriendRequest = () =>{
    firebase.firestore()
    .collection('users')
    .doc(user.id)
    .set(
      { friendRequests: [{id:firebase.auth().currentUser.uid, email:firebase.auth().currentUser.email }] },
      { merge: true }
    )
    
  }

  const onPressRecipe = (item) => {
    navigation.navigate("Recipe", { item });
  };


  return (
    <View style={styles.container}>

    <Text style={styles.title}>{user.email}</Text>
    <AppButton onPress={()=>sendFriendRequest()} title="Send Friend Request"/>

  </View>
  );
}
