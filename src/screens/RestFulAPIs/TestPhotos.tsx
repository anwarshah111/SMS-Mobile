import React from 'react';
import {View, Text, FlatList, StyleSheet, Dimensions} from 'react-native';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SecondryHeader from '../../components/Headers/SecondryHeader';
import {useSamplePhotos} from '../../queries/TestQueries/testQueries';
import Loading from '../../components/Loading/Loading';

const {width} = Dimensions.get('window');

const TestPhotos: React.FC = () => {
  const {data, hasNextPage, isFetchingNextPage, fetchNextPage} =
    useSamplePhotos();

  return (
    <View style={styles.container}>
      <SecondryHeader title={'Photos'} showBack={true} />
      <View
        style={{
          paddingHorizontal: 20,
          paddingVertical: 5,
          backgroundColor: 'pink',
        }}>
        <Text style={{textAlign: 'center', color: 'black'}}>
          Caching the images and data here using react infinite query
        </Text>
      </View>
      <FlatList
        data={data?.photos}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={Loading}
        ListFooterComponent={() => (isFetchingNextPage ? <Loading /> : null)}
        onEndReachedThreshold={0.5}
        windowSize={20}
        initialNumToRender={20}
        maxToRenderPerBatch={20}
        onEndReached={() => {
          if (!isFetchingNextPage && hasNextPage) {
            fetchNextPage();
          }
        }}
        renderItem={({item}) => (
          <View style={styles.card}>
            <View style={styles.imageContainer}>
              <FastImage
                source={{uri: item?.src?.original}}
                style={styles.image}
                resizeMode={FastImage.resizeMode.cover}
              />
              <View style={styles.cameraIconContainer}>
                <Icon name="camera" color="white" size={20} />
              </View>
            </View>

            <View style={styles.contentContainer}>
              <Text style={styles.title} numberOfLines={2}>
                {item?.alt}
              </Text>

              <View style={styles.photographerContainer}>
                <Text style={styles.photographerLabel}>Photographer:</Text>
                <Text style={styles.photographerName} numberOfLines={1}>
                  {item?.photographer}
                </Text>
              </View>

              <Text style={styles.description} numberOfLines={3}>
                {item?.alt}
              </Text>
            </View>
          </View>
        )}
        keyExtractor={(item, index) => item?.id?.toString() || index.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    width: width * 0.9,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    marginVertical: 8,
    shadowRadius: 4,
    elevation: 3,
    alignSelf: 'center',
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 250,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  cameraIconContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 8,
    borderRadius: 20,
  },
  contentContainer: {
    padding: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  photographerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  photographerLabel: {
    fontSize: 14,
    color: '#666',
    marginRight: 5,
  },
  photographerName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  description: {
    fontSize: 14,
    color: '#666',
  },
});

export default TestPhotos;
