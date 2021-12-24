import { Text } from 'react-native';
import React, { Component } from 'react';
import { recipes, categories, ingredients } from './dataArrays';
import Firebase from '../../firebaseConfig'

export function getCategoryById(categoryId) {
  let category;
  categories.map(data => {
    if (data.id == categoryId) {
      category = data;
    }
  });
  return category;
}

export function getIngredientName(ingredientID) {
  let name;
  ingredients.map(data => {
    if (data.ingredientId == ingredientID) {
      name = data.name;
    }
  });
  return name;
}

export function getIngredientUrl(ingredientID) {
  let url;
  ingredients.map(data => {
    if (data.ingredientId == ingredientID) {
      url = data.photo_url;
    }
  });
  return url;
}

export async function getCategoryNameFirebase(categoryId) {
  let name=[];
  await Firebase.firestore()
  .collection("categories")
  .where("id","==",categoryId)
  .get()
  .then((snapshot) => {
    name = snapshot.docs.map(doc => {
     return doc.data().name;
   })})
   console.log(name[0])
   return name[0];

/*
  let name;
  categories.map(data => {
    if (data.id == categoryId) {
      name = data.name;
    }
  });
  return name;

  */
}

export function getCategoryName(categoryId){
  
  let name;
  categories.map(data => {
    if (data.id == categoryId) {
      name = data.name;
    }
  });
  return name;

}

export function getRecipes(categoryId) {
  const recipesArray = [];
  Firebase.firestore()
    .collection("recipes")
    .onSnapShot((snapshot) => {
      return recipesArray = snapshot.docs.map(doc => {
        const data = doc.data();
        if (data.categoryId == categoryId) {
        return data
        }
      })})
      /*
  const recipesArray = [];
  recipes.map(data => {
    if (data.categoryId == categoryId) {
      recipesArray.push(data);
    }
  });
  return recipesArray;
  */
}

export async function getAllRecipes(){
  var recipesArray = [];
  await Firebase.firestore()
    .collection("recipes")
    .get()
    .then((snapshot) => {
       recipesArray = snapshot.docs.map(doc => {
        return doc.data();
      })})
  console.log(recipesArray)
  return recipesArray;
}

export async function getAllPublicEvents(){
  var recipesArray = [];
  await Firebase.firestore()
    .collection("publicEvents")
    .get()
    .then((snapshot) => {
       recipesArray = snapshot.docs.map(doc => {
        const id = doc.id;
        const data = doc.data();
        return {id,...data};
      })})
  console.log(recipesArray)
  return recipesArray;
}

export async function getUserByEmail(email){
  var recipesArray = [];
  await Firebase.firestore()
    .collection("users")
    .where('email','==',email)
    .get()
    .then((snapshot) => {
       recipesArray = snapshot.docs.map(doc => {
        const id = doc.id;
        const data = doc.data();
        return {id,...data};
      })})
  console.log(recipesArray)
  return recipesArray;
}

export async function getAllEvents(){
  var recipesArray = [];
  await Firebase.firestore()
    .collection("events")
    .get()
    .then((snapshot) => {
       recipesArray = snapshot.docs.map(doc => {
        return doc.data();
      })})
  console.log(recipesArray)
  return recipesArray;
}

export function addRecipe(recipe){
  Firebase.firestore()
  .collection("recipes").add({
    recipeId:recipe.recipeId,
    categoryId: recipe.categoryId,
    title: recipe.title,
    photo_url: recipe.photo_url,
    photosArray: recipe.photosArray,
    time: recipe.time,
    ingredients: recipe.ingredients.map(ingredient=>{
      return {
        id: ingredient[0],
        amount: ingredient[1]
      }
    }),
    description: recipe.description
  })
}

export function addAllRecipes(recipes){
  recipes.map(recipe=>{
    addRecipe(recipe)
  })
}

export function addCategory(category){
  Firebase.firestore()
  .collection("categories").add({
    id: category.id,
    name: category.name,
    photo_url:category.photo_url
  })
}

export function addCategories(categories){
  categories.map(categories=>{
    addCategory(categories)
  })
}

export function addIngredient(ingredient){
  Firebase.firestore()
  .collection("ingredients").add({
    ingredientId: ingredient.ingredientId,
    name: ingredient.name,
    photo_url:ingredient.photo_url
  })
}

export function addIngredients(ingredients){
  ingredients.map(ingredient=>{
    addIngredient(ingredient)
  })
}


// modifica
export function getRecipesByIngredient(ingredientId) {
  const recipesArray = [];
  recipes.map(data => {
    data.ingredients.map(index => {
      if (index[0] == ingredientId) {
        recipesArray.push(data);
      }
    });
  });
  return recipesArray;
}

export function getNumberOfRecipes(categoryId) {
  let count = 0;
  recipes.map(data => {
    if (data.categoryId == categoryId) {
      count++;
    }
  });
  return count;
}

export function getAllIngredients(idArray) {
  const ingredientsArray = [];
  idArray.map(index => {
    ingredients.map(data => {
      if (data.ingredientId == index[0]) {
        ingredientsArray.push([data, index[1]]);
      }
    });
  });
  return ingredientsArray;
}

// functions for search
export function getRecipesByIngredientName(ingredientName) {
  const nameUpper = ingredientName.toUpperCase();
  const recipesArray = [];
  ingredients.map(data => {
    if (data.name.toUpperCase().includes(nameUpper)) {
      // data.name.yoUpperCase() == nameUpper
      const recipes = getRecipesByIngredient(data.ingredientId);
      const unique = [...new Set(recipes)];
      unique.map(item => {
        recipesArray.push(item);
      });
    }
  });
  const uniqueArray = [...new Set(recipesArray)];
  return uniqueArray;
}

export function getRecipesByCategoryName(categoryName) {
  const nameUpper = categoryName.toUpperCase();
  const recipesArray = [];
  categories.map(data => {
    if (data.name.toUpperCase().includes(nameUpper)) {
      const recipes = getRecipes(data.id); // return a vector of recipes
      recipes.map(item => {
        recipesArray.push(item);
      });
    }
  });
  return recipesArray;
}

export function getRecipesByRecipeName(recipeName) {
  const nameUpper = recipeName.toUpperCase();
  const recipesArray = [];
  recipes.map(data => {
    if (data.title.toUpperCase().includes(nameUpper)) {
      recipesArray.push(data);
    }
  });
  return recipesArray;
}
