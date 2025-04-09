import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import HomeScreen from './HomeScreen';
import StudentProfileScreen from '../Students/StudentProfile';

// Sample screen components

const CalendarScreen = () => (
  <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
    <Text>Calendar Screen</Text>
  </View>
);
const ProgressScreen = () => (
  <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
    <Text>Progress Screen</Text>
  </View>
);

// Empty component for the center button
const CreateScreen = () => <View />;

const Tab = createBottomTabNavigator();

// Custom tab bar component
const CustomTabBar = ({state, descriptors, navigation}) => {
  return (
    <View style={styles.bottomNavContainer}>
      {state.routes.map((route, index) => {
        const {options} = descriptors[route.key];
        const label = options.tabBarLabel || route.name;
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        // Center button (Create)
        if (route.name === 'Create') {
          return (
            <TouchableOpacity
              key={index}
              style={styles.navItemCenter}
              onPress={onPress}>
              <LinearGradient
                colors={['#4C6EFF', '#6C8FFF']}
                style={styles.navCenterButton}>
                <Icon name="plus" size={26} color="#FFF" />
              </LinearGradient>
            </TouchableOpacity>
          );
        }

        // Other tab items
        return (
          <TouchableOpacity
            key={index}
            style={styles.navItem}
            onPress={onPress}>
            <Icon
              name={
                route.name === 'Home'
                  ? 'home-variant'
                  : route.name === 'Calendar'
                  ? 'calendar-month'
                  : route.name === 'Progress'
                  ? 'chart-line'
                  : 'account'
              }
              size={24}
              color={isFocused ? '#4C6EFF' : '#78909C'}
            />
            <Text style={[styles.navText, isFocused && {color: '#4C6EFF'}]}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default function DashBoard() {
  return (
    <Tab.Navigator
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Calendar" component={CalendarScreen} />
      <Tab.Screen name="Create" component={CreateScreen} />
      <Tab.Screen name="Progress" component={ProgressScreen} />
      <Tab.Screen name="Profile" component={StudentProfileScreen} />
    </Tab.Navigator>
  );
}

const styles = {
  bottomNavContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -3},
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navItemCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -30,
  },
  navCenterButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4C6EFF',
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
  },
  navText: {
    color: '#78909C',
    fontSize: 11,
    marginTop: 3,
  },
};
