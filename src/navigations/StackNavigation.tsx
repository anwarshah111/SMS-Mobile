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
import StudentLogin from '../screens/Students/StudentsLogin';
import SchoolLogin from '../screens/Schools/SchoolLogin';
import StudentsRegistration from '../screens/Students/StudentsRegistration';
import SchoolProfileScreen from '../screens/Schools/SchoolProfileScreen';
import AddTeachersScreen from '../screens/Schools/AddTeachers';
import TeachersScreen from '../screens/Schools/Teachers';
import ClassroomScreen from '../screens/Schools/ClassRoom';
import AddClassroomScreen from '../screens/Schools/AddClasses';
import AddSubjectsScreen from '../screens/Schools/AddSubjects';
import SubjectsScreen from '../screens/Schools/Subjects';

const Stack = createStackNavigator();
const StackNavigation = ({isLoggedIn}: {isLoggedIn: string}) => {
  const initialRouteName = isLoggedIn;
  return (
    <Stack.Navigator
      initialRouteName={initialRouteName}
      screenOptions={{headerShown: false}}>
      {/* <Stack.Screen name="Dashboard" component={BottomTabNavigation} /> */}
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
      <Stack.Screen name="StudentLogin" component={StudentLogin} />
      <Stack.Screen name="SchoolLogin" component={SchoolLogin} />
      <Stack.Screen
        name="StudentsRegistration"
        component={StudentsRegistration}
      />
      <Stack.Screen
        name="SchoolProfileScreen"
        component={SchoolProfileScreen}
      />
      <Stack.Screen name="AddTeachersScreen" component={AddTeachersScreen} />
      <Stack.Screen name="TeachersScreen" component={TeachersScreen} />
      <Stack.Screen name="ClassroomScreen" component={ClassroomScreen} />
      <Stack.Screen name="AddClassroomScreen" component={AddClassroomScreen} />
      <Stack.Screen name="AddSubjectsScreen" component={AddSubjectsScreen} />
      <Stack.Screen name="SubjectsScreen" component={SubjectsScreen} />
      {/* <Stack.Screen name="Profile" component={BottomTabNavigation} /> */}
    </Stack.Navigator>
  );
};

export default StackNavigation;
