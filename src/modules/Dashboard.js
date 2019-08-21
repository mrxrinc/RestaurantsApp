import React, { Component } from 'react'
import { FlatList, Image } from 'react-native'
import { View } from 'react-native-animatable'
import { connect } from 'react-redux'
// import { Crashlytics} from 'react-native-fabric'
import { navigatorStyle } from './assets'
import { Text } from './components/font'
import Button from './components/button'
import Navbar from './components/navbar'
import Loading from './components/loading'
import EmptyList from './components/emptyList'
import * as r from './styles/rinc'
import * as g from './styles/general'
import API from './utils/service'
import Notification from './components/notification'
// import analytics from '../constants/analytics'

class Dashboard extends Component {
  static navigatorStyle = navigatorStyle

  constructor(props) {
    super(props)
    // Crashlytics.setUserName(this.props.state.user.result.session.user.fullName)
    // Crashlytics.setUserEmail(this.props.state.user.result.session.user.email)
    // Crashlytics.setUserIdentifier(`${this.props.state.user.result.session.user.id}`)
    // Crashlytics.setString('Screen', 'Dashboard')
  }

  componentDidMount() {
    API.dashboard(this.props, this.props.hasBack) 
    // second argument is for check or not checking the local chosen Restaurant value
    // entering from "More" page we should function normaly on dashboard page.
    // but while openning app from scratch it should check for local chosen Restaurant 
    // and if there is a local id for any restaurant, we should move on to home page by setting current restaurant 
  }

  render() {
    // analytics.setCurrentScreen('داشبورد')
    return (
      <View style={[r.full]}>
        <Navbar 
          {...this.props}
          title={'انتخاب رستوران / شعبه'}
          back={this.props.hasBack ? () => this.props.navigator.pop() : null}
        />

        {this.props.state.loading && !this.props.state.dashboard && <Loading /> } 

        {this.props.state.dashboard && (
          <FlatList 
            data={this.props.state.dashboard.result.restaurants}
            keyExtractor={item => `${item.id}`}
            showsHorizontalScrollIndicator={false}
            refreshing={this.props.state.loading}
            onRefresh={() => API.dashboard(this.props, this.props.hasBack)}
            ItemSeparatorComponent={() => <View style={[r.full, g.bgPrimaryLight, r.marginH10, { height: 1 }]} />}
            renderItem={({ item }) => (
              <View
                animation={'fadeIn'}
                duration={300}
                delay={0}
                useNativeDriver
              >
                <Button
                  style={[r.rtl, r.paddH20, r.hCenter, { height: 120 }]}
                  ripple={'#ffffff11'}
                  onPress={() => API.currentRestaurant(this.props.navigator, this.props.dispatch, item.id)}
                >
                  <View style={[r.round15, r.overhide, { borderColor: '#fff', borderWidth: 5 }]}>
                    <Image
                      source={{ uri: item.profile }} 
                      resizeMode={'cover'}
                      style={[{ width: 70, height: 70 }]}
                    />
                  </View>
                  <View style={[r.full, r.vCenter, r.rightP10]}>
                    <Text size={14} bold multiline style={[r.wFull, r.white, r.rightP10]}>
                      {item.name}
                    </Text>
                  </View>
                </Button>
              </View>
            )}
          />
        )}

        {!this.props.state.dashboard && <EmptyList icon/> }

        <Notification />

      </View>
    )
  }
}

const mapStateToProps = state => ({ state })
const mapDispatchToProps = dispatch => ({ dispatch })
export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)