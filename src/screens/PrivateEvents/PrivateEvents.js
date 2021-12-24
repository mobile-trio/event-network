import React, { useLayoutEffect,useEffect,useState } from "react";
import { FlatList, Text, View, TouchableHighlight, Image, RefreshControl } from "react-native";
import styles from "./styles";
//import { events,categories,ingredients } from "../../data/dataArrays";
import MenuImage from "../../components/MenuImage/MenuImage";
import { getCategoryNameFirebase,addAllRecipes,addCategories,addIngredients,getAllRecipes,getAllPublicEvents } from "../../data/MockDataAPI";
import Firebase from '../../../firebaseConfig';


const PrivateEvents = (props) =>{
  const [events,setEvents] = useState([])
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    //addIngredients(ingredients)
    setIsRefreshing(true)
    getAllPublicEvents().then(res=>{
      setEvents(res)
      setIsRefreshing(false)
    })
    
  }, [])

  const handleRefresh = () => {
    setIsRefreshing(true)
    getAllPublicEvents().then(res=>{
      setEvents(res)
      setIsRefreshing(false)
    })
  }

  const onPressRecipe = (item) => {
    navigation.navigate("Recipe", { item });
  };

  const renderRecipes = ({ item }) => (
    <TouchableHighlight underlayColor="rgba(73,182,77,0.9)" onPress={() => onPressRecipe(item)}>
      <View style={styles.container}>
        <Image style={styles.photo} source={{ uri: item.imageURL }} />
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.category}>{item.category}</Text>
      </View>
    </TouchableHighlight>
  );
  return(
    <View>
    <Text>{Firebase.auth().currentUser?.uid}</Text>
    <FlatList 
    extraData={true}
    vertical 
    showsVerticalScrollIndicator={false} 
    numColumns={2} 
    data={events} 
    renderItem={renderRecipes} 
    refreshing={ isRefreshing}
    onRefresh={handleRefresh}
    keyExtractor={(item) => `${item.id}`} />
  </View>
  )
}
export default PrivateEvents