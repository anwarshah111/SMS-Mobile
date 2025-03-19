import {View, Text} from 'react-native';
import React from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const MainHeader = ({title}: {title: string}) => {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{
        paddingTop: insets.top,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#c4c4c4',
        backgroundColor: 'white',
      }}>
      <Text style={{color: 'red', fontSize: 18, fontWeight: 'bold'}}>
        {title}
      </Text>
    </View>
  );
};

export default MainHeader;
