import React, { Component } from 'react'
import {
  View
} from 'react-native'
import { connect } from 'react-redux'
import { navigatorStyle } from './assets'
import { Text, Icon } from './components/font'
import { ButtonLight } from './components/button'
import * as r from './styles/rinc'
import * as g from './styles/general'
import analytics from '../constants/analytics'


class Error extends Component {
  static options = () => navigatorStyle

  render() {
    analytics.setCurrentScreen('برمودا') 
    const errorCode = this.props.errorCode ? this.props.errorCode : 'تعیین نشده'
    return (
      <View style={[r.full, g.bgPrimary, r.center]}>
        <Icon name={'alert'} size={180} style={[g.lightText]}/>
        <Text bold size={16} style={[g.lightText, r.centerText, r.topM60]}>
          مشکلی پیش آمد  <Text>!</Text> 
        </Text>

        <Text size={11} style={[g.lightText, r.centerText, r.topM10]}>
          <Text>کد خطا:    </Text>
          <Text bold size={15}>{errorCode}</Text>
        </Text>

        <View style={[r.absolute, r.bottom, r.wFull, r.center, { height: 120 }]}>
          <ButtonLight
            style={[g.bgAccent, r.round30, r.w70, r.shadow10, r.center, { height: 50 }]}
            onPress={() => this.props.navigator.resetTo({ screen: 'Splash' })}
          >
            <Text bold size={15} height={17} lineHeight={22} style={[r.white]}>
              تلاش مجدد
            </Text>
          </ButtonLight>
        </View>
      </View>
    )
  }
}


const mapStateToProps = state => ({ state })
export default connect(mapStateToProps)(Error)