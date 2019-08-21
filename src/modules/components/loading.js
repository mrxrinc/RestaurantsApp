import React from 'react'
import { ActivityIndicator } from 'react-native'
import { View } from 'react-native-animatable'
import r from '../styles/rinc'


export default Loading = ({ duration, delay, size, color }) => (
  <View 
    style={[r.full, r.center]}
    animation={'fadeIn'}
    duration={duration ? duration : 300}
    delay={delay? delay : 100}
    useNativeDriver
  >
    <ActivityIndicator size={size} color={[color ? color : '#fff']}/>
  </View>
)

export const LoadingII = ({ duration, delay, size, color }) => (
  <View 
    style={[r.full, r.center]}
    animation={'fadeIn'}
    duration={duration ? duration : 200}
    delay={delay? delay : 50}
    useNativeDriver
  >
    <ActivityIndicator size={size ? size : 'small'} color={[color ? color : '#fff']}/>
  </View>
)