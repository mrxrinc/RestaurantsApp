import React, { Component } from 'react'
import { View, Image, Linking } from 'react-native'
import { connect } from 'react-redux'
import { navigatorStyle } from './assets'
import { Text } from './components/font'
import { ButtonLight } from './components/button'
import Loading from './components/loading'
import * as r from './styles/rinc'
import * as g from './styles/general'
// import analytics from '../constants/analytics'
import API from './utils/service'


class Update extends Component {
  static navigatorStyle = navigatorStyle

  enterApp = () => {
    API.appInit(this.props)
  }

  updateApp = () => {
    Linking.openURL(this.props.state.update.link)
  }

  render() {
    // analytics.setCurrentScreen('صفحه آپدیت') 
    return (
      <View style={[r.full, g.bgPrimary]}>
        <View style={[r.full, r.center, r.topP20]}>
          <Image
            source={require('./images/update.png')} 
            resizeMode={'contain'}
            style={[{ width: 140, height: 140 }]}
          />
          <Text bold size={18} style={[g.lightText, r.centerText, r.topM60]}>
            بروزرسانی اپلیکیشن
          </Text>

          <Text bold size={16} style={[g.lightText, r.centerText, r.topM60]}>
            {this.props.state.update.title}
          </Text>

          <Text size={11} style={[g.lightText, r.centerText, r.topM10]}>
            {this.props.state.update.description}
          </Text>
        </View>

        <View style={[r.wFull, r.rtl, r.shadow10, { height: 60 }]}>
          
            <ButtonLight
              style={[g.bgAccent, r.full, r.center, {
                borderLeftWidth: 0.5, borderColor: '#ffffff66'
              }]}
              onPress={this.updateApp}
            >
              <Text bold size={15} height={17} lineHeight={22} style={[r.white]}>
                بروزرسانی
              </Text>
            </ButtonLight>
          
          {!this.props.state.update.forceUpdate && (
            <ButtonLight
              style={[g.bgAccent, r.full, r.center]}
              onPress={this.enterApp}
            >
              {this.props.state.loading ? (
                <Loading />
              ) : (
                <Text bold size={15} height={17} lineHeight={22} style={[r.white]}>
                  ورود
                </Text>
              )}
            </ButtonLight>
          )}

        </View>

      </View>
    )
  }
}

const mapStateToProps = state => ({ state })
export default connect(mapStateToProps)(Update)