import React, { useState, useEffect } from 'react'
import { View, Button, TextInput, Text, Image, Switch, KeyboardAvoidingView, ScrollView, TouchableOpacity } from 'react-native'
import Firebase from '../../../firebaseConfig';
import * as ImagePicker from 'expo-image-picker'
import styles from "./styles";
import AppButton from '../../components/AppButton/AppButton';


export default function Login() {

  const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
  const [image, setImage] = useState(null);

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [location, setLocation] = useState("")
  const [imageURL, setImageURL] = useState("")
  const [category, setCategory] = useState("")
  const [isImageFromGallery, setIsImageFromGallery] = useState(false)

  const [isPrivate, setIsPrivate] = useState(false);
  const toggleSwitch = () => setIsPrivate(previousState => !previousState);
  const toggleSwitchGallery = () => setIsImageFromGallery(previousState => !previousState);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        console.log(status)
        setHasGalleryPermission(status === 'granted')
      }
    })();
  }, []);

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
    if (image) {
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

      task.on("state_changed", taskProgress, taskError, taskCompleted)
    } else {
      saveTodo("https://firebasestorage.googleapis.com/v0/b/mobil-programlama-b7483.appspot.com/o/events%2FmBa4IuAMM7cjCib4bQRfrtOGuHA2%2Ffunction%20random()%20%7B%20%5Bnative%20code%5D%20%7D?alt=media&token=1954d5e9-e15b-4d9c-af73-89e38f5fcbea")
    }


  }

  if (hasGalleryPermission === false) {
    return <Text>No access to galery</Text>
  }


  return (

    <View style={styles.container}>
      <KeyboardAvoidingView
             style={{flex:1}}
             behavior={Platform.OS === 'ios' ? 'position' : null}
             keyboardVerticalOffset={Platform.OS === 'ios' ? 50 : 70}>
        <ScrollView>
          <View style={styles.formBox}>

          <View style={{ flexDirection: "row", marginBottom: 12 }}>
              <Text style={{ flex: 0, marginTop: 12 }}>
                {isImageFromGallery ? "From Galery" : "From Link"}
              </Text>
              <Switch
                style={{ flex: 0 }}
                trackColor={{ false: '#767577', true: '#009688' }}
                thumbColor={isImageFromGallery ? '#f4f3f4' : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleSwitchGallery}
                value={isImageFromGallery}
              />
            </View>

            {isImageFromGallery?
              <AppButton title="Pick Image From Gallery" style={styles.button} onPress={() => pickImage()} ></AppButton>
              :
              <TextInput
              style={styles.formItems}
              placeholder="imageURL"
              onChangeText={imageURL => setImage(imageURL)}
            />
          }
            <Image source={{ uri: image }} style={{ minHeight: 150, borderRadius: 8, marginTop: 8 }} />
            <TextInput
              style={styles.formItems}
              placeholder="name"
              onChangeText={name => setName(name)}
            />
            <TextInput
              style={styles.formItems}
              placeholder="description"
              onChangeText={description => setDescription(description)}
            />
            <TextInput
              style={styles.formItems}
              placeholder="location"
              onChangeText={location => setLocation(location)}
            />
            <TextInput
              style={styles.formItems}
              placeholder="category"
              onChangeText={category => setImageURL(category)}
            />
            <View style={{ flexDirection: "row", marginBottom: 24 }}>
              <Text style={{ flex: 0, marginTop: 12 }}>
                {isPrivate ? "Private" : "Public"}
              </Text>
              <Switch
                style={{ flex: 0 }}
                trackColor={{ false: '#767577', true: '#009688' }}
                thumbColor={isPrivate ? '#f4f3f4' : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleSwitch}
                value={isPrivate}
              />
            </View>
            <AppButton
              style={styles.button}
              onPress={() => crateToDo()}
              title="Sign Up" />

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>

  )
}

