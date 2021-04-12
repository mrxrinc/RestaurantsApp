import React, { Component } from 'react'
import { connect } from 'react-redux'
import { View } from 'react-native-animatable'
import { Text, Icon } from './font'
import r from '../styles/rinc'
import g from '../styles/general'

class EmptyList extends Component{
  render() {
    return this.props.empty.visible ? (
      <View 
        style={[r.absolute, r.whFull, r.center]}
        animation={'fadeIn'}
        duration={500}
        delay={300}
        useNativeDriver
      >
        {this.props.icon && (
          <Icon 
            name={this.props.empty.icon}
            size={110}
            style={[g.primaryLight, r.bottomM50]}
          />
        )}
        <Text 
          bold 
          size={16}
          style={[r.centerText, g.primaryLight]}
        >
          {this.props.empty.text}
        </Text>
      </View>
    ) : null
  }
}

const mapStateToProps = state => ({ empty: state.empty })
export default connect(mapStateToProps)(EmptyList)
