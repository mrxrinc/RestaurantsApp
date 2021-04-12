import React from 'react'
import { Image as RawImage } from 'react-native'
import { imageHeader } from '../../constants/api'

export default Image = ({uri, style, ...props}) => (
  <RawImage
    {...props}
    source={{
      uri,
      method: 'GET',
      headers: imageHeader
    }}
    style={[style]}
  />
)
