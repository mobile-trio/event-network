import React, { useLayoutEffect,useEffect,useState } from "react";
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'

import PrivateEvents from "../PrivateEvents/PrivateEvents";

import PublicEvents from "../PublicEvents/PublicEvents";

import {Text,View} from 'react-native'
import MenuImage from "../../components/MenuImage/MenuImage";
import { MaterialIcons } from '@expo/vector-icons'; 


const Tab = createBottomTabNavigator();


export default function HomeScreen(props) {


  const { navigation } = props;
  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <MenuImage
          onPress={() => {
            navigation.openDrawer();
          }}
        />
      ),
      headerRight: () => <View />,
    });
  }, []);


  return (

    <Tab.Navigator screenOptions={{headerShown: false}} >
    <Tab.Screen 
      options={{
        tabBarLabel: 'Public Events',
        tabBarIcon: ({ color, size }) => (
          <MaterialIcons name="public" size={size} color={color} /> 
        ),
      }}
    name="PublicEvents" component={PublicEvents} />
    <Tab.Screen 
        options={{
          tabBarLabel: 'Private Events',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="public-off" size={size} color={color} /> 
          ),
        }} name="PrivateEvents" component={PrivateEvents} />

   </Tab.Navigator>


  );
}
