import React, { useEffect, useLayoutEffect, useState } from "react";
import { FlatList, Text, View, Image, TouchableHighlight, Pressable } from "react-native";
import styles from "./styles";
import MenuImage from "../../components/MenuImage/MenuImage";
import { getUserByEmail } from "../../data/MockDataAPI";
import { TextInput } from "react-native-gesture-handler";
import AppButton from "../../components/AppButton/AppButton";
import firebase from "firebase";
import { MaterialIcons } from '@expo/vector-icons';

export default function SearchScreen(props) {
  const { navigation } = props;

  const [email, setEmail] = useState("");
  const [user, setUser] = useState();

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
          <TextInput
            style={styles.searchInput}
            placeholder="Search your friends email"
            onChangeText={value => setEmail(value)}
            value={email}
          />
          <AppButton onPress={() => handleSearch()} title={
            <MaterialIcons name="search" size={24} color="white" />
          } />

        </View>
      ),
      headerRight: () => <View />,
    });
  }, [email]);


  const handleSearch = () => {
    getUserByEmail(email).then((res) => {
      setUser(res[0])
      console.log(user)
    })
  };

  const sendFriendRequest = () => {
    firebase.firestore()
      .collection('users')
      .doc(user.id)
      .set(
        { friendRequests: [{ id: firebase.auth().currentUser.uid, email: firebase.auth().currentUser.email }] },
        { merge: true }
      )

  }

  return (
    <View style={{flex:1, margin: 36}}>
      {
        user && 
        <View >
          <Text style={{color:"black",fontSize:20,fontWeight:"bold", textAlign:"center"}}>{user.email}</Text>
          <AppButton onPress={() => sendFriendRequest()} title="SEND FRIEND REQUEST" />
        </View>
      }
    </View>
  );
}
