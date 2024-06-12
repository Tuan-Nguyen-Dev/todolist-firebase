import {View, Text, StyleSheet, StatusBar, SafeAreaView} from 'react-native';
import React from 'react';
import {fontFamilies} from './src/constansts/fontFamilies';
import HomeScreen from './src/screens/HomeScreen';
import Router from './src/routers/Router';
import {NavigationContainer} from '@react-navigation/native';

const App = () => {
  return (
    <>
      <SafeAreaView style={{flex: 1}}>
        <NavigationContainer>
          <Router />
        </NavigationContainer>
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
