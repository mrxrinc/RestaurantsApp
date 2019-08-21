import React, { Component } from 'react'
import { ScrollView, FlatList } from 'react-native'
import { connect } from 'react-redux'
import { View } from 'react-native-animatable'
import numeral from 'numeral'
// import { Crashlytics} from 'react-native-fabric'
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps'
import { withNetworkConnectivity } from 'react-native-offline'
import LinearGradient from 'react-native-linear-gradient'
import Image from './components/image'
import * as asset from './assets'
import { Text, Icon } from './components/font'
// import Button from './components/button'
import Header from './components/header'
import Navbar from './components/navbar'
import Loading from './components/loading'
import Tabbar from './components/tabbar'
import CustomMarker from './components/marker'
import * as r from './styles/rinc'
import * as g from './styles/general'
import API from './utils/service'
// import analytics from '../constants/analytics'


class RestaurantDetail extends Component {
  static navigatorStyle = asset.navigatorStyle

  constructor(props) {
    super(props)
    // Crashlytics.setUserName(this.props.state.user.result.session.user.fullName)
    // Crashlytics.setUserEmail(this.props.state.user.result.session.user.email)
    // Crashlytics.setUserIdentifier(`${this.props.state.user.result.session.user.id}`)
    // Crashlytics.setString('Screen', 'Restaurant Detail')
  }

  componentDidMount() {
    API.restaurantDetail(this.props)
  }

