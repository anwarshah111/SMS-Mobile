import {View, Text} from 'react-native';
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen/HomeScreen';
import BottomTabNavigation from './BottomTabNavigation';
import TestScreen from '../screens/RestFulAPIs/TestScreen';
import TestDetails from '../screens/RestFulAPIs/TestDetails';

const Stack = createStackNavigator();
const StackNavigation = () => {
  return (
    <Stack.Navigator
      initialRouteName="Dashboard"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="Dashboard" component={BottomTabNavigation} />
      <Stack.Screen name="Test" component={TestScreen} />
      <Stack.Screen name="TestDetails" component={TestDetails} />
      {/* <Stack.Screen name="Profile" component={BottomTabNavigation} /> */}
    </Stack.Navigator>
  );
};

export default StackNavigation;
