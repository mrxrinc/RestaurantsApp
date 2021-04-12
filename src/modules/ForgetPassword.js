import React, { Component } from 'react'
import { Image, ScrollView, TouchableOpacity, KeyboardAvoidingView } from 'react-native'
import { connect } from 'react-redux'
import { View } from 'react-native-animatable'
// import { Crashlytics} from 'react-native-fabric'
import { navigatorStyle } from './assets'
import { Text } from './components/font'
import { IOS } from './assets'
import Input from './components/input'
import Navbar from './components/navbar'
import * as r from './styles/rinc'
import * as g from './styles/general'
import API from './utils/service'
import analytics from '../constants/analytics'
import * as util from './utils'
import FlashMessage from 'react-native-flash-message'
import Notification from './components/notification'

class ForgetPassword extends Component {
  static options = () => navigatorStyle

  constructor(props) {
    super(props)
    this.state={ 
      username: ''
    }
    // Crashlytics.setString('Screen', 'Forget Password')
    analytics.setCurrentScreen('فراموشی رمز عبور')
  }
  
  forgetPassword = () => {
    if(this.props.state.loadingII === false) { 
      API.forgetPassword(this.props, this.state.username)
    }
  }

  componentWillUnmount() {
    API.resetForgetPasswordValue(this.props.dispatch)
  }

  renderContent() {
    switch(this.props.state.forgetPassword) {
      case 'email': 
        return (
          <Content
            image={require('./images/password_email.png')} 
            title={'ایمیل بازیابی رمز عبور ارسال شد!'}
            firstDescription={'لینک مربوط به بازیابی رمز عبور به ایمیل شما ارسال شد!'}
            secondDescription={'با کلیک بر روی آن لینک می توانید رمز عبور جدید خود راانتخاب نمایید.'}
          />
        )
      case 'mobile': 
        return (
          <Content
            image={require('./images/password_sms.png')} 
            title={'لینک بازیابی رمز عبور از طریق پیام کوتاه ارسال شد!'}
            firstDescription={'لینک مربوط به بازیابی رمز عبور از طریق پیام کوتاه ارسال شد!'}
            secondDescription={'با کلیک بر روی آن لینک می توانید رمز عبور جدید خود راانتخاب نمایید.'}
          />
        )
      default:
        return (
          <Content
            image={require('./images/forget_password.png')}
            title={'رمز عبور خود را فراموش کرده اید؟'}
            firstDescription={'جهت بازیابی رمز عبور، ایمیل یا شماره موبایل خود را وارد نمایید:'}
          />
        )
    } 
  }

  render() {
    return (
      <KeyboardAvoidingView style={[r.full]} behavior={IOS ? 'padding' : null}>
        <Navbar
          title={'بازیابی رمز عبور'}
          back
          modal
          {...this.props}
        />

        <ScrollView style={[r.full]}>

          <View style={[r.topM60, r.paddH20]}>

            {this.renderContent()}

            {!this.props.state.forgetPassword && (
              <>
                <Input 
                  icon={'person'}
                  label='ایمیل یا شماره موبایل'
                  bold
                  keyboardType={'email-address'}
                  returnKeyType={'send'}
                  value={this.state.username}
                  onChangeText={username => this.setState({ username: util.toEnglishDigits(username) })}
                  onSubmitEditing={this.forgetPassword}
                />

                <View style={[r.topM50, r.hCenter]}>
                  <TouchableOpacity 
                    style={[g.bgGreen, r.round20, g.btn, r.center, { width: '90%' }]}
                    onPress={this.forgetPassword}
                  >
                    <Text
                      bold
                      size={18} 
                      height={20}
                      lineHeight={25}
                      style={[r.white, r.centerText]}
                    >
                      ارسال
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}

          </View>

        </ScrollView>
        <Notification />
        <FlashMessage position="top" style={[r.rtl]} />
      </KeyboardAvoidingView>
    )
  }
}

const mapStateToProps = state => ({ state })
const mapDispatchToProps = dispatch => ({ dispatch })
export default connect(mapStateToProps, mapDispatchToProps)(ForgetPassword)


const Content = props => (
  <View 
    style={[r.center, r.paddH20]}
    animation={'fadeIn'}
    duration={300}
    delay={50}
    useNativeDriver
  >
    <Image 
      source={props.image}
      style={[{ width: 120, height: 120 }]}
      resizeMode={'contain'}
    />
    <Text bold size={16} style={[r.white, r.centerText, r.topM30]}>
      {props.title}
    </Text>

    <Text size={13} multiline style={[r.white, r.centerText, r.topM30]}>
      {props.firstDescription}
    </Text>

    <Text size={13} multiline style={[r.white, r.centerText]}>
      {props.secondDescription}
    </Text>
  </View>
)
  
