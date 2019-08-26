import React, { Component } from 'react'
import { FlatList } from 'react-native'
import { connect } from 'react-redux'
import MapView, { Polygon, Circle } from 'react-native-maps'
import numeral from 'numeral'
// import { Crashlytics} from 'react-native-fabric'
import { View } from 'react-native-animatable'
import { navigatorStyle, mapStyle } from './assets'
import Modal from './components/modal'
import { Text, Icon } from './components/font'
import Header from './components/header'
import { ButtonLight } from './components/button'
import Checkbox from './components/checkbox'
import Navbar from './components/navbar'
import Tabbar from './components/tabbar'
import Loading from './components/loading'
import * as r from './styles/rinc'
import * as g from './styles/general'
import API from './utils/service'
// import analytics from '../constants/analytics'


class DeliveryZone extends Component {
  static options = () => navigatorStyle

  constructor(props) {
    super(props)
    this.state = {
      showMapModal: false,
      initialArea: { // default to vanak
        latitude: 35.756245,
        longitude: 51.409158,
        latitudeDelta: 0.04,
        longitudeDelta: 0.04,
        title: '',
        id: null,
        polygon: null
      },
      area: null
    }
    // Crashlytics.setUserName(this.props.state.user.result.session.user.fullName)
    // Crashlytics.setUserEmail(this.props.state.user.result.session.user.email)
    // Crashlytics.setUserIdentifier(`${this.props.state.user.result.session.user.id}`)
    // Crashlytics.setString('Screen', 'DeliveryZones')
  }

  componentDidMount() {
    API.deliveryZones(this.props)
  }

  showMap = data => {
    const area = {
      latitude: this.handleMapCenter(data, 0),
      longitude: this.handleMapCenter(data, 1),
      latitudeDelta: this.state.initialArea.latitudeDelta,
      longitudeDelta: this.state.initialArea.longitudeDelta,
      title: data.deliveryZoneTitle,
      id: data.deliveryZoneId,
      zoom: data.deliveryZoneMapZoom,
      radius: data.deliveryZoneRadius * 1000,
      status: data.deliveryZoneStatus,
      polygon: this.handlePolygonData(data.deliveryZonePolygon)
    }
    console.log(area)
    this.setState({ area, showMapModal: true }, () => {
      console.log('newState : ', this.state.area, this.state.showMapModal)
    })
  }

  handleMapCenter = (data, loc) => {
    if(data.deliveryZonePolygon) {
      return parseFloat(data.deliveryZoneMapCenter.split(',')[loc])
    } else if (this.props.state.deliveryZones.result.restaurantPoint) {
      return parseFloat(this.props.state.deliveryZones.result.restaurantPoint.split(' ')[loc])
    }
    return [35.6921756, 51.3951325][loc] // default location in case we got no location info
  }

  hideMap = () => {
    return null
  }

  handlePolygonData = data => {
    if(data) {
      data = data.split(',')
      data = data.map(latlong => {
        let intValues = latlong.split(' ')
        intValues = intValues.map(val => parseFloat(val))
        return intValues
      })
      data = data.map(item => {
        return { latitude: item[0], longitude: item[1] }
      })
      console.log('=-=-=-=-=-==-=', data)
      return data
    }
    return null
  }

