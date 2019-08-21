import React, { Component } from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'
import Modal from 'react-native-modal'
import { Text } from './font'
import { ButtonLight } from './button'
import { navigatorStyle } from '../assets'
import * as r from '../styles/rinc'
import * as g from '../styles/general'
import API from '../utils/service'

class Notification extends Component {
  static navigatorStyle = navigatorStyle

  close = () => API.hideNotification(this.props.dispatch)

  type = type => {
    switch(type) {
      case 'error' :
        return r.bgRed
      case 'alarm':
        return g.bgAccent
      case 'success':
        return g.bgGreen
      default: return null
    }
  }
 
  render() {
    const type = this.props.notification.type
    return (
      <Modal
        isVisible= {this.props.notification.visible}
        style={[r.absolute, r.whFull, r.zIndex3, r.center, { margin: 0, justifyContent: 'flex-end' }]}
        animationIn={'slideInUp'}
        animationOut={'slideOutDown'}
        backdropOpacity={0.1}
        avoidKeyboard
        hideModalContentWhileAnimating
        useNativeDriver
        onBackdropPress={this.close}
        onBackButtonPress={this.close}
      >
        <View style={[r.wFull, r.shadow20, r.bgWhite, { minHeight: 300 }]}>
          <View style={[r.absolute, r.top, r.wFull, this.type(type), { height: 3 }]} />
          <View style={[r.full, r.padd10]} >
            <Text bold size={16} style={[r.grayDark, r.centerText, r.topM20]}>
              {this.props.notification.title}
            </Text>
            <View style={[r.full, r.center]}>
              <Text size={14} multiline={10} style={[r.topM10, r.grayDark, r.centerText]}>
                {this.props.notification.message}
              </Text>
            </View>
          </View>
          <View style={[r.center, { height: 80 }]}>
            <ButtonLight 
              style={[g.bgAccent, r.round20, g.btn, r.center, { width: '80%' }]}
              onPress={this.close}
            >
              <Text 
                bold 
                size={16} 
                height={18}
                lineHeight={23}
                style={[r.white, r.centerText]}
              >
                باشه!
              </Text>
            </ButtonLight>
          </View>
        </View>
      </Modal>
    )
  }
}

const mapStateToProps = state => ({ notification: state.notification })
const mapDispatchToProps = dispatch => ({ dispatch })
export default connect(mapStateToProps, mapDispatchToProps)(Notification)
