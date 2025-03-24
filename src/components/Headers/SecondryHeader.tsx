import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const SecondryHeader = ({
  title, 
  showBack = true, 
  rightButtonIcon, 
  rightButtonAction,
  rightButtonColor = '#333'
}) => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 15,
        paddingTop: insets.top,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
      }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {showBack && (
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
        )}
        <Text
          style={{
            fontSize: 18,
            fontWeight: 'bold',
            marginLeft: showBack ? 10 : 0,
            color: '#333',
          }}>
          {title}
        </Text>
      </View>
      
      {rightButtonIcon && (
        <TouchableOpacity onPress={rightButtonAction}>
          <MIcon name={rightButtonIcon} size={24} color={rightButtonColor} />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default SecondryHeader;