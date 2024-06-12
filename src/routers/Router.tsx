import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useEffect, useState} from 'react';
import HomeScreen from '../screens/HomeScreen';
import AddNewTask from '../screens/tasks/AddNewTask';
import SearchScreen from '../screens/SearchScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import SignUpScreen from '../screens/auth/SignUpScreen';
import auth from '@react-native-firebase/auth';
const Router = () => {
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    auth().onAuthStateChanged(user => {
      if (user) {
        setIsLogin(true);
      } else {
        setIsLogin(false);
      }
    });
  }, []);
  const Stack = createNativeStackNavigator();

  const MainRouter = (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="AddNewTask" component={AddNewTask} />
      <Stack.Screen name="SearchScreen" component={SearchScreen} />
    </Stack.Navigator>
  );

  const AuthRouter = (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
    </Stack.Navigator>
  );
  return isLogin ? MainRouter : AuthRouter;
};

export default Router;
