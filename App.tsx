import {View, Text, StyleSheet, StatusBar} from 'react-native';
import React from 'react';
import HomeScreen from './src/homes/HomeScreen';
import {fontFamilies} from './src/constansts/fontFamilies';

const App = () => {
  return (
    <>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={'light-content'}
      />
      <HomeScreen />
    </>
  );
};

export default App;
const localStyle = StyleSheet.create({
  container: {
    fontFamily: 'Poppins-Black',
  },
});
