import AppButton from '../../components/AppButton/AppButton';
import LoadingIndicator from '../../components/LoadingIndicator/LoadingIndicator';
import { useValidation } from 'react-native-form-validator';
import React, {useState } from 'react'
import { View, Button, TextInput, Text, Image, Switch, KeyboardAvoidingView, ScrollView, TouchableOpacity,Alert } from 'react-native'
import firebase from 'firebase';
import {registerForPushNotificationsAsync} from "../../components/Notification/Notification"
import commonFormStyles from '../../styles/commonFormStyles';

export default function Login(props) {

  const { navigation, route } = props;
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const [isLoading, setIsLoading] = useState(false)

  
  const successAlert = () =>
  Alert.alert('Logined In!', 'Logined In Succesfully', [
    { text: 'OK', onPress: () => console.log('OK Pressed') },
  ]);
  const errorAlert = (error) =>
  Alert.alert('Error', error, [
    { text: 'OK', onPress: () => console.log('OK Pressed') },
  ]);


  const { validate, isFieldInError, getErrorsInField, getErrorMessages } =
  useValidation({
    state: { email,password },
  });

  const _onPressButton = () => {
    if(validate({
      email: { email: true, required: true },
      password: { string: true,  required: true },
    })){
      Login()
    }
  };

  const Login = () => {
    setIsLoading(true)
    firebase.auth().signInWithEmailAndPassword(email,password)
    .then((result)=>{
      registerForPushNotificationsAsync().then(
        res=>{}
      )
      setIsLoading(false)
      console.log(result)
      successAlert()
      navigation.navigate("Home");
    })
    .catch((error)=>{
      setIsLoading(false)
      console.log(error)
      errorAlert(error.toString())
    })
  }
  return (
    <View style={commonFormStyles.container}>
      <LoadingIndicator isLoading={isLoading}/>
      <KeyboardAvoidingView
             style={{flex:1}}
             behavior={Platform.OS === 'ios' ? 'position' : null}
             keyboardVerticalOffset={Platform.OS === 'ios' ? 50 : 70}>
        <ScrollView>
          <View style={commonFormStyles.formBox}>
            <TextInput
              style={commonFormStyles.formItems}
              placeholder="email"
              onChangeText={email => setEmail(email)}
            />
            {isFieldInError('email') &&
              getErrorsInField('email').map(errorMessage => (
                <Text key={errorMessage} style={commonFormStyles.errorText}>{errorMessage}</Text>
              ))}
            <TextInput
              style={commonFormStyles.formItems}
              placeholder="password"
              secureTextEntry={true}
              onChangeText={password => setPassword(password)}
            />
            {isFieldInError('password') &&
              getErrorsInField('password').map(errorMessage => (
                <Text  key={errorMessage} style={commonFormStyles.errorText}>{errorMessage}</Text>
              ))}
            <AppButton
              style={commonFormStyles.button}
              onPress={() => _onPressButton()}
              title="LogIn" />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  )

}