  render() {
    // analytics.setCurrentScreen('اطلاعات رستوران')
    const detail = this.props.state.restaurantDetail ? this.props.state.restaurantDetail.result : null
    const latitude = detail ? parseFloat(detail.point.split(' ')[0]) : null
    const longitude = detail ? parseFloat(detail.point.split(' ')[1]) : null
    return (
      <View style={[r.full, g.bgPrimary]}>
        <Navbar
          {...this.props}
          title={'اطلاعات رستوران'}
          comments={this.props.state.comments && this.props.state.comments.result.pagination.total}
          back
        />

        <View style={r.full}>
          {this.props.state.loading && <Loading />}
          {this.props.state.restaurantDetail && (
            <View
              style={r.full}
              animation={'fadeIn'}
              duration={300}
              delay={200}
              useNativeDriver
            >
              <ScrollView showsVerticalScrollIndicator={false}>
                <Header style={[r.hCenter]}>
                  <View style={[r.topM30, r.round15, g.homeProfile]}>
                    <Image
                      uri={detail.profile}
                      style={[r.round15, g.homeAvatar]}
                      resizeMode={'cover'}
                    />
                    {!!detail.salePercentage && detail.salePercentage !== 0 && (
                      <View style={[r.absolute, g.bgRedLight, r.center, g.homeSalePercent]}>
                        <Text
                          bold
                          size={18}
                          height={17}
                          lineHeight={27}
                          includefontPadding={false}
                          style={[r.centerText, r.white]}
                        >
                          ٪{detail.salePercentage}
                        </Text>
                      </View>
                    )}
                  </View>
                  
                  <View style={[r.hCenter]}>
                    <Text bold multiline size={18} style={[r.white, r.centerText, r.margin10]}>
                      {detail.name}
                    </Text>
                  </View>

                </Header>

                <View>
                  <View style={[r.rightP20, r.vCenter, g.restaurantDetailRowHead]}>
                    <Text size={13} style={[r.grayMid]}>اطلاعات قرارداد</Text>
                  </View>
                  <RowItem icon={'person'} title={'نام صاحب حساب'}>
                    <Text size={15} style={[g.lightText]}>{detail.contract.contractDeputyName}</Text>
                  </RowItem>
                  <RowItem icon={'money'} title={'کمیسیون چیلیوری'}>
                    <Text size={15} style={[g.lightText, r.ltrText]}>% {detail.contract.contractCommission}</Text>
                  </RowItem>
                  {!!detail.campaignAmount && detail.campaignAmount !== 0 && (
                    <RowItem icon={'off-price'} title={'تخفیف مبلغی'}>
                      <Text size={15} style={[g.lightText, r.ltrText]}>{numeral(detail.campaignAmount).format('0,0')}</Text>
                    </RowItem>
                  )}
                  <RowItem icon={'page-2'} title={'مالیات بر ارزش افزوده'}>
                    <Text size={15} style={[g.lightText, r.ltrText]}>% {detail.contract.foodVat}</Text>
                  </RowItem>
                  <RowItem icon={'phone'} title={'شماره تماس'}>
                    <Text size={15} style={[g.lightText]}>{detail.phone}</Text>
                  </RowItem>
                  <RowItem icon={'cheque'} title={'شماره حساب'}>
                    <Text size={15} style={[g.lightText]}>{detail.contract.contractAccountNumber}</Text>
                  </RowItem>
                  <RowItem icon={'sheba'} title={'شماره شبا'}>
                    <Text size={13} style={[g.lightText]}>IR{detail.contract.contractShebaNumber}</Text>
                  </RowItem>

                  <View style={[r.rightP20, r.vCenter, r.topM60, g.restaurantDetailRowHead]}>
                    <Text size={13} style={[r.grayMid]}>اطلاعات رستوران</Text>
                  </View>
                  <RowItem icon={'store'} title={'نوع رستوران'}>
                    <Text size={13} style={[g.lightText, r.centerText]}>
                      {Object.values(detail.type).map((item, index) => (
                        <Text key={index}>
                          {item.tagName}
                          {Object.values(detail.type).length > index + 1 && (' ٬ ')}
                        </Text>
                      ))}
                    </Text>
                  </RowItem>
                  <RowItem icon={'food'} title={'انواع خوراکی'}>
                    <Text size={13} style={[g.lightText, r.centerText]}>
                      {detail.foodTypes.map((item, index) => (
                        <Text key={index}>
                          {item.tagName}
                          {detail.foodTypes.length > index + 1 && (' ٬ ')}
                        </Text>
                      ))}
                    </Text>
                  </RowItem>
                  <RowItem icon={'wallet'} title={'حداقل سفارش'}>
                    <Text size={15} style={[g.lightText, r.ltrText]}>
                      <Text>{numeral(detail.minPriceSendLimit).format('0,0')}</Text>
                      <Text> تومان</Text>
                    </Text>
                  </RowItem>
                  <RowItem icon={'dollar'} title={'سطح اقتصادی'}>
                    <Text size={15} style={[g.lightText, r.ltrText]}>
                      {detail.financialLevel.tagName}
                    </Text>
                  </RowItem>
                  <RowItem icon={'pins'} title={'مناطق تحت پوشش'}>
                    <Text size={13} style={[g.lightText, r.centerText]}>
                      {detail.deliveryZoneList.map((item, index) => (
                        <Text key={index}>
                          {item.title}
                          {detail.deliveryZoneList.length > index + 1 && (' ٬ ')}
                        </Text>
                      ))}
                    </Text>
                  </RowItem>
                  {/* <RowItem icon={'bike'} title={'تحویل سفارش'}>
                    <Text size={15} style={[g.lightText, r.ltrText]}>
                      --
                    </Text>
                  </RowItem>
                  <RowItem icon={'payment'} title={'روش های پرداخت'}>
                    <Text size={15} style={[g.lightText, r.ltrText]}>
                      --
                    </Text>
                  </RowItem>
                  <RowItem icon={'parking'} title={'پارکینگ'}>
                    <Text size={15} style={[g.lightText, r.ltrText]}>
                      --
                    </Text>
                  </RowItem> */}

                  <RowItem icon={'page'} title={'توضیحات'}>
                    <Text size={15} style={[g.lightText, r.ltrText]}>
                      {detail.decription ? detail.description : '-'}
                    </Text>
                  </RowItem>

                  <View>
                    <Text size={13} style={[r.rightP20, r.topM60, r.grayMid]}>
                      ساعات کاری رستوران
                    </Text>
                    <WorkingHours {...detail.openingInfo}/>
                  </View>

                  <View>
                    <Text size={13} style={[r.rightP20, r.topM20, r.grayMid, { bottom: -40 }]}>
                      نشانی رستوران
                    </Text>
                    <View>
                      <View 
                        style={[r.bgLight2, r.round10, r.padd10, r.paddV15, 
                          r.margin15, r.zIndex2, r.shadow20, { bottom: -40 }
                        ]}
                      >
                        <Text size={14} style={[r.grayDark, r.righttext, r.rtlText]}>
                          {detail.address}
                        </Text>
                      </View>

                      <View style={[r.zIndex]}>
                        <MapView
                          provider={PROVIDER_GOOGLE}
                          region={{
                            latitude : latitude + 0.0006, // to recenter map sligtly down
                            longitude,
                            latitudeDelta: 0.003,
                            longitudeDelta: 0.003,
                          }}
                          customMapStyle={asset.mapStyle}
                          style={[r.map, r.wFull, { height: 200 }]}
                        >
                          <Marker coordinate={{ latitude, longitude }}>
                            <CustomMarker />
                          </Marker>
                          </MapView>
                        <LinearGradient
                          style={[r.absolute, r.top, r.wFull, { height: 100 }]}
                          colors={['#32434C00', '#32434C11', '#32434Cfc']}
                          locations={[0, 0.2, 1]}
                          start={{ x: 0, y: 1 }}
                          end={{ x: 0, y: 0 }} 
                        />
                      </View>
                    </View>
                  </View>

                </View>

              </ScrollView>
            </View>
          )}
        </View>
        <Tabbar 
          {...this.props}
          active = {'more'}
          childOfMore
          notificationCount = {null}  // this must be null if we dont have count
        />

      </View>
    )
  }
}

