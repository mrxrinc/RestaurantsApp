import React from 'react'
import {
 View
} from 'react-native'
import { Text } from '../components/font'
import { window } from '../assets'
import * as r from '../styles/rinc'

export default Push = props => (
  <View 
    style={[r.wFull, r.round10, r.padd15, r.center, { 
      minHeight: 50, 
      margin: 0,
      paddingTop: 40,
      borderTopRightRadius: 0,
      borderTopLeftRadius: 0,
      backgroundColor: handleBg(props) 
    }]}
  >
    <Text 
      bold 
      size={14} 
      numberOfLines={10} 
      style={[r.centerText, props.status ? r.white : r.grayMid, { 
        width: window.width - 30 // without this it wont multiline!! u see how stupid life can be?!
      }]}
    >
      {typeof props.message === 'string' ? props.message : 'خطایی رخ داده است!'}
    </Text>
  </View>
)

const handleBg = props => {
  if (props.status === 'success') return '#00CA00'
  if (props.status === 'error') return '#FF3E3E'
  return 'transparent'
}
