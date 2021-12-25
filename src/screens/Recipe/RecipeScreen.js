import React, { useLayoutEffect, useEffect, useState } from "react";
import { ScrollView, Text, View, Image, Dimensions, TouchableHighlight, FlatList } from "react-native";
import styles from "./styles";
import { getIngredientName, getCategoryName, getCategoryById } from "../../data/MockDataAPI";
import BackButton from "../../components/BackButton/BackButton";
import ViewIngredientsButton from "../../components/ViewIngredientsButton/ViewIngredientsButton";
import { Entypo } from '@expo/vector-icons'; 
import { MaterialIcons } from '@expo/vector-icons'; 
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import AppButton from "../../components/AppButton/AppButton";
import firebase from "firebase";


export default function RecipeScreen(props) {
  const { navigation, route } = props;

  const item = route.params?.item;

  const isPrivate = route.params?.isPrivate;

  const [isJoined, setIsJoined] = useState(false)

  const sendPrivateJoinRequest = () =>{
    firebase.firestore()
    .collection('privateEvents')
    .doc(item.userId)
    .collection('userEvents')
    .doc(item.id)
    .set(
      { participants: [{id:firebase.auth().currentUser.uid, email:firebase.auth().currentUser.email }] },
      { merge: true }
    ).then(
      setIsJoined(true)
    )
  }

  const sendPublicJoinRequest = () =>{
    firebase.firestore()
    .collection('publicEvents')
    .doc(item.id)
    .set(
      { participants: [{id:firebase.auth().currentUser.uid, email:firebase.auth().currentUser.email }] },
      { merge: true }
    ).then(
      setIsJoined(true)
    )
  }

  const sendPrivateUnjoinRequest = (value) =>{
    firebase.firestore()
    .collection('privateEvents')
    .doc(item.userId)
    .collection('userEvents')
    .doc(item.id)
    .update({
      "participants": firebase.firestore.FieldValue.arrayRemove({id:firebase.auth().currentUser.uid, email:firebase.auth().currentUser.email })
    }).then(
      setIsJoined(false)
    )
  }

  const sendPublicUnjoinRequest = () =>{
    firebase.firestore()
    .collection('publicEvents')
    .doc(item.id)
    .update({
      "participants": firebase.firestore.FieldValue.arrayRemove({id:firebase.auth().currentUser.uid, email:firebase.auth().currentUser.email })
    }).then(
      setIsJoined(false)
    )
  }

  const sendJoinRequest = () => {
    console.log("joining")
    if(isJoined){
      isPrivate?sendPrivateUnjoinRequest():sendPublicUnjoinRequest()
    }else{
      isPrivate?sendPrivateJoinRequest():sendPublicJoinRequest()
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
      headerRight: () => <View />,
    });
  }, []);

  const renderRecipes = ({ item }) => (
    <TouchableHighlight underlayColor="rgba(73,182,77,0.9)" >
      <View style={styles.container}>
        <Text style={styles.title}>{item.email}</Text>
      </View>
    </TouchableHighlight>
  );

  const findIsJoined = (vendors) =>{
    var found = false;
    const uid=firebase.auth().currentUser.uid
    if(vendors){
      for(var i = 0; i < vendors.length; i++) {
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
        <Image source={{ uri: item.imageURL }} style={{ minHeight: 250, borderRadius: 8, marginTop: 8,borderColor:"#009688" }} />
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
        title={isJoined?"Unjoin":"Join"} 
        onPress={()=>sendJoinRequest()}
        />

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
