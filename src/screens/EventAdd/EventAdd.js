import React, {useState,useEffect } from 'react'
import {View,Button,TextInput,Text,Image} from 'react-native'
import Firebase from '../../../firebaseConfig';
import * as ImagePicker from 'expo-image-picker'


export default function Login() {

  const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
  const [image, setImage] = useState(null);

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [location,setLocation] = useState("")
  const [imageURL,setImageURL] = useState("")

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync();
        console.log(status)
        setHasGalleryPermission(status === 'granted')
      }
    })();
  },[]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };


  const saveTodo = (imageURL) => {
    Firebase.firestore()
      .collection('events')
      .doc(Firebase.auth().currentUser.uid)
      .collection('userEvents')
      .add({
        name,
        description,
        location,
        imageURL,
      }).then((function () {
        console.log("success")
      }))
  }
  const crateToDo = async () => {
    if(image){
      const childPath = `events/${Firebase.auth().currentUser.uid}/${Math.random().toString(36)}`

      const response = await fetch(image)
      const blob = await response.blob();
  
      const task = Firebase
        .storage()
        .ref()
        .child(childPath)
        .put(blob)
  
      const taskProgress = snapshot => {
        console.log(`transferred: ${snapshot.bytesTransferred}`)
      }
  
      const taskCompleted = () => {
        task.snapshot.ref.getDownloadURL().then((snapshot) => {
          saveTodo(snapshot)
          console.log(snapshot)
        })
      }
  
      const taskError = snapshot => {
        console.log(snapshot)
      }
  
      task.on("state_changed",taskProgress,taskError,taskCompleted)
    }else{
      saveTodo("https://firebasestorage.googleapis.com/v0/b/mobil-programlama-b7483.appspot.com/o/events%2FmBa4IuAMM7cjCib4bQRfrtOGuHA2%2Ffunction%20random()%20%7B%20%5Bnative%20code%5D%20%7D?alt=media&token=1954d5e9-e15b-4d9c-af73-89e38f5fcbea")
    }

  
  }
    
  if(hasGalleryPermission === false) {
    return <Text>No access to galery</Text>
  }

  
  return (
    <View style={{flex:1}}>
      <Text>Hello</Text>

      <Button title="Pick Image From Gallery" onPress = {()=>pickImage()} />
      <Image source={{uri:image}} style={{flex: 1, height:100}} />
      <TextInput
        placeholder= "name"
        onChangeText={name=>setName(name)}
       />
      <TextInput
        placeholder= "description"
        onChangeText={description=>setDescription(description)}
       />
      <TextInput
        placeholder= "location"
        onChangeText={location=>setLocation(location)}
       />
       <TextInput
        placeholder= "imageURL"
        onChangeText={imageURL=>setImageURL(imageURL)}
       />
      
       <Button
        onPress={()=>crateToDo()}
        title="Sign Up"/>
    </View>
  )
}