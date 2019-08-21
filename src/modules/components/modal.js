import React from 'react'
import { View } from 'react-native'
import Modal  from 'react-native-modal'
import LinearGradient from 'react-native-linear-gradient'
import { Text } from './font'
import { LoadingII } from './loading'
import Button from './button'
import * as r from '../styles/rinc'


export default CustomModal = props => ( 
  <Modal
    {...props}
    isVisible={props.show}
    onBackdropPress={props.hide}
    onBackButtonPress={props.hide}
    animationIn={props.animationIn ? props.animationIn : 'fadeIn'}
    animationOut={props.animationOut ? props.animationOut : 'fadeOut'}
    backdropOpacity={props.backdrop ? props.backdrop : 0.6}
    useNativeDriver={props.native ? props.native : true}
    onModalHide={props.onHide ? props.onHide : () => null}
    style={props.style ? props.style : [r.center]}
  >
    {props.loading && (
      <>
        <LinearGradient 
          style={[r.absolute, r.whFull]}
          colors={['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.9)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        />
        <View style={[r.absolute, r.bottom, r.wFull, { height: 100 }]}>
          <LoadingII size={'large'} color={'#fff'}/>
        </View>
      </>
    )}

    {props.general && (
      <View style={[!props.bottomAlign && r.full, r.shadow10]}>
        {props.children}
      </View>
    )} 

    {(!props.general && !props.loading) && (
      <View style={[r.round15, r.bgWhite, {width: '90%', minHeight: 200, }]}>
      <View style={[r.full, r.padd15]}>
        <Text bold size={20} style={[r.grayDark, r.centerText, r.marginV20]}>
          {props.title}
        </Text>
        <Text size={15} style={[r.grayMid, r.centerText, r.rtlText]}>
          {props.children}
        </Text>
      </View>
      <Button
        style={[r.center, { maxHeight: 45, borderTopColor: '#eee', borderTopWidth: 1 }]}
        androidStyle={[r.wFull, { height: 45 }]}
        onPress={props.hide}
        ripple={'#00000011'}
        expandableRipple
      >
        <Text size={16} height={25} lineHeight={30} style={[r.grayDark]}>خُب</Text>
      </Button>
    </View>
    )}
  </Modal>
)

