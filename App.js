/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useRef, useState} from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  Image,
  View,
  TouchableWithoutFeedback,
  Animated,
} from 'react-native';

import {Container} from './components/container';
import ArrowImage from './images/arrow.png';
import LogoDark from './images/logo-dark.png';
import Logo from './images/logo.png';
import PlayImage from './images/play.png';
import PauseImage from './images/pause.png';
import AlarmClock from './images/alarm-clock.png';
import {ProgressCircular} from './components/circle';

const screenSize = Dimensions.get('screen');

const widthFactor = screenSize.width / 1024;
const heightFactor = screenSize.height / 1366;
const diagonalFactor =
  Math.sqrt(
    screenSize.width * screenSize.width + screenSize.height * screenSize.height,
  ) / Math.sqrt(1024 * 1024 + 1366 * 1366);

export const responsive = {
  width: size => size * widthFactor,
  height: size => size * heightFactor,
  diagonal: size => size * diagonalFactor,
};

const App = () => {
  const [time, setTime] = useState(60);
  const [isRunning, setIsRunning] = useState(false);
  const [letfTime, setLetfTime] = useState(0);
  const [percentage, setPercentage] = useState(0);
  const [order, setOrder] = useState('Inhale');
  const [stopProgress, setStopProgress] = useState(false);
  const [animationLogo, setAnimationLogo] = useState(null);
  const animated = useRef(new Animated.Value(1)).current;
  const logoRef = useRef();

  const animateLogo = (toValue, duration) => {
    return Animated.timing(animated, {
      toValue,
      duration,
      useNativeDriver: false,
    });
  };

  const start = () => {
    setStopProgress(false);
    setIsRunning(true);
    setLetfTime(time);
    setPercentage(100);
    setOrder('Inhale');
    const durationAnimationLogo = time * 1000 * 0.35;
    const a = animateLogo(2, durationAnimationLogo);
    setAnimationLogo(a);
    a.start(() => {
      animateLogo(1, time * 1000 - durationAnimationLogo).start();
    });
  };

  const stop = () => {
    setIsRunning(false);
    setStopProgress(true);
    setPercentage(0);
    animationLogo.reset();
  };

  const formatTime = t => {
    const minutes = Math.floor(t / 60);
    const seconds = t - minutes * 60;
    return `0${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
  };

  const updatePct = pct => {
    const timeDone = Math.ceil(time * (pct / 100));
    setLetfTime(() => time - timeDone);
    if (pct > 35) {
      setOrder('Exhale');
    }
    if (pct === 100) {
      setIsRunning(false);
      setPercentage(0);
    }
  };

  useEffect(() => {
    animated.addListener(v => {
      if (logoRef?.current) {
        logoRef.current.setNativeProps({
          style: [
            styles.logo,
            {
              transform: [
                {
                  scale: v.value,
                },
              ],
            },
          ],
        });
      }
    });
  });

  return (
    <Container>
      <Image style={styles.arrowImage} source={ArrowImage} />
      <Text style={styles.title}>Breathe & relax</Text>
      <Text style={styles.subtitle}>{isRunning ? order : ''}</Text>
      <ProgressCircular
        stop={stopProgress}
        percentage={percentage}
        duration={isRunning ? time * 1000 : 0}
        radius={responsive.diagonal(360) / 2}
        style={styles.circle}
        color="rgba(15, 16, 32, 0.4)"
        strokeWidth={responsive.diagonal(7)}
        onChange={updatePct}>
        <View style={styles.subCircle}>
          <View style={{...styles.subCircle, opacity: 0.8, padding: 0}}>
            <Image
              ref={logoRef}
              style={styles.logo}
              source={isRunning ? Logo : LogoDark}
            />
          </View>
        </View>
      </ProgressCircular>
      <Text style={styles.time}>{isRunning ? formatTime(letfTime) : ''}</Text>
      <TouchableWithoutFeedback onPress={() => (isRunning ? stop() : start())}>
        <Image
          style={styles.startBtn}
          source={isRunning ? PauseImage : PlayImage}
        />
      </TouchableWithoutFeedback>
      <View style={styles.timeBtnsRow}>
        <TouchableWithoutFeedback onPress={() => setTime(60)}>
          <View
            style={[styles.timeBtn, time === 60 ? styles.activeTimeBtn : null]}>
            <Image style={styles.timeBtnImg} source={AlarmClock} />
            <Text style={styles.timeBtnTime}> 1 min</Text>
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={() => setTime(120)}>
          <View
            style={[
              styles.timeBtn,
              time === 120 ? styles.activeTimeBtn : null,
            ]}>
            <Image style={styles.timeBtnImg} source={AlarmClock} />
            <Text style={styles.timeBtnTime}> 2 min</Text>
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={() => setTime(180)}>
          <View
            style={[
              styles.timeBtn,
              time === 180 ? styles.activeTimeBtn : null,
            ]}>
            <Image style={styles.timeBtnImg} source={AlarmClock} />
            <Text style={styles.timeBtnTime}> 3 min</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  arrowImage: {
    height: responsive.diagonal(19),
    width: responsive.diagonal(7),
  },
  title: {
    marginTop: responsive.height(100),
    textAlign: 'center',
    color: '#fff',
    fontWeight: '600',
    fontSize: responsive.diagonal(36),
    lineHeight: responsive.diagonal(43),
  },
  subtitle: {
    marginTop: responsive.height(90),
    textAlign: 'center',
    color: '#fff',
    fontWeight: '400',
    fontSize: responsive.diagonal(34),
    lineHeight: responsive.diagonal(41),
  },
  circle: {
    alignSelf: 'center',
    marginTop: responsive.height(32),
  },
  subCircle: {
    borderRadius: responsive.diagonal(360),
    padding: responsive.diagonal(20),
    backgroundColor: '#7B66FF',
    opacity: 0.4,
    marginTop: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: responsive.diagonal(93),
    height: responsive.diagonal(83),
    zIndex: 2,
  },
  time: {
    marginTop: responsive.height(57),
    textAlign: 'center',
    color: '#fff',
    fontWeight: '600',
    fontSize: responsive.diagonal(24),
    lineHeight: responsive.diagonal(29),
  },
  startBtn: {
    marginTop: responsive.height(58),
    width: responsive.diagonal(91),
    height: responsive.diagonal(91),
    alignSelf: 'center',
  },
  timeBtnsRow: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    marginTop: responsive.height(80),
  },
  timeBtn: {
    width: responsive.width(180),
    height: responsive.height(53),
    borderRadius: responsive.diagonal(11),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: responsive.width(15),
  },
  timeBtnImg: {
    width: responsive.diagonal(31),
    height: responsive.diagonal(31),
  },
  timeBtnTime: {
    fontWeight: '400',
    fontSize: responsive.diagonal(23),
    lineHeight: responsive.diagonal(28),
    color: '#fff',
  },
  activeTimeBtn: {
    backgroundColor: 'rgba(15, 16, 32, 0.3)',
  },
});

export default App;
