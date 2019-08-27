import React, { Component } from 'react'
import { View, ScrollView, TextInput, KeyboardAvoidingView, FlatList, RefreshControl } from 'react-native'
import { connect } from 'react-redux'
import { Navigation } from 'react-native-navigation'
import * as Anim from 'react-native-animatable'
import numeral from 'numeral'
// import { Crashlytics} from 'react-native-fabric'
import PersianCalendarPicker from 'react-native-persian-calendar-picker'
import Modal from 'react-native-modal'
import IOS from './assets/platform'
import Image from './components/image'
import ModalView from './components/modalView'
import { Text, Icon } from './components/font'
import Button, { ButtonLight } from './components/button'
import Header from './components/header'
import Navbar from './components/navbar'
import Tabbar from './components/tabbar'
import * as r from './styles/rinc'
import * as g from './styles/general'
import { navigatorStyle } from './assets'
import * as util from './utils'
import API from './utils/service'
import Loading from './components/loading'
import ListFooter from './components/listFooter'
import Notification from './components/notification'
import analytics from '../constants/analytics'

class FinancialReport extends Component {
  static options = () => navigatorStyle

  constructor(props) {
    super(props)
    this.state = {
      dateFrom: null,
      dateTo: null,
      dateOpenModal: 'from',
      period: null,
      orderId: '',
      showOrderDetail: false,
      showDatePicker: false,

      data: {
        invoices: [
          {
            id: 'CHL-INV-4723PK',
            orderCount: 8,
            orderCorrectionCount: 2,
            orderTotalPrices: 250100,
            orderCorrectionTotalPrices: -30000,
            price: 220100,
            createdAt: '1398/05/01',
            period: '(1398/04/01 تا 1398/04/31)',
            status: 'در انتظار پرداخت'
          },
          {
            id: 'CHL-INV-51R34P',
            orderCount: 10,
            orderCorrectionCount: 1,
            orderTotalPrices: 275200,
            orderCorrectionTotalPrices: 5000,
            price: 280200,
            createdAt: '1398/04/01',
            period: '(1398/03/01 تا 1398/03/31)',
            status: 'پرداخت شده'
          }
        ],
        restaurant: {
          id: 3,
          slug: 'jikjikberyan',
          name: 'جیک جیک بریان',
          contractPeriod: 'ماهانه',
          salePercentage: 10,
          hasCampaign:  true,
          profile: 'https://media.chilivery.com/img/restaurantLogo/a17fe776dc87286b9680d98b766e76ee/restaurantProfile-جیکجیکبریان-997.jpg',
          cover: 'https://media.chilivery.com/img/restaurantCover/73877749bf8eecdcfe08f70fd54e5352/restaurantCover-جیکجیکبریان-110943.png',
          mobileCover: 'https://media.chilivery.com/img/mobileTag/8363a91ac9992569fa59c9f92f033dbb/restaurantMobileCover-جیکجیکبریان-110945.png'
        },
        pagination: {
          total: 37,
          currentPage: 1,
          lastPage: 4
        }
      }
    }
    // Crashlytics.setUserName(this.props.state.user.result.session.user.fullName)
    // Crashlytics.setUserEmail(this.props.state.user.result.session.user.email)
    // Crashlytics.setUserIdentifier(`${this.props.state.user.result.session.user.id}`)
    // Crashlytics.setString('Screen', 'Financial Report')
    analytics.setCurrentScreen('گزارش فروش')
  }

  componentDidMount() {
    // this.fetchData()
  }

  fetchData = paginate => {
    if(paginate == null) paginate = false
    console.log('PAGE NUMBER 00', paginate)
    API.salesReport(this.props, paginate, this.state.dateFrom, this.state.dateTo, this.state.period, this.state.orderId)
  }

  loadMore = () => {
    this.fetchData(true) // this adds items to current list
    // API.salesReport(this.props, true, this.state.dateFrom, this.state.dateTo, this.state.period) // second arg is for pagination
  }

