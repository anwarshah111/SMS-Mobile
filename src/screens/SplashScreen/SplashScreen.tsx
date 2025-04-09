import { View, Text, Animated, Easing } from 'react-native';
import React, { useEffect, useRef } from 'react';

const SplashScreen = () => {
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start animations when component mounts
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.back(1.5)),
        useNativeDriver: true,
      }),
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 1200,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Interpolate rotation for circular motion effect
  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF' }}>
      {/* Animated logo placeholder */}
      <Animated.View
        style={{
          transform: [{ scale: scaleAnim }, { rotate: spin }],
          opacity: fadeAnim,
          marginBottom: 20,
        }}
      >
        <View style={{ 
          width: 100, 
          height: 100, 
          borderRadius: 50, 
          backgroundColor: '#3498db',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <Text style={{ fontSize: 40, fontWeight: 'bold', color: 'white' }}>S</Text>
        </View>
      </Animated.View>

      {/* App name with fade-in animation */}
      <Animated.Text
        style={{
          fontSize: 24,
          fontWeight: 'bold',
          color: '#333',
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        }}
      >
        School Connect
      </Animated.Text>

      {/* Tagline with delayed fade-in */}
      <Animated.Text
        style={{
          fontSize: 16,
          color: '#666',
          marginTop: 10,
          opacity: fadeAnim,
        }}
      >
        Empowering Education
      </Animated.Text>
    </View>
  );
};

export default SplashScreen;