  render() {
    // analytics.setCurrentScreen('محدوده سرویس دهی')
    return (
      <View style={[r.full, g.bgPrimary]}>
        <Navbar
          title={'محدوده سرویس دهی'}
          comments={this.props.state.comments && this.props.state.comments.result.pagination.total}
          back
          {...this.props}
        />

        <View style={r.full}>
          {this.props.state.loading && <Loading />}
          {this.props.state.deliveryZones && (
            <View
              style={r.full}
              animation={'fadeIn'}
              duration={300}
              delay={200}
              useNativeDriver
            >
              <FlatList 
                data={this.props.state.deliveryZones.result.deliveryZones}
                keyExtractor={item => `${item.deliveryZoneId}`}
                showsVerticalScrollIndicator={false}
                initialNumToRender={8}
                ListHeaderComponent={() => (
                  <Header style={[r.hCenter, r.paddH30]}>
                    <View style={[r.center]}>
                      <Text bold size={14} style={[r.white, r.topM10, r.centerText]} numberOfLine={3}>
                        {/* محدوده سرویس دهی  {this.props.state.home.result.name} */}
                      </Text>
                      <Text size={11} style={[r.white, r.topM5, r.rtlText, r.centerText]} numberOfLine={3}>
                        با انتخاب هر یک از محدوده های سرویس دهی می توانید جزئیات آن را مشاهده نمایید:
                      </Text>
                    </View>
                  </Header>
                )}
                renderItem={({ item }) => (
                  <ZoneItem 
                    title={item.deliveryZoneTitle}
                    price={item.deliveryZonePrice}
                    timeMin={item.deliveryZoneMinDeliveryTime}
                    timeMax={item.deliveryZoneMaxDeliveryTime}
                    id={item.deliveryZoneId}
                    active={this.state.activeMap}
                    onPress={() => this.showMap(item)}
                  />
                )}
              />
            </View>
          )}
        </View>

        <Tabbar 
          {...this.props}
          active = {'more'}
          childOfMore
          notificationCount = {null}  // this must be null if we dont have count
        />

        {this.state.area && (
          <Modal
            general
            animationIn={'slideInUp'}
            animationOut={'slideOutDown'}
            backdrop={0.6}
            hideModalContentWhileAnimating
            style={[g.modal, { marginTop: 100 }]}
            show={this.state.showMapModal}
            hide={() => this.setState({ showMapModal: false, area: null })}
          >
            <ModalView
              style={[r.full]}
              visible={this.state.showMapModal}
            >
              <View style={[r.bgLight5, r.rtl, r.spaceBetween, r.hCenter, { height: 50 }]}>
                <Text size={16} height={20} lineHeight={25} style={[r.grayMid, r.rightM20]}>
                  <Text bold size={13}>{this.state.area.title}</Text>
                </Text>
                <Icon
                  name={'remove'}
                  size={22}
                  style={[r.grayMid, r.centerText, { width: 50 }]}
                  onPress={() => this.setState({ showMapModal: false, area: null })}
                />
              </View>

              <View 
                style={[r.full]} 
                animation={'fadeIn'}
                duration={300}
                delay={1000}
                useNativeDriver
              >
                <MapView 
                  style = {r.map}
                  provider = {'google'}
                  fitToCoordinates = {{coordinates: this.state.area.polygon}}
                  customMapStyle={mapStyle}
                  region = {this.state.area}
                  showsScale
                >
                  {!!this.state.area.polygon ? (
                    <Polygon
                      coordinates={this.state.area.polygon}
                      strokeColor={'#D68E4399'}
                      strokeWidth={2}
                      fillColor={'#F89F4133'}
                    />
                  ) : (
                    <Circle 
                      center={this.state.area}
                      radius={this.state.area.radius}
                      strokeColor={'#F89F41'}
                      fillColor={'#F89F4133'}
                    />
                  )}
                </MapView>
              </View>

            </ModalView>
          </Modal>
        )}

      </View>
    )
  }
}

const mapStateToProps = state => ({ state })
const mapDispatchToProps = dispatch =>  ({ dispatch })
export default connect(mapStateToProps, mapDispatchToProps)(DeliveryZone)


const ZoneItem = props => (
  <ButtonLight 
    style={[r.rtl, r.spaceBetween, r.wFull, r.bottomM5, { minHeight: 100 }]}
    onPress={props.onPress}
  >
    <View 
      style={[r.full, r.paddH20, r.paddV10]}
      onPress={props.onPress}
    >
      <Text bold size={14} style={[r.white, r.rightText, r.rtlText]}>
        {props.title}
      </Text>
      <Text size={12} style={[r.light5, r.rightText, r.rtlText, r.topM3]}>
        <Text>این محدوده</Text>
        <Text> {numeral(props.price).format('0,0')} </Text>
        <Text>تومان هزینه ارسال دارد.</Text>
      </Text>

      <Text size={12} style={[r.light5, r.rightText, r.rtlText, r.topM3]}>
        <Text>حداقل زمان ارسال:</Text>
        <Text> {props.timeMin} </Text>
        <Text>دقیقه</Text>
      </Text>

      <Text size={12} style={[r.light5, r.rightText, r.rtlText, r.topM3]}>
        <Text>حداکثر زمان ارسال:</Text>
        <Text> {props.timeMax} </Text>
        <Text>دقیقه</Text>
      </Text>
    </View>
    <View style={[r.center, { width: 70 }]} >
      <Checkbox 
        active={props.id === props.active}
        onPress={props.onPress}
      />
    </View>
  </ButtonLight>
)