  showReportDetail = (id) => {
    Navigation.push(this.props.componentId, { 
      component: {
      name: 'FinancialReportDetail',
      passProps: { id },
      options: { animations: { push: { enabled: false, waitForRender: true } } } 
      } 
  })
  }

  render() {
    return (
      <KeyboardAvoidingView style={[r.full, g.bgPrimary]} behavior='padding'>
        <Navbar
          title={'گزارش مالی'}
          comments={this.props.state.comments && this.props.state.comments.result.pagination.total}
          {...this.props}
        />

        <View style={r.full}>
          {this.props.state.loading && !this.props.state.salesReport && <Loading />}
          {this.state.data && (
            <View
              style={r.full}
              animation={'fadeIn'}
              duration={300}
              delay={0}
              useNativeDriver
            >
              <ScrollView 
                showsVerticalScrollIndicator
                refreshControl={
                  <RefreshControl 
                    refreshing={this.props.state.loading}
                    onRefresh={() => this.fetchData()}
                  />
                }
                keyboardShouldPersistTaps={'always'}
                keyboardDismissMode={'on-drag'}
              >
                <Header style={[r.hCenter]}>
                  <View style={[r.topM30, r.round15, g.homeProfile]}>
                    <Image
                      key={this.state.data.restaurant.profile}
                      uri={this.state.data.restaurant.profile}
                      style={[r.round15, g.homeAvatar]}
                      resizeMode={'cover'}
                    />

                    {this.state.data.restaurant.hasCampaign &&
                      this.state.data.restaurant.salePercentage > 0 && (
                      <View style={[r.absolute, g.bgRedLight, r.center, g.homeSalePercent]}>
                        <Text
                          bold
                          size={16}
                          height={17}
                          lineHeight={25}
                          includefontPadding={false}
                          style={[r.centerText, r.white]}
                        >
                          ٪{this.state.data.restaurant.salePercentage}
                        </Text>
                      </View>
                    )}
                  </View>
                  
                  <View style={[r.hCenter]}>
                    <Text bold multiline size={16} style={[r.white, r.centerText, r.margin10]}>
                      گزارش فروش {this.state.data.restaurant.name}
                    </Text>

                    <View style={[r.rtl, r.hCenter ]}>
                        <Icon name={'payment'} size={22} style={[r.light4]}/>
                        <Text style={[r.grayMid, r.marginH5]} size={14}>
                          نوع تسویه حساب:
                        </Text>
                        <Text size={16} bold style={[g.accent]}>
                          {this.state.data.restaurant.contractPeriod}
                        </Text>
                    </View>

                  </View>

                </Header>


                <View style={[r.topM20, r.paddH15]}>
                  <FlatList 
                    data={this.state.data.invoices}
                    keyExtractor={item => item.id}
                    ListFooterComponent={() => (
                      <ListFooter 
                        items={this.state.data.invoices} 
                        loading={this.props.state.loading}
                        onPress={this.loadMore} 
                      />
                    )}
                    renderItem={({ item }) => (
                      <OrderItem
                        {...item}
                        onPress={() => this.showReportDetail(item.id)}
                      />
                    )}
                  />
                </View>

              </ScrollView>
            </View>
          )}
        </View>

        <Tabbar 
          {...this.props}
          active = {'FinancialReport'}
          notificationCount = {null}  // this must be null if we dont have count
        />

        <Modal
          isVisible={this.state.showDatePicker}
          animationIn={'slideInUp'}
          animationOut={'slideOutDown'}
          backdropOpacity={0.5}
          useNativeDriver
          hideModalContentWhileAnimating
          style={[g.modal, { justifyContent: 'flex-end', marginTop: 20 }]}
          onBackdropPress={() => this.setState({ showDatePicker: false })}
          onBackButtonPress={() => this.setState({ showDatePicker: false })}
        >
          <ModalView 
            style={[{ flex: IOS ? 0.6 : 0.7 }]}
            visible={this.state.showDatePicker}
          >
            <View style={[r.full, r.topP10, r.spaceBetween]}>
              <PersianCalendarPicker
                isRTL
                textStyle={[r.fa, r.grayMid, r.topP5]}
                todayBackgroundColor={'#e1e2e3'}
                onDateChange={date => this.timePicker(date)}
              />
              {(this.state.dateFrom || this.state.dateTo) && (
                <Anim.View 
                  style={[g.bgRed, { height: 50 }]}
                  animation={'fadeIn'}
                  duration={200}
                  delay={200} // for not flashing in while Modal is scrolling down
                  useNativeDriver
                >
                  <Button
                    androidStyle={[r.full]}
                    style={[r.full, r.center]}
                    ripple={'#ffffff33'}
                    onPress={this.resetTimeFilter}
                  >
                    <Text size={14} height={18} lineHeight={22} style={[r.white]}>
                      حذف فیلتر زمان
                    </Text>
                  </Button>
                </Anim.View>
              )}
            </View>
          </ModalView>
        </Modal>

        <Modal
          isVisible={this.state.showOrderDetail}
          animationIn={'slideInUp'}
          animationOut={'slideOutDown'}
          backdropOpacity={0.3}
          hideModalContentWhileAnimating
          useNativeDriver
          style={[g.modal, { marginTop: 100 }]}
          onBackdropPress={this.hideOrder}
          onBackButtonPress={this.hideOrder}
        >
          <ModalView
            style={[r.full]}
            visible={this.state.showOrderDetail}
          >
            <View style={[r.bgLight5, r.rtl, r.spaceBetween, r.hCenter, { height: 60 }]}>
              <Text bold size={16} height={24} lineHeight={25} style={[r.grayMid, r.rightM20]}>
                جزییات فاکتور فروش
              </Text>
              <Icon
                name={'remove'} 
                size={25}
                style={[r.grayMid, r.centerText, { width: 60 }]}
                onPress={this.hideOrder}
              />
            </View>
            
            {this.props.state.loading && <Loading color={'#A6BCC7'} />}
            {this.props.state.order && (
              <Anim.View
                style={[r.full]}
                animation={'fadeIn'}
                duration={300}
                delay={100}
                useNativeDriver
              >
                <ScrollView showsVerticalScrollIndicator={false}>
                  <OrderDetailRow 
                    right={'شماره فاکتور'}
                    left={this.props.state.order.result.detail.orderId}
                  />
                  <OrderDetailRow 
                    right={'تاریخ و زمان سفارش'}
                    left={this.props.state.order.result.detail.orderPaidAt}
                  />
                  <OrderDetailRow 
                    right={'نام مشتری'}
                    left={this.props.state.order.result.detail.userName}
                  />
                  <OrderDetailRow 
                    right={'شماره همراه مشتری'}
                    left={this.props.state.order.result.detail.userPhone}
                  />
                  <OrderDetailRow 
                    right={'آدرس مشتری'}
                    left={this.props.state.order.result.detail.userAddress}
                    multiline={20}
                  />
                  <OrderDetailRow 
                    right={'توضیحات کاربر'}
                    left={this.props.state.order.result.detail.orderDescription}
                    multiline={20}
                  />

                  <View style={[r.bgLight4, r.round10, r.margin10, r.marginV20]}> 
                    {this.props.state.order.result.food.map((item, index) => (
                      <OrderDetailRow 
                        key={index}
                        items
                        right={item.foodName}
                        left={(
                          <>
                            <PriceText>{item.orderItemCount}</PriceText>
                            <PriceText> x </PriceText>
                            <PriceText> تومان </PriceText>
                            <PriceText>{numeral(item.orderItemPrice).format('0,0')}</PriceText>
                            <PriceText> = </PriceText>
                            <PriceText> تومان </PriceText>
                            <PriceText>{numeral(item.orderItemCount * item.orderItemPrice).format('0,0')}</PriceText>
                          </>
                        )}
                      />
                    ))}
                    <OrderDetailRow 
                      bold
                      items
                      right={`مجموع (${this.props.state.order.result.detail.orderItemCount} عدد) `}
                      left={(
                        <>
                          <PriceText bold> تومان </PriceText>
                          <PriceText bold>{numeral(this.props.state.order.result.detail.totalPriceWithRes).format('0,0')}</PriceText>
                        </>
                      )}
                    />
                    <OrderDetailRow 
                      items
                      right={'هزینه بسته بندی'}
                      left={(
                        <>
                          {this.props.state.order.result.detail.packagingPrice != 0 && <PriceText> تومان </PriceText>}
                          <PriceText>{numeral(this.props.state.order.result.detail.packagingPrice).format('0,0')}</PriceText>
                        </>
                      )}
                    />
                    <OrderDetailRow 
                      items
                      right={`مالیات بر ارزش افزوده (${this.props.state.order.result.detail.contractFoodVat}%) `}
                      left={(
                        <>
                          {this.props.state.order.result.detail.allVat != 0 && <PriceText> تومان </PriceText>}
                          <PriceText>{numeral(this.props.state.order.result.detail.allVat).format('0,0')}</PriceText>
                        </>
                      )}
                    />
                    <OrderDetailRow 
                      items
                      right={'تخفیف رستوران'}
                      left={(
                        <PriceText>%{this.props.state.order.result.detail.restaurantShareDiscountPercent}</PriceText>
                      )}
                    />
                    <OrderDetailRow 
                      items
                      right={'هزینه ارسال'}
                      left={(
                        <>
                          {this.props.state.order.result.detail.deliveryPrice != 0 && <PriceText> تومان </PriceText>}
                          <PriceText>{numeral(this.props.state.order.result.detail.deliveryPrice).format('0,0')}</PriceText>
                        </>
                      )}
                    />
                    <OrderDetailRow 
                      bold
                      items
                      right={'پرداختی کاربر'}
                      left={(
                        <>
                          <PriceText bold> تومان </PriceText>
                          <PriceText bold>{numeral(this.props.state.order.result.detail.restaurantOrderPriceShow).format('0,0')}</PriceText>
                        </>
                      )}
                    />
                  </View>
                </ScrollView>
              </Anim.View>
            )}
          </ModalView>
        </Modal>
          
        <Notification />
        
      </KeyboardAvoidingView>
    )
  }
}

