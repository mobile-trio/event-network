import React, { useLayoutEffect,useEffect,useState } from "react";
import { FlatList, Text, View, TouchableHighlight, Image } from "react-native";
import styles from "./styles";
//import { events,categories,ingredients } from "../../data/dataArrays";
import MenuImage from "../../components/MenuImage/MenuImage";
import { getCategoryNameFirebase,addAllRecipes,addCategories,addIngredients,getAllRecipes } from "../../data/MockDataAPI";
import Firebase from '../../../firebaseConfig';

export default function HomeScreen(props) {
  const { navigation } = props;
  const [events,setEvents] = useState([])

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

  useEffect(() => {
    //addIngredients(ingredients)
    getAllRecipes().then(
      res=>{
        Promise.all(
          res.map(recipe=>{
            return new Promise((resolve, reject) => {
              getCategoryNameFirebase(recipe.categoryId)
                .then(categoryRes=>resolve(
                  recipe,
                  recipe.categoryName=categoryRes
                ))
                .catch(er=>{console.log(er)})
            })   
        })).then(res=>setEvents(res))
      }
    ) 
  }, [])

  const onPressRecipe = (item) => {
    navigation.navigate("Recipe", { item });
  };

  const renderRecipes = ({ item }) => (
    <TouchableHighlight underlayColor="rgba(73,182,77,0.9)" onPress={() => onPressRecipe(item)}>
      <View style={styles.container}>
        <Image style={styles.photo} source={{ uri: item.photo_url }} />
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.category}>{item.categoryName}</Text>
      </View>
    </TouchableHighlight>
  );

  return (
    <View>
      <Text>{Firebase.auth().currentUser?.uid}</Text>
      <FlatList vertical showsVerticalScrollIndicator={false} numColumns={2} data={events} renderItem={renderRecipes} keyExtractor={(item) => `${item.recipeId}`} />
    </View>
  );
}
