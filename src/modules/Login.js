import React, { Component } from 'react'
import { View, ScrollView } from 'react-native'
import { connect } from 'react-redux'
import { Navigation } from 'react-native-navigation'
import { IOS, navigatorStyle } from './assets'
import { Text } from './components/font'
import Input from './components/input'
import { ButtonLight } from './components/button'
import Navbar from './components/navbar'
import Loading from './components/loading'
import * as r from './styles/rinc'
import * as g from './styles/general'
import API from './utils/service'
import Notification from './components/notification'
import * as util from './utils'
// import analytics from '../constants/analytics'


class Login extends Component {
  static options = () => navigatorStyle
  
  constructor(props) {
    super(props)
    this.state = { 
      username: '',
      password: '',
      emailFocused: false,
      passwordFocused: false,
      firstToken: props.firstToken
    }
  }

  login = () => API.login(this.props, this.state)

  render() {
    // analytics.setCurrentScreen('صفحه ورود')
    return (
      <View style={[r.full]}>
        <Navbar 
          back
          title={'ورود به چیلیوری'}
          {...this.props}
        />

        <ScrollView style={[r.full]}>

          <View style={[r.topM90, r.paddH20]}>
            <Input 
              icon={'person'}
              label={'ایمیل یا شماره موبایل'}
              bold
              keyboardType={'email-address'}
              returnKeyType={'next'}
              value={this.state.username}
              onChangeText={username => this.setState({ username: util.toEnglishDigits(username) })}
            />

            <Input
              icon={'lock'}
              label={'رمز عبور'}
              value={this.state.password}
              secureTextEntry
              style={[r.topM10]}
              onChangeText={password => this.setState({ password: util.toEnglishDigits(password) })}
              onSubmitEditing={this.login}
            />

            <View style={[r.topM10]}>
              <ButtonLight 
                style={[{ width: '60%' }]}
                onPress={() => Navigation.showModal({ stack: { children: [{ component: { name: 'ForgetPassword' } }] } })}
              >
                <Text 
                  bold 
                  size={12} 
                  style={[g.lightText, r.leftText, { 
                    textDecorationLine: IOS ? 'underline' : 'none',
                    textDecorationStyle: 'dotted',
                    textDecorationColor: '#ffffff55'
                  }]}
                >
                  رمز عبور خود را فراموش کرده اید؟
                </Text>
              </ButtonLight>
            </View>

            <View style={[r.topM50, r.hCenter]}>
              <ButtonLight 
                style={[g.bgGreen, r.round20, g.btn, r.center, { width: '90%' }]}
                onPress={this.login}
              >
                {this.props.state.loading ? (
                  <Loading />
                ) : (
                  <Text 
                    bold 
                    size={18} 
                    height={20}
                    lineHeight={25}
                    style={[r.white, r.centerText]}
                  >
                    ورود
                  </Text>
                )}
              </ButtonLight>
            </View>
          </View>
        </ScrollView>
        
        <Notification />
      </View>
    )
  }
}

const mapStateToProps = state => ({ state, notification: state.notification })
const mapDispatchToProps = dispatch => ({ dispatch })
export default connect(mapStateToProps, mapDispatchToProps)(Login)

