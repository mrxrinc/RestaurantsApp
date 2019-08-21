import React, { Component } from 'react'
import { Text as RefText } from 'react-native'
import { createIconSetFromFontello } from 'react-native-vector-icons'
import fontIconConfig from '../assets/iconsConfig.json'
import * as r from '../styles/rinc'

const FontIcon = createIconSetFromFontello(fontIconConfig)

//These two must stay class coz of create animated view only supports classes!
export class Text extends Component {
  render() {
    return (
      <RefText
        {...this.props}
        style={[
          this.props.en ? 
            (this.props.bold ? r.enBold : r.en) : 
            (this.props.bold ? r.faBold : r.fa),
          {
            fontSize: this.props.size,
            height: this.props.height,
            lineHeight: this.props.lineHeight,
          },
          r.rtlText,
          this.props.style,
        ]}
      >
        {this.props.children}
      </RefText>
    )
  }
}

export class Icon extends Component{
  render(){
    return(
      <FontIcon {...this.props} />
    )
  }
}