const mapStateToProps = state => ({ state })
const mapDispatchToProps = dispatch => ({ dispatch })
export default connect(mapStateToProps, mapDispatchToProps)(FinancialReport)


const OrderItem = props => (
  <Anim.View
    style={[r.wFull, r.shadow5, r.bottomM40, r.overhide]}
    animation={'fadeInUp'}
    duration={150}
    delay={50}
    useNativeDriver
  >
    <View style={[r.bottomM5, r.leftP10, r.rtl]}>
      {/* <Text style={[r.white]} size={14} bold>هفته اول تیر ماه</Text> */}
      <Text style={[r.grayMid, r.rightM10]} size={13} bold>{props.period}</Text>
    </View>

    <View style={[r.wFull, r.bgLight2, r.round15, r.shadow5, r.bottomM10, r.overhide]}>
      <View style={[r.bgLight4, r.rightP10, r.vCenter, { height: 40 }]}>
        <Text
          bold
          size={12}
          height={25}
          lineHeight={28}
          style={[r.grayMid]}
        >
          شماره صورتحساب: {props.id}
        </Text>
        <Button
          style={[g.bgGreen, r.center, g.salesReportOrderDetailBTN, { left: IOS ? 5 : 0 }]}
          androidStyle={[g.bgGreen, r.center, g.salesReportOrderDetailBTN]}
          onPress={props.onPress}
        >
          <Text 
            bold 
            size={10} 
            height={14} 
            lineHeight={16} 
            style={[r.white, r.centerText]}
          >
            مشاهده جزئیات
          </Text>
        </Button>
      </View>
      <View style={[r.rightP15, r.vCenter, r.paddV15]}>
        <Text size={11} style={[r.grayMid]}>
          تاریخ صدور صورتحساب:‌ 
          <Text>  {props.createdAt}</Text>
        </Text>

        <View style={[g.line, r.bgLight5, r.leftM10, r.marginV5]} />

        <Text size={11} style={[r.grayMid, r.topM5]}>
          تعداد سفارشات:‌ 
          <Text>  {numeral(props.orderCount).format('0,0')}</Text>
        </Text>

        <View style={[g.line, r.bgLight5, r.leftM10, r.marginV5]} />

        <Text size={11} style={[r.grayMid, r.topM5]}>
          مجموع مبلغ سفارش:‌ 
          <Text>  {numeral(props.orderTotalPrices).format('0,0')}</Text>
          <Text size={11}>  تومان</Text>
        </Text>

        <View style={[g.line, r.bgLight5, r.leftM10, r.marginV5]} />

        <Text size={11} style={[r.grayMid, r.topM5]}>
          تعداد سند اصلاحیه:‌ 
          <Text>  {numeral(props.orderCorrectionCount).format('0,0')}</Text>
        </Text>

        <View style={[g.line, r.bgLight5, r.leftM10, r.marginV5]} />

        <Text size={11} style={[r.grayMid, r.topM5]}>
          مجموع مبلغ اصلاحیه:‌ 
          <Text>  {numeral(props.orderCorrectionTotalPrices).format('0,0')}</Text>
          <Text size={11}>  تومان</Text>
        </Text>

        <View style={[g.line, r.bgLight5, r.leftM10, r.marginV5]} />

        <Text size={11} style={[r.grayMid, r.topM5]}>
          مجموع کل پرداختی:‌ 
          <Text>  {numeral(props.price).format('0,0')}</Text>
          <Text size={11}>  تومان</Text>
        </Text>

        <View style={[g.line, r.bgLight5, r.leftM10, r.marginV5]} />

        <Text size={11} style={[r.grayMid, r.topM5]}>
          وضعیت پرداخت:‌ 
          <Text style={g.accent} bold>  {props.status}</Text>
        </Text>
      </View>
    </View>
  </Anim.View>
)

