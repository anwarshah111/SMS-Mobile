import {View, Text, PanResponder} from 'react-native';
import React, {useRef} from 'react';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import {PanGestureHandler} from 'react-native-gesture-handler';

const Player = () => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.startX = translateX.value;
      ctx.startY = translateY.value;
    },
    onActive: (event, ctx) => {
      translateX.value = ctx.startX + event.translationX;
      translateY.value = ctx.startY + event.translationY;
    },
    // onEnd: () => {
    //   translateX.value = withSpring(0);
    //   translateY.value = withSpring(0);
    // },
  });

  const animatedPlayerStyle = useAnimatedStyle(() => ({
    transform: [{translateX: translateX.value}, {translateY: translateY.value}],
  }));
  return (
    <PanGestureHandler onGestureEvent={gestureHandler}>
      <Animated.View
        style={[
          animatedPlayerStyle,
          {
            backgroundColor: 'red',
            width: 200,
            height: 130,
            position: 'absolute',
            bottom: 100,
            borderColor: 'black',
            borderWidth: 1,
            right: 10,
          },
        ]}>
        <Text>Player</Text>
      </Animated.View>
    </PanGestureHandler>
  );
};

export default Player;
