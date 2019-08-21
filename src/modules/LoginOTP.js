import React, { Component } from 'react'
import { View, ScrollView, TextInput, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import IOS from './assets/platform'
import CountDown from 'react-native-countdown-component'
import { navigatorStyle } from './assets'
import Modal from 'react-native-modal'
import ModalView from './components/modalView'
import { Text, Icon } from './components/font'
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


class LoginOTP extends Component {

  // static options = () => navigatorStyle

  constructor(props) {
    super(props)
    this.state = { 
      phoneNumber: '09114556318',
      verifyCode: '',
      verifyCodeLength: 5,
      firstToken: props.firstToken,
      showModal: false
    }
  }

  login = () => API.login(this.props, this.state)

  showModal = state => { this.setState({ showModal: state }) }

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
              keyboardType={'phone-pad'}
              returnKeyType={'send'}
              value={this.state.phoneNumber}
              onChangeText={phoneNumber => this.setState({ phoneNumber: util.toEnglishDigits(phoneNumber) })}
            />

            <View style={[r.topM50, r.hCenter]}>
              <ButtonLight 
                style={[g.bgGreen, r.round20, g.btn, r.center, { width: '90%' }]}
                onPress={() => this.showModal(true)}
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
                onPress={() => this.props.navigator.push({ screen: 'Login' })}
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
            
            {this.props.state.loading && <Loading color={'#A6BCC7'} />}

            <ScrollView style={[r.full]}>
              <View style={[r.wFull, r.center, r.topP30]}>
                  <Text size={12}>
                    رمز پیامکی برای شماره موبایل
                    <Text bold size={14} style={[r.grayDark]}> {this.state.phoneNumber} </Text>
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
                    maxLength={this.state.verifyCodeLength}
                    keyboardType={'number-pad'}
                    returnKeyType={'send'}
                    placeholder={'-----'}
                    placeholderTextColor={'#00000022'}
                    value={this.state.verifyCode}
                    onChangeText={verifyCode => this.setState({ verifyCode: util.toEnglishDigits(verifyCode) })}
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
                  separatorStyle={{ fontSize: 20 }}
                  onFinish={() => this.showModal(false)}
                />
              </View>
              <View style={[r.topM20, r.paddH50]}>
                <ButtonLight 
                  style={[g.bgGreen, r.paddV10, r.round30]}
                  onPress={() => null}
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
      </View>
    )
  }
}

const mapStateToProps = state => ({ state, notification: state.notification })
const mapDispatchToProps = dispatch => ({ dispatch })
export default connect(mapStateToProps, mapDispatchToProps)(LoginOTP)
