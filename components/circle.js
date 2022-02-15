/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useRef, useState} from 'react';
import {View, Animated, StyleSheet} from 'react-native';
import Svg, {G, Circle} from 'react-native-svg';
import {responsive} from '../App';

export const ProgressCircular = ({
  children,
  percentage = 0,
  radius = 0,
  strokeWidth = 0,
  duration = 15000,
  color = '#fff',
  delay = 0,
  onChange,
  stop,
}) => {
  const [animationRef, setAnimation] = useState(null);
  const circleRef = useRef();
  const indicatorRef = useRef();
  const halfCircle = radius + strokeWidth;
  const circleCircumference = 2 * Math.PI * radius;
  const animated = useRef(new Animated.Value(0)).current;

  const indicatorRadius = responsive.diagonal(23) / 2;
  const ZERO = radius - indicatorRadius;

  const indicatorPos = {
    x: ZERO - strokeWidth,
    y: ZERO - 1 * radius + strokeWidth,
  };

  const updateIndicatorPos = v => {
    const angle = 360 * ((v || 0) / 100);
    const sincos = {
      sin: Number(Math.sin((angle * Math.PI) / 180).toFixed(2)),
      cos: Number(Math.cos((angle * Math.PI) / 180).toFixed(2)),
    };
    let indicatorPosUpdate = {};
    if (angle <= 90) {
      indicatorPosUpdate = {
        x: ZERO + sincos.sin * radius - strokeWidth,
        y: ZERO - sincos.cos * radius + strokeWidth,
      };
    } else if (angle <= 180) {
      indicatorPosUpdate = {
        x: ZERO + sincos.sin * radius - strokeWidth,
        y: ZERO - sincos.cos * radius - strokeWidth,
      };
    } else if (angle <= 270) {
      indicatorPosUpdate = {
        x: ZERO + sincos.sin * radius + strokeWidth,
        y: ZERO - sincos.cos * radius - strokeWidth,
      };
    } else {
      indicatorPosUpdate = {
        x: ZERO + sincos.sin * radius + strokeWidth,
        y: ZERO - sincos.cos * radius + strokeWidth,
      };
    }
    indicatorRef.current.setNativeProps({
      style: [
        styles.indicator,
        {
          width: indicatorRadius * 2,
          height: indicatorRadius * 2,
          top: indicatorPosUpdate.y,
          left: indicatorPosUpdate.x,
        },
      ],
    });
  };

  const animation = toValue => {
    const a = Animated.timing(animated, {
      toValue,
      duration,
      delay,
      useNativeDriver: false,
    });
    setAnimation(a);
    a.start();
  };

  useEffect(() => {
    if (stop) {
      animationRef.stop();
      animation(0);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stop]);

  useEffect(() => {
    animation(percentage);
    animated.addListener(v => {
      onChange(v.value);
      updateIndicatorPos(v.value);
      const strokeDashoffset =
        circleCircumference - (circleCircumference * v.value) / 100;
      if (circleRef.current) {
        circleRef.current.setNativeProps({
          strokeDashoffset,
        });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [percentage]);

  return (
    <View style={styles.container}>
      <Svg
        width={radius * 2}
        height={radius * 2}
        viewBox={`0 0 ${halfCircle * 2} ${halfCircle * 2}`}>
        <G rotation="-90" origin={`${halfCircle}, ${halfCircle}`}>
          <Circle
            cx="50%"
            cy="50%"
            strokeWidth={strokeWidth}
            stroke="rgba(252, 252, 252, 0.4)"
            fill="transparent"
            r={radius}
          />
          <Circle
            ref={circleRef}
            cx="50%"
            cy="50%"
            strokeWidth={strokeWidth}
            stroke={color}
            fill="transparent"
            r={radius}
            strokeDasharray={circleCircumference}
            strokeDashoffset={circleCircumference}
            strokeLinecap="square"
          />
        </G>
      </Svg>
      <View
        ref={indicatorRef}
        style={[
          styles.indicator,
          {
            width: indicatorRadius * 2,
            height: indicatorRadius * 2,
            top: indicatorPos.y,
            left: indicatorPos.x,
          },
        ]}
      />
      <View
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          padding: strokeWidth * 4,
        }}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    marginTop: responsive.height(82),
    width: responsive.diagonal(360),
    height: responsive.diagonal(360),
    position: 'relative',
  },
  indicator: {
    position: 'absolute',
    borderRadius: 9999,
    backgroundColor: '#fff',
  },
});
