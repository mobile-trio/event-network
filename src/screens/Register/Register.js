import AppButton from '../../components/AppButton/AppButton';
import LoadingIndicator from '../../components/LoadingIndicator/LoadingIndicator';
import { useValidation } from 'react-native-form-validator';
import React, {useState } from 'react'
import { View, Button, TextInput, Text,  KeyboardAvoidingView, ScrollView, Alert } from 'react-native'
import Firebase from '../../../firebaseConfig';
import commonFormStyles from '../../styles/commonFormStyles';

export default function Register(props) {

  const { navigation, route } = props;
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState('');

  const [isLoading, setIsLoading] = useState(false)

  
  const successAlert = () =>
  Alert.alert('Registered!', 'Registered Successfully', [
    { text: 'OK', onPress: () => console.log('OK Pressed') },
  ]);
  const errorAlert = (error) =>
  Alert.alert('Error', error, [
    { text: 'OK', onPress: () => console.log('OK Pressed') },
  ]);


  const { validate, isFieldInError, getErrorsInField, getErrorMessages } =
  useValidation({
    state: { email,password,confirmPassword },
  });

  const _onPressButton = () => {
    if(validate({
      email: { email: true, required: true },
      password: { string: true,min:6,  required: true },
      confirmPassword: { equalPassword: password },
    })){
      onRegister()
    }
  };

  const onRegister = () => {
    Firebase.auth().createUserWithEmailAndPassword(email,password)
    .then((result)=>{
      Firebase.firestore().collection("users")
        .doc(Firebase.auth().currentUser.uid)
        .set({
          email,
          password
        }).then(res=>{
          setIsLoading(false)
          console.log(result)
          successAlert()
          navigation.navigate("Login");
        }).catch((error)=>{
          setIsLoading(false)
          console.log(error)
          errorAlert(error.toString())
        })
      console.log(result)
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
            <TextInput
              style={commonFormStyles.formItems}
              placeholder="confirmPassword"
              secureTextEntry={true}
              onChangeText={confirmPassword => setConfirmPassword(confirmPassword)}
            />
            {isFieldInError('confirmPassword') &&
              getErrorsInField('confirmPassword').map(errorMessage => (
                <Text  key={errorMessage} style={commonFormStyles.errorText}>{errorMessage}</Text>
              ))}
            <AppButton
              style={commonFormStyles.button}
              onPress={() => _onPressButton()}
              title="Register" />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  )

}

