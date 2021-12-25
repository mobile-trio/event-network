
import React, { useState, useEffect } from 'react'
import { View, Button, TextInput, Text, Image, Switch, TouchableHighlight, ScrollView, TouchableOpacity, Alert, FlatList } from 'react-native'
import Firebase from '../../../firebaseConfig';
import commonFormStyles from '../../styles/commonFormStyles';
import AppButton from '../../components/AppButton/AppButton';
import styles from "./styles";
import firebase from 'firebase';

export default function Login(props) {

  useEffect(() => {
    fetchUser()
  }, [])

  const [user, setUser] = useState()
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isShowFriendsOrRequests, setIsShowFriendsOrRequests] = useState(false)


  function fetchUser() {

    setIsRefreshing(true)
    Firebase.firestore()
      .collection("users")
      .doc(Firebase.auth().currentUser.uid)
      .get()
      .then((snapshot) => {
        if (snapshot.exists) {
          setUser(snapshot.data())
          console.log(snapshot.data())
          console.log(user?.friends)
        }
        else {
          console.log("does not exist")
        }
        setIsRefreshing(false)
      })

  }

  function acceptFriendRequest(item) {

    setIsRefreshing(true)
    firebase.firestore()
      .collection('users')
      .doc(Firebase.auth().currentUser.uid)
      .set(
        { friends: [item] },
        { merge: true }
      ).then(
        setIsRefreshing(false)
      )

    Firebase.firestore()
      .collection("users")
      .doc(Firebase.auth().currentUser.uid)
      .update({
        "friendRequests": firebase.firestore.FieldValue.arrayRemove(item)
      })
      .then((snapshot) => {
        if (snapshot.exists) {
          setUser(snapshot.data())
          console.log(snapshot.data())
        }
        else {
          console.log("does not exist")
        }
        setIsRefreshing(false)
      })

  }

  const renderFriends = ({ item }) => (
    <View style={{borderBottomWidth:2}} >
      <Text style={styles.title}>{item.email}</Text>
    </View>
  );

  const renderFriendRequests = ({ item }) => (
    <View style={{borderBottomWidth:2}}>
      <Text style={styles.title}>{item.email}</Text>
      <AppButton title="Accept Request" onClick={() => acceptFriendRequest(item)} />
    </View>
  );

  return (
    <View style={{margin:24}}>
      <Text  style={{ fontSize: 24, fontWeight: "bold", textAlign:"center",marginVertical:24}}>{user?.email}</Text>

      <AppButton
        title={isShowFriendsOrRequests ? "SHOW FRIENDS" : "SHOW FRIEND REQUESTS"}
        onPress={()=>setIsShowFriendsOrRequests(!isShowFriendsOrRequests)} />

      <View >

        {isShowFriendsOrRequests ? 
        <View >
          <Text style={{ fontSize: 24, fontWeight: "bold",marginVertical:16 }}>Friend Requests :</Text>
          <FlatList
            style={{ fontSize: 18, fontWeight: "bold" }}
            extraData={true}
            vertical
            showsVerticalScrollIndicator={false}
            numColumns={2}
            data={user?.friendRequests}
            renderItem={renderFriendRequests}
            refreshing={isRefreshing}
            onRefresh={fetchUser}
            keyExtractor={(item) => `${item.id}`} />
        </View> :
          <View >
            <Text style={{ fontSize: 24, fontWeight: "bold",marginVertical:16 }}>Friends :</Text>
            <FlatList
            style={{ fontSize: 18, fontWeight: "bold" }}
            extraData={true}
            vertical
            showsVerticalScrollIndicator={false}
            numColumns={2}
            data={user?.friends}
            renderItem={renderFriends}
            refreshing={isRefreshing}
            onRefresh={fetchUser}
            keyExtractor={(item) => `${item.id}`} />
          </View>
          }
      </View>
    </View>

  )

}
