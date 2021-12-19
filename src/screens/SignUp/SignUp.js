import React, {useState } from 'react'
import {View,Button,TextInput} from 'react-native'
import Firebase from '../../../firebaseConfig';

export default function SignUp() {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const onSingUp = () => {
    Firebase.auth().createUserWithEmailAndPassword(email,password)
    .then((result)=>{
      Firebase.firestore().collection("users")
        .doc(Firebase.auth().currentUser.uid)
        .set({
          email,
          password
        })
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
        onPress={()=>onSingUp()}
        title="Sign Up"/>
    </View>
  )
}
