import React from 'react'
import { View } from 'react-native'
import * as r from '../styles/rinc'

export default CustomMarker = () => (
  <View style={[r.round20, r.center, { width: 25, height: 25, backgroundColor: '#f67c7d' }]}>
    <View style={[r.round20, { width: 10, height: 10, backgroundColor: '#685050' }]} />
  </View>
)