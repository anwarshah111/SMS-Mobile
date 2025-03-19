import {View, Text, Image} from 'react-native';
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen/ProfileScreen';
import SubscriptionScreen from '../screens/SubscriptionScreen/SubscriptionScreen';
import ShortsScreen from '../screens/ShortsScreen/ShortsScreen';
import Player from '../components/Home/Player';
import HomeIcon from '../assets/svgs/home-icon.svg';

const Tab = createBottomTabNavigator();

const BottomTabNavigation = () => {
  return (
    <View style={{flex: 1}}>
      <Tab.Navigator
        screenOptions={{headerShown: false, tabBarActiveTintColor: 'black'}}>
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{tabBarIcon: () => <HomeIcon width={20} height={20} />}}
        />
        <Tab.Screen name="Shorts" component={ShortsScreen} />
        <Tab.Screen name="Subscription" component={SubscriptionScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>

      {/* media Player */}
      {/* <Player /> */}
    </View>
  );
};

export default BottomTabNavigation;
