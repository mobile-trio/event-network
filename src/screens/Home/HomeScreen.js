import React, { useLayoutEffect,useEffect,useState } from "react";
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'

import PrivateEvents from "../PrivateEvents/PrivateEvents";

import PublicEvents from "../PublicEvents/PublicEvents";

import {Text,View} from 'react-native'
import MenuImage from "../../components/MenuImage/MenuImage";


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

    <Tab.Navigator screenOptions={{headerShown: false}}>
    <Tab.Screen  name="PrivateEvents" component={PrivateEvents} />
    <Tab.Screen name="PublicEvents" component={PublicEvents} />
   </Tab.Navigator>


  );
}
