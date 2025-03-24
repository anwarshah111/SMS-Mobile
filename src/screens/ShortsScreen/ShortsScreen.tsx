import {View, Text, FlatList, useWindowDimensions} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import useFetchVideos from '../../queries/HomeQueries/feedQueries';
import Shorts from '../../components/Sorts/Shorts';

const ShortsScreen = ({navigation}) => {
  const HEIGHT = useWindowDimensions().height;
  const {
    isLoading,
    data,
    hasNextPage,
    fetchNextPage,
    isPending,
    isFetchingNextPage,
  } = useFetchVideos();
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const viewabilityConfig = useRef({
    viewAreaCoveragePercentThreshold: 50,
  }).current;
  const onViewableItemsChanged = useRef(({viewableItems}: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0]?.index);
    }
  }).current;

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      setCurrentIndex(null);
    });
    return unsubscribe;
  }, [navigation]);

  return (
    <View>
      <FlatList
        data={data?.videos}
        pagingEnabled
        decelerationRate={'fast'}
        style={{}}
        showsVerticalScrollIndicator={false}
        // getItemLayout={(data, index) => ({
        //   length: HEIGHT - 83,
        //   offset: (HEIGHT - 83) * index,
        //   index,
        // })}
        onViewableItemsChanged={onViewableItemsChanged}
        onEndReachedThreshold={0.5}
        onEndReached={() =>
          hasNextPage && !isFetchingNextPage ? fetchNextPage() : null
        }
        viewabilityConfig={viewabilityConfig}
        renderItem={({item, index}) => (
          <Shorts
            item={item}
            index={index}
            isPlaying={currentIndex === index}
          />
        )}
      />
    </View>
  );
};

export default ShortsScreen;
