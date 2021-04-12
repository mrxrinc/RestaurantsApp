import React, { Component } from 'react'
import { connect } from 'react-redux'
// import { Crashlytics} from 'react-native-fabric'
import { View } from 'react-native-animatable'
import { navigatorStyle } from './assets'
import { Text, Icon } from './components/font'
import Loading from './components/loading'
import * as r from './styles/rinc'
import * as g from './styles/general'
import API from './utils/service'
import analytics from '../constants/analytics'
import Notification from './components/notification'
import FlashMessage from 'react-native-flash-message'

class Splash extends Component {
  static options = () => navigatorStyle
  constructor(props) {
    super(props)
    // Crashlytics.setString('Screen', 'Splash')
    analytics.setCurrentScreen('اسپلش')
  }

  componentDidMount() {
    API.versionControl(this.props)
  }

  render() {
    return (
      <View style={[r.full, g.bgPrimary, r.center]}>
        <View
          animation={'bounceIn'}
          duration={800}
          useNativeDriver
        >
          <Icon name={'logo'} size={160} style={[r.light1]}/>
        </View>

        <View 
          style={[r.topM50]}
          animation={'fadeIn'}
          duration={500}
          delay={1000}
          useNativeDriver
        >
          <Text bold size={22} style={[g.lightText, r.centerText]}>
            چیلیوری
          </Text>

          <Text size={10} style={[g.lightText, r.centerText, r.topM5]}>
            (رستوران ها)
          </Text>
        </View>
        {this.props.state.loading && (
          <View style={[r.absolute, r.bottom, r.wFull, { height: 150 }]}>
            <Loading />
          </View>
        )}
        
        <Notification />
        <FlashMessage position="top" style={[r.rtl]} />
      </View>
    )
  }
}

const mapStateToProps = state => ({ state })
const mapDispatchToProps = dispatch => ({ dispatch })
export default connect(mapStateToProps, mapDispatchToProps)(Splash)
