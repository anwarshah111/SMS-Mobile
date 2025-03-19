import {
  View,
  Text,
  Image,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import ThreeDotsIcon from '../../assets/svgs/three-dot-icon.svg';
import PauseIcon from '../../assets/svgs/pause-icon.svg';
import PlayIcon from '../../assets/svgs/play-icon.svg';
import VolumeOn from '../../assets/svgs/volume-on-icon.svg';
import VolumeOff from '../../assets/svgs/volume-off-icon.svg';
import Video from 'react-native-video';
import PlayerDurationBar from '../PlayerDurationBar/PlayerDurationBar';
import Animated, {FadeIn} from 'react-native-reanimated';

const VideoCards = ({item, index, isPlaying}) => {
  const [muted, setMuted] = useState(true);
  const [isPaused, setPaused] = useState(!isPlaying);
  const [currentTime, setCurrentTime] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [duration, setDuration] = useState(0);
  const videoRef = useRef(null);
  const [isReady, setIsReady] = useState(false);

  // Reference to track if component is mounted
  const isMounted = useRef(true);

  useEffect(() => {
    if (!isPlaying && videoRef.current) {
      videoRef.current.pause(); // Pause video when not playing
    }
  }, [isPlaying]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Handle video progress updates
  const onProgress = data => {
    if (isMounted.current) {
      setCurrentTime(data.currentTime);
    }
  };

  // Handle video loading
  const onLoad = data => {
    if (isMounted.current) {
      setDuration(data.duration);
      setIsReady(true);
    }
  };

  // Auto-hide controls after 3 seconds
  useEffect(() => {
    if (isHovered) {
      const timer = setTimeout(() => {
        setIsHovered(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isHovered]);

  // Handle video playback
  const togglePlayback = () => {
    setPaused(prev => {
      // if (prev) {
      // }
      return !prev;
    });
  };

  // Handle mute toggle
  const toggleMute = () => {
    setMuted(prev => !prev);
  };

  return (
    <Animated.View entering={FadeIn.duration(300).delay((index % 10) * 100)}>
      <TouchableWithoutFeedback
        onPress={() => {
          setIsHovered(true);
        }}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'white',
            width: '100%',
            height: 303,
          }}>
          <View style={{height: 215}}>
            <Video
              source={{
                uri: item?.video_files?.[item?.video_files?.length - 1]?.link,
              }}
              style={{flex: 1}}
              ref={videoRef}
              onProgress={onProgress}
              onLoad={onLoad}
              muted={muted}
              paused={!isPlaying}
              resizeMode="cover"
              progressUpdateInterval={250}
            />
            {isHovered && (
              <View
                style={{
                  position: 'absolute',
                  alignItems: 'center',
                  justifyContent: 'center',
                  left: 0,
                  bottom: 0,
                  right: 0,
                  backgroundColor: 'rgba(0,0,0,0.3)',
                  top: 0,
                }}>
                <TouchableOpacity onPress={togglePlayback}>
                  {isPaused ? (
                    <PlayIcon width={40} height={40} color={'#FFF'} />
                  ) : (
                    <PauseIcon width={40} height={40} color={'#FFF'} />
                  )}
                </TouchableOpacity>

                <View style={{position: 'absolute', bottom: 20, left: 20}}>
                  <TouchableOpacity onPress={toggleMute}>
                    {muted ? (
                      <VolumeOff width={25} height={25} color={'#FFF'} />
                    ) : (
                      <VolumeOn width={25} height={25} color={'#FFF'} />
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
          <View>
            <PlayerDurationBar
              currentTime={currentTime}
              duration={duration}
              progressColor="red"
              height={2}
              backgroundColor="#E0E0E0"
            />
            <View
              style={{
                flexDirection: 'row',
                marginTop: 15,
                alignItems: 'center',
                paddingHorizontal: 15,
                justifyContent: 'space-between',
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  columnGap: 10,
                }}>
                <View>
                  <Image
                    source={{uri: item?.image}}
                    style={{width: 40, height: 40, borderRadius: 20}}
                  />
                </View>
                <View>
                  <Text style={{fontSize: 14, color: 'black'}}>
                    {item?.user?.name}
                  </Text>
                </View>
              </View>
              <View>
                <ThreeDotsIcon width={20} height={20} />
              </View>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Animated.View>
  );
};

export default VideoCards;
