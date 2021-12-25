import React, { useLayoutEffect, useEffect, useState } from "react";
import { FlatList, Text, View, TouchableOpacity, Image, RefreshControl } from "react-native";
import styles from "./styles";
import { getPrivateFriendEvents, getAllPublicEvents } from "../../data/MockDataAPI";
import firebase from "firebase";


const PrivateEvents = (props) => {
  const { navigation } = props;
  const [events, setEvents] = useState([])
  const [isRefreshing, setIsRefreshing] = useState(false)
  

  useEffect(() => {
    handleRefresh()
  }, [firebase.auth().currentUser])

  const handleRefresh = () => {
    setIsRefreshing(true)
    firebase.firestore()
      .collection("users")
      .doc(firebase.auth().currentUser?.uid)
      .get()
      .then((snapshot) => {
        if (snapshot.exists) {
          let friends = snapshot.data().friends;

          console.log(snapshot.data())

          Promise.all(
            friends.map(friend => {
              return new Promise((resolve, reject) => {
                getPrivateFriendEvents(friend)
                  .then(friendEvents => resolve(
                    friend,
                    friend.friendEvents = friendEvents
                  ))
                  .catch(er => { console.log(er) })
              })

            })).then(res => {
              const result = Array.prototype.concat.apply([], res.map(item => item.friendEvents))
              console.log(result)
              setEvents(result)
            })

        }
        else {
          console.log("does not exist")
        }
        setIsRefreshing(false)
      })
  }

  const onPressEvent = (item) => {
    if(firebase.auth().currentUser){
      navigation.navigate("Event", { item, isPrivate: true });
    }else{
      navigation.navigate("Login")
    }
  };

  const renderRecipes = ({ item }) => (
    <TouchableOpacity  onPress={() => onPressEvent(item)}>
      <View style={styles.container}>
        <Image style={styles.photo} source={{ uri: item.imageURL }} />
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.category}>{item.category}</Text>
      </View>
    </TouchableOpacity>
  );
  return (
    <View style={{flex: 1}}>
      {
      events.length==0&&<Text style={{fontWeight:"bold",fontSize:20, textAlign:"center", margin:20}}>{
        firebase.auth().currentUser?"Your Friends Has No Private Event Here":"You should Login for see it"
      }</Text>
      }
      <FlatList
        extraData={true}
        vertical
        showsVerticalScrollIndicator={false}
        numColumns={2}
        data={events}
        renderItem={renderRecipes}
        refreshing={isRefreshing}
        onRefresh={handleRefresh}
        keyExtractor={(item) => `${item.id}`} />
    </View>
  )
}
export default PrivateEvents