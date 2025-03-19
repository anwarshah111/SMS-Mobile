import {View, Text} from 'react-native';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import StackNavigation from './StackNavigation';

const MainNavigator = () => {
  const animatedPlayerStyle = {};

  return (
    <NavigationContainer>
      <StackNavigation />
    </NavigationContainer>
  );
};

export default MainNavigator;
