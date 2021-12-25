import React, { useLayoutEffect, useEffect, useState } from "react";
import { ScrollView, Text, View, Image, Dimensions, TouchableHighlight, FlatList,Alert } from "react-native";
import styles from "./styles";

import DeleteButton from "../../components/DeleteButton/DeleteButton";
import BackButton from "../../components/BackButton/BackButton";
import { Entypo } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AppButton from "../../components/AppButton/AppButton";
import firebase from "firebase";


export default function EventScreen(props) {
  const { navigation, route } = props;
  const item = route.params?.item;
  const isPrivate = route.params?.isPrivate;
  const [isJoined, setIsJoined] = useState(false)

  const sendPrivateJoinRequest = (user) => {
    firebase.firestore()
      .collection('privateEvents')
      .doc(item.createdBy)
      .collection('userEvents')
      .doc(item.id)
      .set(
        { participants: [user] },
        { merge: true }
      ).then(
        setIsJoined(true)
      )
  }

  const sendPublicJoinRequest = (user) => {
    firebase.firestore()
      .collection('publicEvents')
      .doc(item.id)
      .set(
        { participants: [user] },
        { merge: true }
      ).then(
        setIsJoined(true)
      )
  }

  const sendPrivateUnjoinRequest = (user) => {
    firebase.firestore()
      .collection('privateEvents')
      .doc(item.createdBy)
      .collection('userEvents')
      .doc(item.id)
      .update({
        "participants": firebase.firestore.FieldValue.arrayRemove(user)
      }).then(
        setIsJoined(false)
      )
  }

  const sendPublicUnjoinRequest = (user) => {
    firebase.firestore()
      .collection('publicEvents')
      .doc(item.id)
      .update({
        "participants": firebase.firestore.FieldValue.arrayRemove(user)
      }).then(
        setIsJoined(false)
      )
  }

  const sendJoinRequest = () => {
    console.log(firebase.auth().currentUser)
    if (firebase.auth().currentUser !== null) {
      const user = { id: firebase.auth().currentUser.uid, email: firebase.auth().currentUser.email }
      console.log("joining")
      if (isJoined) {
        isPrivate ? sendPrivateUnjoinRequest(user) : sendPublicUnjoinRequest(user)
      } else {
        isPrivate ? sendPrivateJoinRequest(user) : sendPublicJoinRequest(user)
      }
    } else {
      navigation.navigate("Login");
    }

  }

  useEffect(() => {
    findIsJoined(item.participants)
  }, [])

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTransparent: "true",
      headerLeft: () => (
        <BackButton
          onPress={() => {
            navigation.goBack();
          }}
        />
      ),
      headerRight: () => {if(firebase.auth().currentUser?.uid==item.createdBy){
        return <DeleteButton
          onPress={() => {
            deleteEvent();
          }}
        />
      }else{
        <View></View>
      }

        }
      ,
    });
  }, []);

  const renderRecipes = ({ item }) => (
    <TouchableHighlight style={styles.infoContainer} >
      <View style={{ margin: 4 }}>
        <Text style={{ fontSize: 18 }}>{item.email}</Text>
      </View>
    </TouchableHighlight>
  );

  const successAlert = () =>
  Alert.alert('Event Created!', 'Event created succesfully', [
    { text: 'OK', onPress: () => console.log('OK Pressed') },
  ]);
  const errorAlert = () =>
  Alert.alert('Error', 'Someting went wrong', [
    { text: 'OK', onPress: () => console.log('OK Pressed') },
  ]);

  const deleteEvent = () => {
    isPrivate?deletePrivate():deletePublic()
  }

  const deletePrivate = () => {
    firebase.firestore()
    .collection('privateEvents')
    .doc(item.createdBy)
    .collection('userEvents')
    .doc(item.id)
    .delete()
    .then(
      successAlert(),

    ).catch(
      errorAlert()
    )
  }

  const deletePublic = () => {
    firebase.firestore()
    .collection('publicEvents')
    .doc(item.id)
    .delete()
    .then(
      successAlert(),
    ).catch(
      errorAlert()
    )
  }

  const findIsJoined = (vendors) => {
    var found = false;
    const uid = firebase.auth().currentUser?.uid
    if (vendors) {
      for (var i = 0; i < vendors.length; i++) {
        if (vendors[i].id == uid) {
          found = true;
          break;
        }
      }
    }

    console.log("finding")
    setIsJoined(found)
  }


  return (
    <ScrollView style={styles.container}>
      <View style={styles.carouselContainer}>
        <Image source={{ uri: item.imageURL }} style={{ minHeight: 250, borderRadius: 8, marginTop: 8, borderColor: "#009688" }} />
      </View>
      <View style={styles.infoRecipeContainer}>
        <Text style={styles.infoRecipeName}>{item.name}</Text>
        <View style={styles.infoContainer}>
          <MaterialIcons name="category" size={24} color="#009688" />
          <Text style={styles.infoRow}>{item.category}</Text>
        </View>
        <View style={styles.infoContainer}>
          <MaterialCommunityIcons name="calendar" size={24} color="#009688" />
          <Text style={styles.infoRow}>{item.datetime.toDate().toString()}</Text>
        </View>

        <View style={styles.infoContainer}>
          <Entypo name="location" size={24} color="#009688" />
          <Text style={styles.infoRow}>{item.location} </Text>
        </View>


        <View style={styles.infoContainer}>
          <MaterialIcons name="description" size={24} color="#009688" />
          <Text style={styles.infoRow}>{item.description}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Entypo name="user" size={24} color="#009688" />
          <Text style={styles.infoRow}>{item.createdByEmail}</Text>
        </View>


        <AppButton
          title={isJoined ? "Unjoin" : "Join"}
          onPress={() => sendJoinRequest()}
        />

        <Text style={{ fontSize: 20, color: "black", textAlign: "center", margin: 24, fontWeight: "bold" }}>
          Joined Users:
        </Text>

        <FlatList
          extraData={true}
          vertical
          showsVerticalScrollIndicator={false}
          numColumns={2}
          data={item.participants}
          renderItem={renderRecipes}
          keyExtractor={(item) => `${item.id}`} />


      </View>
    </ScrollView>
  );
}
