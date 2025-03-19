import {View, FlatList, Platform} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import VideoCards from '../../components/Home/VideoCards';
import MainHeader from '../../components/Headers/MainHeader';
import useFetchVideos from '../../queries/HomeQueries/feedQueries';
import Loading from '../../components/Loading/Loading';
import ListFooterLoading from '../../components/Loading/ListFooterLoading';

const HomeScreen = ({navigation}: any) => {
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const viewabilityConfig = useRef({
    viewAreaCoveragePercentThreshold: 50,
  }).current;

  const {
    isLoading,
    data,
    hasNextPage,
    fetchNextPage,
    isPending,
    isFetchingNextPage,
  } = useFetchVideos();

  const onViewableItemsChanged = useRef(({viewableItems}: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0]?.index); // Only track the first fully visible item
    }
  }).current;

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      setCurrentIndex(null); // Stop playing when screen loses focus
    });
    return unsubscribe;
  }, [navigation]);

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <MainHeader title="TechTube" />
      {isPending ? (
        <Loading />
      ) : (
        <FlatList
          contentContainerStyle={{
            backgroundColor: '#C4C4C4',
            rowGap: 10,
          }}
          showsVerticalScrollIndicator={false}
          data={data?.videos || []}
          renderItem={({item, index}) => (
            <VideoCards
              item={item}
              index={index}
              isPlaying={index === currentIndex}
            />
          )}
          keyExtractor={(item, index) => index.toString()}
          removeClippedSubviews={Platform.OS === 'android'}
          windowSize={15}
          initialNumToRender={5}
          maxToRenderPerBatch={5}
          onEndReachedThreshold={0.5}
          ListFooterComponent={() => (
            <ListFooterLoading isFetchingNextPage={isFetchingNextPage} />
          )}
          onEndReached={() => (hasNextPage ? fetchNextPage() : null)}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
        />
      )}
    </View>
  );
};

export default HomeScreen;
