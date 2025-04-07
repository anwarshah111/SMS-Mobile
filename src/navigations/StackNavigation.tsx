import {View, Text} from 'react-native';
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen/HomeScreen';
import BottomTabNavigation from './BottomTabNavigation';
import TestScreen from '../screens/RestFulAPIs/TestScreen';
import TestDetails from '../screens/RestFulAPIs/TestDetails';
import EditTests from '../screens/RestFulAPIs/EditTests';
import AddTests from '../screens/RestFulAPIs/AddTests';
import TestPhotos from '../screens/RestFulAPIs/TestPhotos';
import DashBoard from '../screens/HomeScreen/DashBoard';
import SchoolRegistration from '../screens/Registration/SchoolRegistration';
import SchoolRequestScreen from '../screens/Admin/SchoolRequestScreen';
import SchoolsDashboard from '../screens/Schools/SchoolsDashboard';
import RequestedStudents from '../screens/Schools/RequestedStudents';
import ManageStudents from '../screens/Schools/ManageStudents';

const Stack = createStackNavigator();
const StackNavigation = () => {
  return (
    <Stack.Navigator
      initialRouteName="Dashboard"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="Dashboard" component={BottomTabNavigation} />
      <Stack.Screen name="Test" component={TestScreen} />
      <Stack.Screen name="TestDetails" component={TestDetails} />
      <Stack.Screen name="EditTest" component={EditTests} />
      <Stack.Screen name="AddTest" component={AddTests} />
      <Stack.Screen name="TestPhotos" component={TestPhotos} />
      <Stack.Screen name="DashBoard" component={DashBoard} />
      <Stack.Screen name="SchoolRegistration" component={SchoolRegistration} />
      <Stack.Screen
        name="SchoolRequestScreen"
        component={SchoolRequestScreen}
      />
      <Stack.Screen name="SchoolsDashboard" component={SchoolsDashboard} />
      <Stack.Screen name="RequestedStudents" component={RequestedStudents} />
      <Stack.Screen name="ManageStudents" component={ManageStudents} />
      {/* <Stack.Screen name="Profile" component={BottomTabNavigation} /> */}
    </Stack.Navigator>
  );
};

export default StackNavigation;
