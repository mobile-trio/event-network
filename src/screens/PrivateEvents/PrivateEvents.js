import React, { useLayoutEffect,useEffect,useState } from "react";
import { FlatList, Text, View, TouchableHighlight, Image, RefreshControl } from "react-native";
import styles from "./styles";
//import { events,categories,ingredients } from "../../data/dataArrays";
import MenuImage from "../../components/MenuImage/MenuImage";
import {  getPrivateFriendEvents,getAllPublicEvents } from "../../data/MockDataAPI";
import Firebase from '../../../firebaseConfig';
import firebase from "firebase";


const PrivateEvents = (props) =>{
  const [user, setUser] = useState()
  const [events,setEvents] = useState([])
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    //addIngredients(ingredients)
    setIsRefreshing(true)
      Firebase.firestore()
      .collection("users")
      .doc(firebase.auth().currentUser?.uid)
      .get()
      .then((snapshot) => {
        if(snapshot.exists){
          let friends = snapshot.data().friends;
          setUser(snapshot.data())
          console.log(snapshot.data())

          Promise.all(
            friends.map(friend=>{
              return new Promise((resolve, reject) => {
                getPrivateFriendEvents(friend)
                  .then(friendEvents=>resolve(
                    friend,
                    friend.friendEvents= friendEvents.map(event=>{
                      event.userId=friend.id
                      event.userEmail=friend.email
                      return event
                      }
                    )
                  ))
                  .catch(er=>{console.log(er)})
              })   

            })).then(res=>{
              const result = Array.prototype.concat.apply([],res.map(item=>item.friendEvents))
              console.log(result)
              setEvents(result)
            })
            
        }
        else{
          console.log("does not exist")
        }
        setIsRefreshing(false)
      })
    
  }, [firebase.auth().currentUser?.uid])

  const handleRefresh = () => {
    setIsRefreshing(true)
    getAllPublicEvents().then(res=>{
      setEvents(res)
      setIsRefreshing(false)
    })
  }

  const onPressRecipe = (item) => {
    navigation.navigate("Recipe", { item });
  };

  const renderRecipes = ({ item }) => (
    <TouchableHighlight underlayColor="rgba(73,182,77,0.9)" onPress={() => onPressRecipe(item)}>
      <View style={styles.container}>
        <Image style={styles.photo} source={{ uri: item.imageURL }} />
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.category}>{item.category}</Text>
      </View>
    </TouchableHighlight>
  );
  return(
    <View>
    <Text>{Firebase.auth().currentUser?.uid}</Text>
    <FlatList 
    extraData={true}
    vertical 
    showsVerticalScrollIndicator={false} 
    numColumns={2} 
    data={events} 
    renderItem={renderRecipes} 
    refreshing={ isRefreshing}
    onRefresh={handleRefresh}
    keyExtractor={(item) => `${item.id}`} />
  </View>
  )
}
export default PrivateEvents