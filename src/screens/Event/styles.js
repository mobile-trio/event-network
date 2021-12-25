import { StyleSheet, Dimensions } from 'react-native';

const { width: viewportWidth } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1
  },

  infoRecipeContainer: {
    color: "#61dafb",
    fontSize: 30,
    fontWeight: "bold",
    marginHorizontal: 24,
    marginVertical: 12,
    
  },
  infoContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderColor: '#009688',
    borderBottomWidth: 2,
    alignItems: 'center',
  },
  infoRow: {
    fontSize: 18,
    margin: 10,
    color: 'black',
    

  },
  infoDescriptionRecipe: {
    textAlign: 'left',
    fontSize: 16,
    marginTop: 30,
    margin: 15
  },
  infoRecipeName: {
    fontSize: 28,
    margin: 10,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center'
  }
});

export default styles;