const mapStateToProps = state => ({ state })
const mapDispatchToProps = dispatch => ({ dispatch })
RestaurantDetail = withNetworkConnectivity({ withRedux: true })(RestaurantDetail)
export default connect(mapStateToProps, mapDispatchToProps)(RestaurantDetail)


const RowItem = props => (
  <View style={[r.rtl, r.spaceBetween, g.restaurantDetailRowItem, r.paddV5, r.paddH15]} >
    <View style={[r.full, r.rtl, r.hCenter]}>
      <Icon 
        name={props.icon}
        size={22}
        style={[r.light1, r.leftM10]}
      />
      <Text size={13} height={17} lineHeight={20} style={[r.white, r.rightText, r.topM5]}>
        {props.title}        
      </Text>
    </View>
    <View style={[r.full, r.vCenter, { alignItems: 'flex-start' }]}>
      {props.children}
    </View>
  </View>
)

const WorkingHours = props => {
  props = Object.values(props)
  return (
    <View style={[r.bgLight1, r.round10, r.margin10, { minHeight: 150 }]}>
      {props.map((row, rowIndex) => (
        <View 
          key={rowIndex}
          style={[g.workingHoursRow, r.wFull, r.rtl,
            rowIndex%2 === 0 ? r.bgLight2 : r.bgWhite,
            row[0].isToday && {
              height: 40,
              borderBottomWidth: 0.5,
              transform: [{ scale: row[0].isToday ? 1.04 : 1 }],
              zIndex: 5,
              elevation: 10, 
              shadowColor: '#000', 
              shadowRadius: 10, 
              shadowOpacity: 0.3, 
              shadowOffset: {width: 0, height: 5 }
            }
          ]}
        >
          <View style={[r.full, r.center, r.rightItems, r.rightP20, { maxWidth: 80 }]}>
            <Text 
              size={13} 
              height={16} 
              lineHeight={20} 
              style={[r.grayMid]}
            >
              {row[0].Day}
            </Text>
          </View>
          <View style={[r.full, r.rightItems]}>
            <FlatList
              data={row}
              horizontal
              inverted
              keyExtractor={() => `${Math.random()}`}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={[r.full, r.hCenter]}
              renderItem={({ item }) => (
                <Text 
                  size={15} 
                  height={16} 
                  lineHeight={23} 
                  style={[r.rightM40, row[0].isToday ? r.grayDark : r.grayLight]}>
                  {item.start} - {item.end}
                </Text>
              )}
            />
          </View>
        </View>
      ))}
    </View>
  )
}