import React, { useLayoutEffect, useEffect, useState } from "react";
import { FlatList, Text, View, TouchableOpacity, Image, RefreshControl } from "react-native";
import styles from "./styles";
import {  getAllPublicEvents } from "../../data/MockDataAPI";


const PublicEvents = (props) => {
  const { navigation } = props;
  const [events, setEvents] = useState([])
  const [isRefreshing, setIsRefreshing] = useState(false)


  useEffect(() => {
    //addIngredients(ingredients)
    setIsRefreshing(true)
    getAllPublicEvents().then(res => {
      setEvents(res)
      setIsRefreshing(false)
    })

  }, [])

  const handleRefresh = () => {
    setIsRefreshing(true)
    getAllPublicEvents().then(res => {
      setEvents(res)
      setIsRefreshing(false)
    })
  }

  const onPressEvent = (item) => {
    navigation.navigate("Event", { item, isPrivate: false });
  };


  const renderRecipes = ({ item }) => (
    <TouchableOpacity onPress={() => onPressEvent(item)}>
      <View style={styles.container}>
        <Image style={styles.photo} source={{ uri: item.imageURL }} />
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.category}>{item.category}</Text>
      </View>
    </TouchableOpacity>
  );
  return (
    <View style={{flex: 1}}>
      {events.length == 0 ?
        <View>
          <Text style={{ fontWeight: "bold", fontSize: 20, textAlign: "center", margin: 20 }}>No public event here</Text>
        </View> :
        <FlatList
          extraData={true}
          vertical
          showsVerticalScrollIndicator={false}
          numColumns={2}
          data={events}
          renderItem={renderRecipes}
          refreshing={isRefreshing}
          onRefresh={handleRefresh}
          keyExtractor={(item) => `${item.id}`} />
      }
    </View>
  )

}
export default PublicEvents