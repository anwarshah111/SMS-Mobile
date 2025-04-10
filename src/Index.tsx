import {View, Text, Image} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import MainNavigator from './navigations/MainNavigator';

import Toast from 'react-native-toast-message';

import AsyncStorage from '@react-native-async-storage/async-storage';
import SplashScreen from './screens/SplashScreen/SplashScreen';
import {useFetchLoginStudentDetails} from './queries/studentQueries/studentQueries';
import {toastConfig} from './components/Toasters/CustomToasts';
import {useFetchSchoolDetailsByIdQuery} from './queries/schoolQueries/schoolQueries';

const Index = () => {
  // const insets = useSafeAreaInsets();
  const [isLoggedIn, setLoggedIn] = useState('StudentLogin');
  const [isSplashVisible, setSplashVisible] = useState(true);

  useFetchLoginStudentDetails(null, true);
  useFetchSchoolDetailsByIdQuery(null, true);

  const checkLogin = async () => {
    try {
      const startTime = Date.now();
      const studentID = await AsyncStorage.getItem('@STUDENT_ID');
      const SchoolToken = await AsyncStorage.getItem('@SCHOOOL_TOKEN');

      if (studentID) {
        setLoggedIn('DashBoard');
      } else if (SchoolToken) {
        setLoggedIn('SchoolsDashboard');
      }
      // Ensure splash screen shows for at least 1.5 seconds
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, 1500 - elapsedTime);

      setTimeout(() => {
        setSplashVisible(false);
      }, remainingTime);
    } catch (error) {
      console.error('Error checking login status:', error);
      setSplashVisible(false);
    }
  };

  useEffect(() => {
    checkLogin();
  }, []);

  if (isSplashVisible) {
    return <SplashScreen />;
  }
  return (
    <SafeAreaProvider>
      <MainNavigator isLoggedIn={isLoggedIn} />
      <Toast config={toastConfig} />
    </SafeAreaProvider>
  );
};

export default Index;
