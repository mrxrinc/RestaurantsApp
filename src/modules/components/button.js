import React from 'react'
import { View, TouchableNativeFeedback, TouchableOpacity } from 'react-native'
import IOS from '../assets/platform'
import r from '../styles/rinc'

export default Button = props =>  (
  <>
    {IOS ? (
      <TouchableOpacity 
        style={[r.full, props.style]}
        activeOpacity={props.activeOpacity}
        onPress={props.onPress}
      >
        {props.children}
      </TouchableOpacity>
    ) : ( // in android we need to style the button twice coz the outer View
      <View style={[{ overflow: 'hidden' }, props.androidStyle]}> 
        <TouchableNativeFeedback
          delayPressIn={50}
          background={TouchableNativeFeedback.Ripple(props.ripple, props.expandableRipple)}
          onPress={props.onPress}
        >
          <View style={[r.full, props.style]} pointerEvents={'box-only'}>
            {props.children}
          </View>
        </TouchableNativeFeedback>
      </View>
    )}
  </>
)

export const ButtonLight = props =>  (
  <TouchableOpacity 
    style={[props.style]}
    activeOpacity={props.activeOpacity}
    onPress={props.onPress}
  >
    {props.children}
  </TouchableOpacity>
)