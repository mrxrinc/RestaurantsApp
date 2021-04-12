import React, { Component } from 'react'
import { View, Image } from 'react-native'
import IOS from '../assets/platform'
import r from '../styles/rinc'
import g from '../styles/general'

export default class Header extends Component {
  render() {
    return (
      <View style={[g.bgPrimaryDark, r.wFull, { minHeight: 100 }]} >
        <View style={[r.full, this.props.style, { paddingBottom: 20 }]}>
          {this.props.children}
        </View>
        <View>
          <Image 
            source={require('../images/wave.png')}
            style={[{ height: IOS ? 15 : 25 }, !IOS && r.wFull]}
            resizeMode={ IOS ? 'repeat' : 'cover' }
          />
        </View>
      </View>
    )
  }
}
