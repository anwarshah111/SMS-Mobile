import React, {useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';

/**
 * VideoProgressBar - A smooth, animated progress bar for video playback using Reanimated
 *
 * @param {Object} props
 * @param {number} props.currentTime - Current playback time in seconds
 * @param {number} props.duration - Total video duration in seconds
 * @param {string} props.progressColor - Color of the progress bar (default: '#FF0000')
 * @param {string} props.backgroundColor - Color of the background track (default: '#E0E0E0')
 * @param {number} props.height - Height of the progress bar (default: 5)
 * @param {number} props.borderRadius - Border radius of the progress bar (default: 2.5)
 */
const PlayerDurationBar = ({
  currentTime = 0,
  duration = 0,
  progressColor = 'red',
  backgroundColor = '#E0E0E0',
  height = 5,
  borderRadius = 2.5,
}) => {
  // Use a shared value for tracking progress percentage
  const progress = useSharedValue(0);
  // Store previous time to detect seeking
  const prevTime = useSharedValue(currentTime);

  // Calculate progress percentage
  const getProgressPercentage = () => {
    if (duration <= 0) return 0;
    return (currentTime / duration) * 100;
  };

  // For debugging
  // console.log('Current time:', currentTime);
  // console.log('Duration:', duration);
  // console.log('Progress percentage:', getProgressPercentage());

  useEffect(() => {
    const newProgress = getProgressPercentage();

    // Determine if this is a seek operation or normal playback
    const isSeek = Math.abs(currentTime - prevTime.value) > 1;
    prevTime.value = currentTime;

    // Use different timing configurations based on the type of update
    progress.value = withTiming(newProgress, {
      duration: isSeek ? 100 : 300,
      easing: isSeek ? Easing.out(Easing.ease) : Easing.linear,
    });
  }, [currentTime, duration]);

  // Create animated style for the progress bar
  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: `${progress.value}%`,
    };
  });

  return (
    <View style={[styles.container, {height, borderRadius, backgroundColor}]}>
      <Animated.View
        style={[
          styles.progress,
          animatedStyle,
          {
            height,
            borderRadius,
            backgroundColor: progressColor,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    overflow: 'hidden',
    // marginVertical: 10, // Added to ensure visibility
  },
  progress: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
});

export default PlayerDurationBar;