const OrderDetailRow = props => (
  <View 
    style={[
      r.rtl, r.paddH20, r.hCenter, r.spaceBetween, r.paddV5, g.orderDetailRow, 
      props.items && [r.paddH10, { minHeight: 50 }]
    ]}
  >
    <View style={[r.leftM30, { flex: 0.8 }]}>
      <Text 
        bold={props.bold}
        size={props.items ? 11 : 15} 
        height={23} 
        lineHeight={25} 
        style={[r.grayDark, r.rtlText, r.rightText]}
        numberOfLines={1}
      >
        {props.right}
      </Text>
    </View>
    <View style={r.full}>
      {props.items ? (
        <View style={[r.row, r.leftItems]}>{props.left}</View>
      ) : (
        <Text 
          size={15}
          height={23} 
          lineHeight={25} 
          numberOfLines={props.multiline}
          style={[
            r.grayMid, r.leftText, r.ltrText,
            props.multiline && [r.centerText, r.text12, { lineHeight: 20 }],
            !props.multiline && [{ height: 20 }]
          ]}
        >
          {props.left}
        </Text>
      )}
    </View>
  </View>
)

const PriceText = ({children, bold}) => (
  <Text bold={bold} size={12} style={[r.grayDark, r.rtlText]}>
    {children}
  </Text>
)

// const ListFooter = ({ props, onPress }) => (
//   <View style={[r.center, r.wFull, r.bottomM10, { height: 60 }]}>
//     {(props.salesReport.result.orders.length >= 20 || props.loading) && (
//       <ButtonLight
//         style={[r.round30, r.center, { width: 80, height: 40 }]}
//         onPress={onPress}
//       >
//       {props.loading ? (
//         <Loading /> 
//       ) : (
//         <Icon 
//           name={'right'} 
//           size={16} 
//           style={[r.rotate90, r.white, r.centerText, { width: 13 }]} 
//         />
//       )}
//       </ButtonLight>
//     )}

//     {!props.loading && props.salesReport.result.orders.length === 0 && <EmptyList />}
//     <EmptyList />
//   </View>
// )
