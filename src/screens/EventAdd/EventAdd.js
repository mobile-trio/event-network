import React, { useState, useEffect } from 'react'
import { View, Button, TextInput, Text, Image, Switch, KeyboardAvoidingView, ScrollView, TouchableOpacity,Alert } from 'react-native'
import Firebase from '../../../firebaseConfig';
import * as ImagePicker from 'expo-image-picker'
import styles from "./styles";
import AppButton from '../../components/AppButton/AppButton';
import LoadingIndicator from '../../components/LoadingIndicator/LoadingIndicator';
import { useValidation } from 'react-native-form-validator';
import {sendNotificationToAllUsers} from '../../components/Notification/Notification';



const EventAdd = () => {

  const [hasGalleryPermission, setHasGalleryPermission] = useState(null);

  const [image, setImage] = useState(null);
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [location, setLocation] = useState("")
  const [category, setCategory] = useState("")

  const [isLoading, setIsLoading] = useState(false)

  const [isImageFromGallery, setIsImageFromGallery] = useState(false)
  const [isPrivate, setIsPrivate] = useState(false);
  const toggleSwitch = () => setIsPrivate(previousState => !previousState);
  const toggleSwitchGallery = () => {
    setImage()
    setIsImageFromGallery(previousState => !previousState)
  };

  const { validate, isFieldInError, getErrorsInField, getErrorMessages } =
  useValidation({
    state: { name, description, location, category },
  });

  const _onPressButton = () => {
    if(validate({
      name: { string: true,minlength: 3, maxlength: 20, required: true },
      description: { string: true, maxlength: 60, required: true },
      location: { string: true, required: true },
      category: { string: true, required: true  },
    })){
      addEvent()
    }
  };

  const successAlert = () =>
  Alert.alert('Event Created!', 'Event created succesfully', [
    { text: 'OK', onPress: () => console.log('OK Pressed') },
  ]);
  const errorAlert = () =>
  Alert.alert('Error', 'Someting went wrong', [
    { text: 'OK', onPress: () => console.log('OK Pressed') },
  ]);

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


  const addEvent = () => {
    isImageFromGallery?
      crateToDo():isPrivate?
        saveTodo(image):saveTodoPublic(image)
  }
  const saveTodo = (imageURL) => {
    setIsLoading(true)
    Firebase.firestore()
      .collection('privateEvents')
      .doc(Firebase.auth().currentUser.uid)
      .collection('userEvents')
      .add({
        name,
        description,
        location,
        imageURL,
        category
      }).then((function () {
        console.log("success")
        successAlert()
        sendNotificationToAllUsers("New Event Created!",name)
      })).catch(()=>{
        errorAlert()
      }).finally(()=>{
        setIsLoading(false)
      })
  }
  const saveTodoPublic = (imageURL) => {
    setIsLoading(true)
    Firebase.firestore()
      .collection('publicEvents')
      .add({
        name,
        description,
        location,
        imageURL,
        category
      }).then((function () {
        console.log("success")
        successAlert()
        sendNotificationToAllUsers("New Event Created!",name)
      })).catch(()=>{
        errorAlert()
      }).finally(()=>{
        setIsLoading(false)
      })
  }

  const crateToDo = async () => {
    setIsLoading(true)
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
          isPrivate? saveTodo(snapshot): saveTodoPublic(snapshot)
          console.log(snapshot)
          setIsLoading(false)
        })
      }

      const taskError = snapshot => {
        console.log(snapshot)
        setIsLoading(false)
      }

      task.on("state_changed", taskProgress, taskError, taskCompleted)
    } else {
      
    }


  }

  if (hasGalleryPermission === false) {
    return <Text>No access to galery</Text>
  }


  return (

    <View style={styles.container}>
      <LoadingIndicator isLoading={isLoading}/>
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
            {image&&<Image source={{ uri: image }} style={{ minHeight: 150, borderRadius: 8, marginTop: 8 }} />}
            <TextInput
              style={styles.formItems}
              placeholder="name"
              onChangeText={name => setName(name)}
            />
            {isFieldInError('name') &&
              getErrorsInField('name').map(errorMessage => (
                <Text key={errorMessage} style={styles.errorText}>{errorMessage}</Text>
              ))}
            <TextInput
              style={styles.formItems}
              placeholder="description"
              onChangeText={description => setDescription(description)}
            />
            {isFieldInError('description') &&
              getErrorsInField('description').map(errorMessage => (
                <Text  key={errorMessage} style={styles.errorText}>{errorMessage}</Text>
              ))}
            <TextInput
              style={styles.formItems}
              placeholder="location"
              onChangeText={location => setLocation(location)}
            />
              {isFieldInError('location') &&
              getErrorsInField('location').map(errorMessage => (
                <Text key={errorMessage} style={styles.errorText}>{errorMessage}</Text>
              ))}
            <TextInput
              style={styles.formItems}
              placeholder="category"
              onChangeText={category => setCategory(category)}
            />
              {isFieldInError('category') &&
              getErrorsInField('category').map(errorMessage => (
                <Text key={errorMessage}style={styles.errorText}>{errorMessage}</Text>
              ))}
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
              onPress={() => _onPressButton()}
              title="Add Event" />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>

  )
}

export default EventAdd
