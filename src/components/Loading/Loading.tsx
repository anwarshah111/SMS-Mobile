import {View, Text, ActivityIndicator} from 'react-native';
import React from 'react';

const Loading = () => {
  return (
    <View>
      <ActivityIndicator size={20} color="#0000ff" />
    </View>
  );
};

export default Loading;
