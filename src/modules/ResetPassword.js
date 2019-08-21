import React, { Component } from 'react'
import { View, Image, ScrollView, TouchableOpacity, KeyboardAvoidingView } from 'react-native'
import { connect } from 'react-redux'
import { navigatorStyle } from './assets'
import { Text } from './components/font'
import Input from './components/input'
import Navbar from './components/navbar'
import { test } from '../actions'
import * as r from './styles/rinc'
import * as g from './styles/general'


class ResetPassword extends Component {
  static navigatorStyle = navigatorStyle
  state={ 
    password: '',
    confirm: ''
  }

  render() {
    return (
      <KeyboardAvoidingView style={[r.full]} behavior='padding'>
        <Navbar 
          title={'تغییر رمز عبور'}
          back
          resetTo={{ screen: 'Login', animationType: 'fade' }}
          {...this.props}
        />

        <ScrollView style={[r.full]}>

          <View style={[r.topM90, r.paddH20]}>

            <View style={[r.center]}>
              <Image 
                source={require('./images/new_password.png')}
                style={[{ width: 120, height: 120 }]}
                resizeMode={'contain'}
              />
            </View>

            <Input
              icon={'lock'}
              label='رمز عبور جدید*'
              value={this.state.password}
              secureTextEntry
              onChangeText={(password) => this.setState({ password })}
              style={[r.topM10]}
            />

            <Input
              icon={'lock'}
              label='تکرار رمز عبور جدید*'
              value={this.state.password}
              secureTextEntry
              onChangeText={(confirm) => this.setState({ confirm })}
              style={[r.topM10]}
            />


            <View style={[r.topM50, r.hCenter]}>
              <TouchableOpacity 
                style={[g.bgGreen, r.round20, g.btn, r.center, { width: '90%' }]}
                onPress={() => this.props.navigator.push({ screen: 'Login' })}
              >
                <Text 
                  bold 
                  size={18} 
                  height={20}
                  lineHeight={25}
                  style={[r.white, r.centerText]}
                >
                  تغییر رمز عبور
                </Text>
              </TouchableOpacity>
            </View>

          </View>
          

        </ScrollView>
      </KeyboardAvoidingView>
    )
  }
}

function mapStateToProps(state) {
  return {
    test: state.test
  }
}

function mapDispatchToProps(dispatch) {
  return {
    fireTest: () => dispatch(test())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ResetPassword)