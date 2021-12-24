import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  formBox: {
    color: "#61dafb",
    fontSize: 30,
    fontWeight: "bold",
    margin: 24,
    
  },
  formItems: {
    fontWeight:"bold",
    paddingVertical:6,
    paddingHorizontal:6,
    marginVertical:6,
    borderBottomColor: 'gray',
    borderBottomWidth: 2,

  },
  button: {
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'gray',
    height: 100,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',

  },
  errorText: {
    color: "red",
    fontSize: 10
  }
});

export default styles;