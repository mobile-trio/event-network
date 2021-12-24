import React from 'react';
import { View, ActivityIndicator,StyleSheet } from "react-native";

const LoadingIndicator = ({isLoading}) =>{
  return(
    isLoading &&<View style={styles.loading}><ActivityIndicator size="large" color="#009688"/></View>
  )
}

export default LoadingIndicator;

const styles = StyleSheet.create({
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
    backgroundColor: 'rgba(52, 52, 52, 0.3)',
    zIndex:100
  }
})