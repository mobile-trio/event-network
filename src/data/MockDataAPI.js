
import firebase from 'firebase'

export async function getAllPublicEvents(){
  var recipesArray = [];
  await firebase.firestore()
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
  await firebase.firestore()
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
  await firebase.firestore()
    .collection("events")
    .get()
    .then((snapshot) => {
       recipesArray = snapshot.docs.map(doc => {
        return doc.data();
      })})
  console.log(recipesArray)
  return recipesArray;
}

export async function getPrivateFriendEvents(friend){
  var friendEventsArray = [];
  await firebase.firestore()
    .collection("privateEvents")
    .doc(friend.id)
    .collection("userEvents")
    .get()
    .then((snapshot) => {
      friendEventsArray = snapshot.docs.map(doc => {
        const id = doc.id;
        const data = doc.data();
        return {id,...data};
      })})
  console.log(friendEventsArray)
  return friendEventsArray;
}


