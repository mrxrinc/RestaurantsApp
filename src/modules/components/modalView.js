import React from 'react'
import { View } from "react-native-animatable"
import r from '../styles/rinc'

export default ModalView = props => (
  <View style={[r.hCenter, props.style]}>
    <View 
      style={[r.borderTR3, {
        height: 3,
        width: '80%',
        backgroundColor: 'rgba(255, 255, 255, 0.1)'
      }]} 
      animation={props.visible ? 'fadeIn' : ''}
      duration={200}
      delay={600}
      useNativeDriver
    />
    <View 
      style={[r.borderTR3, {
        height: 4,
        width: '90%',
        backgroundColor: 'rgba(255, 255, 255, 0.3)'
      }]} 
      animation={props.visible ? 'fadeIn' : ''}
      duration={300}
      delay={500}
      useNativeDriver
    />
    <View 
      style={[r.borderTR3, {
        height: 6,
        width: '95%',
        backgroundColor: 'rgba(255, 255, 255, 0.6)'
      }]} 
      animation={props.visible ? 'fadeIn' : ''}
      duration={500}
      delay={300}
      useNativeDriver
    />
    <View style={[r.bgWhite, r.full, r.wFull, r.overhide, r.borderTR4]}>
      {props.children}
    </View>
  </View>
)