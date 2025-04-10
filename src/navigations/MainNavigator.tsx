import {View, Text} from 'react-native';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import StackNavigation from './StackNavigation';

const MainNavigator = ({isLoggedIn}: {isLoggedIn: string}) => {
  return (
    <NavigationContainer>
      <StackNavigation isLoggedIn={isLoggedIn} />
    </NavigationContainer>
  );
};

export default MainNavigator;
