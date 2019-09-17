import React, { Component } from 'react'
import { View, ScrollView, TextInput, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import { Navigation } from 'react-native-navigation'
import axios from 'axios'
import CountDown from 'react-native-countdown-component'
import { IOS, navigatorStyle } from './assets'
import Modal from 'react-native-modal'
import ModalView from './components/modalView'
import { Text, Icon } from './components/font'
import Input from './components/input'
import { ButtonLight } from './components/button'
import Navbar from './components/navbar'
import Loading from './components/loading'
import * as r from './styles/rinc'
import * as g from './styles/general'
import SERVICES from './utils/service'
import Notification from './components/notification'
import * as util from './utils'
import analytics from '../constants/analytics'
import * as api from '../constants/api'
import * as action from '../actions'
import FlashMessage from "react-native-flash-message"


class LoginOTP extends Component {
  static options = () => navigatorStyle

  constructor(props) {
    super(props)
    this.state = { 
      recipient: '',
      channel: 'sms',
      secret: null,
      otp: null,
      otp_length: 5,
      showModal: false
    }
    analytics.setCurrentScreen('صفحه ورود OTP')
    this.showNotification = SERVICES.showNotification
  }

  loginOtpRequest = () => {
    const { recipient, channel } = this.state
    const { dispatch } = this.props
    if(!this.props.state.loading) { // preventing double tap while one request is on progress!
      dispatch(action.loadingStart())
      if(recipient.trim().length === 0) {
        dispatch(action.loadingEnd())
        this.showNotification({
          title: 'خطا!',
          message: 'لطفا شماره موبایل خود را وارد کنید!',
          type: 'alarm'
        }, dispatch)
      } else {
        axios({
          method: 'post',
          url: api.OTP_URL + 'otp/request',
          data: {
            recipient,
            channel,
            platform: api.INIT.platform,
            build: api.INIT.build,
            device_id: api.INIT.device_id,
            device: api.INIT.device
          }
        })
        .then(resp => {
          if(resp.data.status) {
            console.log('OTP REQUEST STATUS TRUE ===> ', resp.data)
            dispatch(action.loadingEnd())
            this.setState({ 
              showModal: true,
              secret: resp.data.result.secret,
              otp_length: resp.data.result.otp_length
            })
          } else {
            console.log('OTP REQUEST STATUS FALSE ===> ', resp)
            dispatch(action.loadingEnd())
            this.showNotification({
              title: 'خطا!',
              message: `${resp.data.message_fa}!`,
              type: 'error'
            }, dispatch)
          }
        })
        .catch(err => {
          console.log('OTP REQUEST ERROR ===> ', err)
          console.log('OTP REQUEST ERROR OBJECT ===> ', err.response)
          dispatch(action.loadingEnd())
          if(err.response.data.status === false) {
            this.showNotification({
              title: 'خطا!',
              message: err.response.data.message_fa,
              type: 'error'
            }, dispatch)
          } else {
            util.handleOffline(this.props, true)
            this.showNotification({
              title: 'خطا!',
              message: 'مشکلی در درخواست ورود پیش آمد! لطفا مجددا تلاش کنید.',
              type: 'error'
            }, dispatch)
          }
        })
      }
    }
  }

  verifyOTP = () => {
    this.setState({ showModal: false }, () => { // dont even ask why I didnt use shoModal function here! just dont ask. JS staff!
      SERVICES.loginOtp(this.props, this.state)
    })
  }

  showModal = state => { this.setState({ showModal: state, otp: state === true ? null : this.state.otp }) } // otp will always be null at modal show

  render() {
    return (
      <View style={[r.full]}>
        <Navbar 
          title={'ورود به چیلیوری'}
          {...this.props}
        />

        <ScrollView style={[r.full]}>

          <View style={[r.topM90, r.paddH20]}>
            <Input 
              icon={'phone'}
              label={'شماره موبایل'}
              maxLength={11}
              autoFocuse
              keyboardType={'phone-pad'}
              returnKeyType={'send'}
              value={this.state.recipient}
              onChangeText={recipient => this.setState({ recipient: util.toEnglishDigits(recipient) })}
            />

            <View style={[r.topM50, r.hCenter]}>
              <ButtonLight 
                style={[g.bgGreen, r.round20, g.btn, r.center, { width: '90%' }]}
                onPress={this.loginOtpRequest}
              >
                {this.props.state.loading ? (
                  <Loading />
                ) : (
                  <Text 
                    bold 
                    size={17} 
                    height={20}
                    lineHeight={25}
                    style={[r.white, r.centerText]}
                  >
                    دریافت رمز پیامکی
                  </Text>
                )}
              </ButtonLight>
            </View>


            <View style={[r.topM100]}>
              <ButtonLight 
                style={[{  }]}
                onPress={() => Navigation.push(this.props.componentId, { component : { name: 'Login' } })}
              >
                <Text
                  size={15} 
                  style={[g.lightText, r.centerText, { 
                    textDecorationLine: IOS ? 'underline' : 'none',
                    textDecorationStyle: 'dotted',
                    textDecorationColor: '#ffffff55'
                  }]}
                >
                  ورود با رمز عبور
                </Text>
              </ButtonLight>
            </View>

          </View>
        </ScrollView>

        <Modal
          isVisible={this.state.showModal}
          animationIn={'slideInUp'}
          animationOut={'slideOutDown'}
          backdropOpacity={0.3}
          hideModalContentWhileAnimating
          useNativeDriver
          style={[g.modal, { marginTop: 40 }]}
          onBackdropPress={() => this.showModal(false)}
          onBackButtonPress={() => this.showModal(false)}
        >
          <ModalView
            style={[r.full]}
            visible={this.state.showModal}
          >
            <View style={[r.bgLight5, r.rtl, r.spaceBetween, r.hCenter, { height: 50 }]}>
              <Text bold size={14} height={24} lineHeight={25} style={[r.grayMid, r.rightM20]}>
                تایید شماره موبایل
              </Text>
              <Icon
                name={'remove'} 
                size={22}
                style={[r.grayMid, r.centerText, { width: 60 }]}
                onPress={() => this.showModal(false)}
              />
            </View>
            
            {/* {this.props.state.loading && <Loading color={'#A6BCC7'} />} */}

            <ScrollView style={[r.full]}>
              <View style={[r.wFull, r.center, r.topP30]}>
                  <Text size={12}>
                    رمز پیامکی برای شماره موبایل
                    <Text bold size={14} style={[r.grayDark]}> {this.state.recipient} </Text>
                    ارسال گردید.
                  </Text>

                  <TouchableOpacity
                    style={[r.topP20]}
                    onPress={() => this.showModal(false)}
                  >
                    <Text size={11} style={[r.grayMid]}>
                      ویرایش شماره موبایل 
                    </Text>
                  </TouchableOpacity>

                  <Text size={12} style={[r.topM30]}>
                  برای تأیید ، کد ارسال شده از طریق پیامک را وارد نمایید:
                  </Text>
              </View>

              <View style={[r.wFull, r.center, r.paddH40, r.topM5]}>
                <View style={[r.wFull, r.bgLight1, r.center, r.topP20]}>
                  <TextInput
                    style={[r.wFull, r.centerText, g.primary, r.fa, g.otpInput]}
                    maxLength={this.state.otp_length}
                    keyboardType={'number-pad'}
                    returnKeyType={'send'}
                    placeholder={'-----'}
                    placeholderTextColor={'#00000022'}
                    value={this.state.otp}
                    onChangeText={otp => this.setState({ otp: util.toEnglishDigits(otp) })}
                  />
                </View>

                <CountDown
                  until={60 * 2}
                  size={30}
                  onFinish={() => this.showModal(false)}
                  style={[r.marginV20]}
                  digitStyle={{ backgroundColor: '#000000000' }}
                  digitTxtStyle={{ color: '#d4d7da', fontWeight: '100', fontFamily: IOS ? 'IRANSansMobile-Bold' : 'IRANSansMobile_Bold', fontSize: 25 }}
                  size={15}
                  timeToShow={['M', 'S']}
                  timeLabels={{m: '', s: ''}}
                  showSeparator
                  separatorStyle={{ fontSize: 20, color: '#d4d7da', marginBottom: 10 }}
                  onFinish={() => this.showModal(false)}
                />
              </View>
              <View style={[r.topM20, r.paddH50]}>
                <ButtonLight 
                  style={[g.bgGreen, r.paddV10, r.round30]}
                  onPress={this.verifyOTP}
                >
                  <Text
                    size={15} 
                    style={[r.white, r.centerText, { 
                      textDecorationLine: IOS ? 'underline' : 'none',
                      textDecorationStyle: 'dotted',
                      textDecorationColor: '#ffffff55'
                    }]}
                  >
                    تایید 
                  </Text>
                </ButtonLight>
              </View>
            </ScrollView>
          </ModalView>
        </Modal>
        
        <Notification />
        {/* <FlashMessage position="top" /> */}
      </View>
    )
  }
}

const mapStateToProps = state => ({ state, notification: state.notification })
const mapDispatchToProps = dispatch => ({ dispatch })
export default connect(mapStateToProps, mapDispatchToProps)(LoginOTP)
