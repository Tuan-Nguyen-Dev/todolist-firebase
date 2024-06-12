import {View, Text, StyleSheet, StatusBar, SafeAreaView} from 'react-native';
import React from 'react';
import HomeScreen from './src/homes/HomeScreen';
import {fontFamilies} from './src/constansts/fontFamilies';

const App = () => {
  return (
    <>
      <SafeAreaView style={{flex: 1}}>
        <HomeScreen />
      </SafeAreaView>
    </>
  );
};

export default App;
const localStyle = StyleSheet.create({
  container: {
    fontFamily: 'Poppins-Black',
  },
});
