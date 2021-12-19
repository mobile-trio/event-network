import React, {useState } from 'react'
import {View,Button,TextInput} from 'react-native'
import Firebase from '../../../firebaseConfig';
import * as Notifications from 'expo-notifications'
import Constants from 'expo-constants'

export default function Login() {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const Login = () => {
    Firebase.auth().signInWithEmailAndPassword(email,password)
    .then((result)=>{
      registerForPushNotificationsAsync().then(
        res=>{sendNotificationToAllUsers()}
      )
      console.log(result)
    })
    .catch((error)=>{
      console.log(error)
    })
  }
  return (
    <View>
      <TextInput
        placeholder= "email"
        onChangeText={email=>setEmail(email)}
       />
      <TextInput
        placeholder= "password"
        secureTextEntry={true}
        onChangeText={password=>setPassword(password)}
       />
       <Button
        onPress={()=>Login()}
        title="Sign Up"/>
    </View>
  )

  async function sendNotificationToAllUsers () {

    const users = await Firebase.firestore().collection("users").get();
    users.docs.map(user => sendPushNotification(user.data().token))
  }

  async function sendPushNotification(expoPushToken) {
    const message = {
      to: expoPushToken,
      sound: 'default',
      title: 'Application Opened',
      body: 'Application Started Succesfuly',
      data: { someData: 'goes here' },
    };
  
    await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });
  }

  async function registerForPushNotificationsAsync() {
    let token;
    if (Constants.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log(token);
    } else {
      alert('Must use physical device for Push Notifications');
    }
  
    if(token){
      const res = await Firebase
      .firestore()
      .collection('users')
      .doc(Firebase.auth().currentUser.uid)
      .set({token},{merge:true})
      console.log(res+"123")
    }


  
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
  
    return token;
  }
}
