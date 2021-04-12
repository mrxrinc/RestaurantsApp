import React from 'react'
import { View } from 'react-native'
import Modal from 'react-native-modal'
import { Text, Icon } from './font'
import * as r from '../styles/rinc'


export default ActionModal = props => ( 
  <Modal
    isVisible={props.visible}
    animationIn={'fadeIn'}
    animationOut={'fadeOut'}
    backdropOpacity={0.6}
    useNativeDriver
    hideModalContentWhileAnimating
    onModalHide={props.onHide}
    style={[r.center]}
    onBackdropPress={props.hide}
    onBackButtonPress={props.hide}
  >
    <View 
      style={[r.round15, r.bgWhite, { 
        minHeight: 150, width: props.width ? props.width : '80%', height: props.height
      }]}
    >
      <View style={[r.center, r.rtl, r.rightP15]}>
        {props.icon && (
          <Icon name={props.icon} size={16} style={[r.grayMid, r.leftM15, { marginTop: -8 }]} />
        )}
        <Text bold size={14} style={[r.grayDark, r.centerText, r.marginV15]}>
          {props.title}
        </Text>
      </View>
      <View>
        {props.children}
      </View>
    </View>
  </Modal>
)

