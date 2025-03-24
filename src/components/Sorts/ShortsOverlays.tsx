import React from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const {width} = Dimensions.get('window');

const ShortsOverlays = ({videoData}) => {
  const data = {
    title: videoData?.user?.name || '',
    username: '@' + videoData?.user?.name,
    likes: videoData?.width,
    comments: videoData?.height,
    description:
      'The sunset at Uluwatu temple is absolutely breathtaking! #travel #bali #sunset',
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0.3)', 'transparent']}
        style={styles.topGradient}>
        <View style={styles.topBarContent}>
          <View style={styles.leftSection}>
            {/* <Icon name="arrow-left" size={24} color="#FFFFFF" /> */}
          </View>
          <View style={styles.centerSection}>
            <Text style={styles.shortsText}>Shorts</Text>
          </View>
          <View style={styles.rightSection}>
            <Icon
              name="magnify"
              size={24}
              color="#FFFFFF"
              style={styles.iconSpacing}
            />
            <Icon
              name="camera"
              size={24}
              color="#FFFFFF"
              style={styles.iconSpacing}
            />
            <Icon name="dots-vertical" size={24} color="#FFFFFF" />
          </View>
        </View>
      </LinearGradient>

      <View style={styles.videoInfoContainer}>
        <LinearGradient colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.6)']}>
          <View style={{paddingHorizontal: 20, paddingVertical: 20}}>
            <View style={styles.titleContainer}>
              <Text style={styles.videoTitle}>{data.title}</Text>
              <Text style={styles.username}>{data.username}</Text>
            </View>

            <Text style={styles.description}>{data.description}</Text>
          </View>
        </LinearGradient>
      </View>

      <View style={styles.interactionContainer}>
        <View style={styles.interactionButton}>
          <Icon name="thumb-up-outline" size={28} color="#FFFFFF" />
          <Text style={styles.interactionText}>{data.likes}</Text>
        </View>

        <View style={styles.interactionButton}>
          <Icon name="comment-outline" size={28} color="#FFFFFF" />
          <Text style={styles.interactionText}>{data.comments}</Text>
        </View>

        <View style={styles.interactionButton}>
          <Icon name="share-outline" size={28} color="#FFFFFF" />
          <Text style={styles.interactionText}>Share</Text>
        </View>

        <View style={styles.interactionButton}>
          <Icon name="reply" size={28} color="#FFFFFF" />
          <Text style={styles.interactionText}>Remix</Text>
        </View>

        <View style={styles.interactionButton}>
          <View style={styles.profileIcon}>
            <Text style={styles.profileText}>
              {data.title?.slice(0, 1).toUpperCase()}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  topGradient: {
    height: 80,
    width: '100%',
    position: 'absolute',
    top: 0,
  },
  topBarContent: {
    flexDirection: 'row',
    paddingTop: 50,
    paddingHorizontal: 15,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftSection: {
    flex: 1,
    alignItems: 'flex-start',
  },
  centerSection: {
    flex: 2,
    alignItems: 'center',
  },
  rightSection: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  shortsText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  iconSpacing: {
    marginRight: 15,
  },
  videoInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  titleContainer: {
    marginBottom: 10,
  },
  videoTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  username: {
    color: '#FFFFFF',
    fontSize: 14,
    marginTop: 4,
  },
  description: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  interactionContainer: {
    position: 'absolute',
    right: 15,
    bottom: 0,
    alignItems: 'center',
  },
  interactionButton: {
    alignItems: 'center',
    marginBottom: 20,
  },
  interactionText: {
    color: '#FFFFFF',
    fontSize: 12,
    marginTop: 5,
  },
  profileIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#555',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  profileText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ShortsOverlays;
