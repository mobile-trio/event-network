import React, {useState } from 'react'
import {View,Button,TextInput} from 'react-native'
import firebase from 'firebase';
import * as Notifications from 'expo-notifications'
import Constants from 'expo-constants'


  export async function sendNotificationToAllUsers (title,body) {

    const users = await firebase.firestore().collection("users").get();
    users.docs.map(user => sendPushNotification(user.data().token,title,body))
  }

  export async function sendPushNotification(expoPushToken,title,body) {
    const message = {
      to: expoPushToken,
      sound: 'default',
      title: title,
      body: body,
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

  export async function registerForPushNotificationsAsync() {
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
      const res = await firebase
      .firestore()
      .collection('users')
      .doc(firebase.auth().currentUser.uid)
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
