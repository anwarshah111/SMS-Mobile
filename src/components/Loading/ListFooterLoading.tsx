import {View, Text} from 'react-native';
import React from 'react';
import Loading from './Loading';

const ListFooterLoading = ({
  isFetchingNextPage,
}: {
  isFetchingNextPage: boolean;
}) => {
  if (isFetchingNextPage) {
    return (
      <View style={{paddingVertical: 10, backgroundColor: 'white'}}>
        <Loading />
      </View>
    );
  }
};

export default ListFooterLoading;
