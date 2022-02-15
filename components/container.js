/* eslint-disable prettier/prettier */
import React from 'react';
import { StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { responsive } from '../App';

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    paddingTop: responsive.height(83),
    paddingLeft: responsive.width(112),
    paddingRight: responsive.width(112),
  },
});

export const Container = ({ children }) => {
  return <LinearGradient style={styles.container} colors={['#BCBCC7', '#7B66FF']}>
    {children}
  </LinearGradient>;
};
