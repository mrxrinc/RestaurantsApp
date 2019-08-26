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
import { handleOffline } from './utils'
// import analytics from '../constants/analytics'

class Offline extends Component {
  static options = () => navigatorStyle

  render() {
    // analytics.setCurrentScreen('آفلاین')
    return (
      <View style={[r.full, g.bgPrimary, r.center]}>
        <Icon name={'offline'} size={180} style={[g.lightText]}/>
        <Text bold size={16} style={[g.lightText, r.centerText, r.topM30]}>
          دسترسی به اینترنت ندارید!
        </Text>

        <View style={[r.absolute, r.bottom, r.wFull, r.center, { height: 120 }]}>
          <ButtonLight
            style={[g.bgAccent, r.round30, r.w70, r.shadow10, r.center, { height: 50 }]}
            onPress={() => handleOffline(this.props)}
          >
            <Text bold size={15} height={17} lineHeight={22} style={[r.white]}>
              اتصال مجدد
            </Text>
          </ButtonLight>
        </View>
      </View>
    )
  }
}


const mapStateToProps = state => ({ state })

export default connect(mapStateToProps)(Offline)