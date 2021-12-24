
import React, {useState,useEffect } from 'react'
import { View, Button, TextInput, Text, Image, Switch, KeyboardAvoidingView, ScrollView, TouchableOpacity,Alert } from 'react-native'
import Firebase from '../../../firebaseConfig';
import commonFormStyles from '../../styles/commonFormStyles';
import AppButton from '../../components/AppButton/AppButton';

export default function Login(props) {

  useEffect(() => {
    fetchUser()
  }, [])

  const [user, setUser] = useState()
  

  function fetchUser(){

      Firebase.firestore()
      .collection("users")
      .doc(Firebase.auth().currentUser.uid)
      .get()
      .then((snapshot) => {
        if(snapshot.exists){
          setUser(snapshot.data())
          console.log(snapshot.data())
        }
        else{
          console.log("does not exist")
        }
      })

  }
  return (
    <View>
      <Text>{user?.email}</Text>



    </View>
  )

}
