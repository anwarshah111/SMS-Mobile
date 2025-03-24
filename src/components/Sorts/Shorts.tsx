import {View, Text, useWindowDimensions} from 'react-native';
import React, {useEffect, useRef} from 'react';
import Video from 'react-native-video';
import ShortsOverlays from './ShortsOverlays';

const Shorts = ({item, index, isPlaying}) => {
  const videoRef = useRef(null);
  const HEIGHT = useWindowDimensions().height;

  useEffect(() => {
    if (!isPlaying && videoRef.current) {
      videoRef.current.pause(); 
    }
  }, [isPlaying]);
  return (
    <View style={{height: HEIGHT - 83}}>
      <Video
        ref={videoRef}
        source={{
          uri: item?.video_files?.[item?.video_files?.length - 1]?.link,
        }}
        repeat
        style={{flex: 1}}
        paused={!isPlaying}
        resizeMode="cover"
        progressUpdateInterval={250}
      />
      <ShortsOverlays videoData={item} />
    </View>
  );
};

export default Shorts;
