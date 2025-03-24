import {View, Text, Image} from 'react-native';
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen/ProfileScreen';
import SubscriptionScreen from '../screens/SubscriptionScreen/SubscriptionScreen';
import ShortsScreen from '../screens/ShortsScreen/ShortsScreen';
import Player from '../components/Home/Player';
import HomeIcon from '../assets/svgs/home-icon.svg';
import CourseIcon from '../assets/svgs/course-icon.svg';
import ShortIcon from '../assets/svgs/short-icon.svg';
import ProfileIcon from '../assets/svgs/profile-icon.svg';

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
        <Tab.Screen
          name="Shorts"
          component={ShortsScreen}
          options={{tabBarIcon: () => <ShortIcon width={20} height={20} />}}
        />
        <Tab.Screen
          name="Subscription"
          component={SubscriptionScreen}
          options={{tabBarIcon: () => <CourseIcon width={20} height={20} />}}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{tabBarIcon: () => <ProfileIcon width={20} height={20} />}}
        />
      </Tab.Navigator>

      {/* media Player */}
      {/* <Player /> */}
    </View>
  );
};

export default BottomTabNavigation;
