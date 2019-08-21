import React, { Component } from 'react'
import { View } from 'react-native'
import { Icon } from '../components/font'
import r from '../styles/rinc'
import g from '../styles/general'
import { TextField } from 'react-native-material-textfield'

export default class Input extends Component {
  state = { focus: false }
  render() {
    // I have changed the file 
    //'.../node-modules/react-native-material-textfield/src/components/field/index.js'
    // at line 475 just added '{ alignItems: 'flex-end' }' to support RTL
    // NEW UPDATE: no need to this hack! just use inputCountainerStyle
    return (
      <View style={[r.row, this.props.style, { alignItems: 'flex-end' } ]}>
        <View style={[r.full]}>
          <TextField
            { ...this.props }
            textColor={this.props.textColor ? this.props.textColor : '#fff'}
            baseColor={this.props.baseColor ? this.props.baseColor : '#A6BCC7'}
            tintColor={this.props.tintColor ? this.props.tintColor : '#fff'}
            selectionColor ={ this.props.selectionColor ? this.props.selectionColor : '#F89F41' }
            labelTextStyle={[r.fa, g.lightText]}
            labelPadding={20}
            inputContainerStyle={r.rightItems}
            onFocus={() => this.setState({ focus: true })}
            onBlur={() => this.setState({ focus: false })}
            style={[r.centerText, this.props.bold ? r.faBold : r.fa, this.props.fieldStyle]}
          />
        </View>
        <Icon
          name={this.props.icon}
          size={22}
          style={[r.bottomM10, r.leftM10, this.state.focus ? g.greenHighlight : g.lightText]}
        />
      </View>
    )
  }
}