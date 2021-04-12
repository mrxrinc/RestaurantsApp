import React, { Component } from 'react'
import { TouchableOpacity } from 'react-native'
import { View } from 'react-native-animatable'
import { Icon } from './font'
import r from '../styles/rinc'


export default class Checkbox extends Component {
  render() {
    const activeBox = this.props.active ? 1 : 0
    const borderColor = this.props.active ? '#F89F41' : '#d4d4d4'
    return (
      <View style={[{ width: 45, height: 45 }]}>
        <TouchableOpacity
          style={[r.full, r.center]}
          onPress={this.props.onPress}
        >
          <View
            style={[r.center, {
              width: 25,
              height: 25,
              borderWidth: 1,
              borderColor,
              borderRadius: 2
            }]}
            animation={'fadeIn'}
            duration={500}
            delay={200}
            useNativeDriver
          >
            <Icon
              name='check'
              size={18}
              color={'#F89F41'}
              style={{ opacity: activeBox }}
            />
          </View>
        </TouchableOpacity>
      </View>
    )
  }
 }