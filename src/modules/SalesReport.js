import React, { Component } from 'react'
import { View, ScrollView, TextInput, KeyboardAvoidingView, FlatList, RefreshControl } from 'react-native'
import { connect } from 'react-redux'
import * as Anim from 'react-native-animatable'
import numeral from 'numeral'
// import { Crashlytics} from 'react-native-fabric'
import PersianCalendarPicker from 'react-native-persian-calendar-picker'
import Modal from 'react-native-modal'
import { IOS, navigatorStyle } from './assets'
import Image from './components/image'
import ModalView from './components/modalView'
import { Text, Icon } from './components/font'
import Button, { ButtonLight } from './components/button'
import Header from './components/header'
import Navbar from './components/navbar'
import Tabbar from './components/tabbar'
import * as r from './styles/rinc'
import * as g from './styles/general'
import * as util from './utils'
import API from './utils/service'
import Loading from './components/loading'
import ListFooter from './components/listFooter'
import Notification from './components/notification'
// import analytics from '../constants/analytics'

const LiveIcon = Anim.createAnimatableComponent(Icon)

class SalesReport extends Component {
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
      showDatePicker: false
    }
    // Crashlytics.setUserName(this.props.state.user.result.session.user.fullName)
    // Crashlytics.setUserEmail(this.props.state.user.result.session.user.email)
    // Crashlytics.setUserIdentifier(`${this.props.state.user.result.session.user.id}`)
    // Crashlytics.setString('Screen', 'Sales Report')
  }

  componentDidMount() {
    this.fetchData()
  }

  fetchData = paginate => {
    if(paginate == null) paginate = false
    console.log('PAGE NUMBER 00', paginate)
    API.salesReport(this.props, paginate, this.state.dateFrom, this.state.dateTo, this.state.period, this.state.orderId)
  }

  timePicker = date => {
    console.log('DATE======= ', date)
    this.state.dateOpenModal === 'from' ?
      this.setState({ 
        dateFrom: util.dateReform(date._d),
        showDatePicker: false
      }) :
      this.setState({ 
        dateTo: util.dateReform(date._d),
        showDatePicker: false
      })
  }

  showOrder = id => {
    this.setState({ showOrderDetail: true }, () => {
      API.loadOrder(this.props, id)
    })
  }

  hideOrder = () => {
    this.setState({ showOrderDetail: false }, () => {
      API.unloadOrder(this.props.dispatch)
    })
  }

  resetTimeFilter = () => {
    this.setState({
      dateFrom: null,
      dateTo: null,
      showDatePicker: false
    }, () => API.salesReport(this.props))
  }

  period = period => {
    this.state.period === period ?
    this.setState({ period: null }, () => this.fetchData()) :
    this.setState({ period: period }, () => this.fetchData())
  }

  loadMore = () => {
    this.fetchData(true) // this adds items to current list
    // API.salesReport(this.props, true, this.state.dateFrom, this.state.dateTo, this.state.period) // second arg is for pagination
  }

  render() {
    // analytics.setCurrentScreen('گزارش فروش')
    const rangeColorFrom = this.state.dateFrom ? '#fff' : '#acb9c6' // to be active or not!
    const rangeColorTo = this.state.dateTo ? '#fff' : '#acb9c6' // to be active or not!
    return (
      <KeyboardAvoidingView style={[r.full, g.bgPrimary]} behavior='padding'>
        <Navbar
          title={'گزارش فروش'}
          comments={this.props.state.comments && this.props.state.comments.result.pagination.total}
          {...this.props}
        />

        <View style={r.full}>
          {this.props.state.loading && !this.props.state.salesReport && <Loading />}
          {this.props.state.salesReport && (
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
                      key={this.props.state.salesReport.result.restaurant.profile}
                      uri={this.props.state.salesReport.result.restaurant.profile}
                      style={[r.round15, g.homeAvatar]}
                      resizeMode={'cover'}
                    />

                    {!!this.props.state.salesReport.result.restaurant.salePercentage &&
                      this.props.state.salesReport.result.restaurant.salePercentage !== 0 && (
                      <View style={[r.absolute, g.bgRedLight, r.center, g.homeSalePercent]}>
                        <Text
                          bold
                          size={16}
                          height={17}
                          lineHeight={25}
                          includefontPadding={false}
                          style={[r.centerText, r.white]}
                        >
                          ٪{this.props.state.salesReport.result.restaurant.salePercentage}
                        </Text>
                      </View>
                    )}
                  </View>
                  
                  <View style={[r.hCenter]}>
                    <Text bold multiline size={18} style={[r.white, r.centerText, r.margin10]}>
                      {this.props.state.salesReport.result.restaurant.name}
                    </Text>

                    {/* <View style={[r.rtl, r.topM20]}>
                      <View style={[r.full, r.center, r.topM10]}>
                        <Icon name={'payment'} size={35} style={[r.light4]}/>
                        <Text style={[r.grayMid, r.topM5]} size={14}>
                          مجموع فروش:
                        </Text>
                        <Text size={18} style={[g.accent]}>
                          <Text bold>
                            {numeral(this.props.state.salesReport.result.totalOrderFinancial).format('0,0')}
                          </Text>
                          <Text size={14}> تومان</Text>
                        </Text>
                      </View>
                      <View style={[r.full, r.center, r.topM10]}>
                        <Icon name={'food'} size={35} style={[r.light4]}/>
                        <Text style={[r.grayMid, r.topM5]} size={14}>
                          تعداد سفارشات:
                        </Text>
                        <Text size={18} style={[g.accent]}>
                          <Text bold>
                            {this.props.state.salesReport.result.orders ? 
                              numeral(this.props.state.salesReport.result.pagination.total).format('0,0') :
                              '--'
                            }
                          </Text>
                        </Text>
                      </View>
                    </View> */}

                  </View>

                </Header>

                <View style={[r.bgWhite, r.topM20, r.rtl, r.round30, r.marginH15, { height: 35 }]}>
                  <TextInput 
                    style={[r.full, r.fa, r.padd0, r.rightText, r.paddH10, { paddingTop: IOS ? 7 : 3 }]}
                    placeholder={'جستجوی شماره فاکتور ...'}
                    value={this.state.orderId}
                    onChangeText={orderId => this.setState({ orderId })}
                    onSubmitEditing={() => this.fetchData(false)}
                  />
                  <Button
                    style={[r.center, { maxWidth: 40 }]}
                    androidStyle={[r.full, { maxWidth: 40 }]}
                    ripple={'#00044'}
                    expandableRipple
                    onPress={() => this.fetchData(false)}
                  >
                    <Icon name={'zoom'} size={20} style={[r.grayLight]}/>
                  </Button>
                </View>
                
                <View style={[r.bgGrayMid, r.round15, r.padd10, r.margin15]}>
                  <View style={[r.rtl, r.spaceBetween, r.marginV10, r.paddH10]}>
                    <Button 
                      style={[r.rtl]}
                      androidStyle={[r.full]}
                      ripple={'#ffffff11'}
                      expandableRipple
                      onPress={() => this.setState({ showDatePicker: true, dateOpenModal: 'from' })}
                    >
                      <Icon  
                        name={'calendar'} 
                        size={22} 
                        color={rangeColorFrom} 
                        style={[r.rightText, { width: 30 }]} 
                      />
                      <View style={[r.full, { borderBottomWidth: 1.5, borderColor: rangeColorFrom }]}>
                        <Text style={[r. centerText, { color: rangeColorFrom }]}>
                          {this.state.dateFrom ? util.jalali(this.state.dateFrom) : 'از تاریخ'}
                        </Text>
                      </View>
                    </Button>

                    <View style={{ width: 25 }} />

                    <Button 
                      style={[r.rtl]}
                      androidStyle={[r.full]}
                      ripple={'#ffffff11'}
                      expandableRipple
                      onPress={() => this.setState({ showDatePicker: true, dateOpenModal: 'to' })}
                    >
                      <Icon
                        name={'calendar'} 
                        size={22} 
                        color={rangeColorTo} 
                        style={[r.rightText, { width: 30 }]}
                      />
                      <View style={[r.full, { borderBottomWidth: 1.5, borderColor: rangeColorTo }]}>
                        <Text style={[r. centerText, { color: rangeColorTo }]}>
                          {this.state.dateTo ? util.jalali(this.state.dateTo) : 'تا تاریخ'}
                        </Text>
                      </View>
                    </Button>
                  </View>
                  
                  <View style={[r.marginV20]}>
                    <Button 
                      style={[g.bgGreen, r.center,  r.round30, { height: 45 }]}
                      androidStyle={[r.full, r.round30]}
                      ripple={'#ffffff33'}
                      onPress={() => this.setState({ period: null }, () => this.fetchData())} // must have false man for pagination purpose
                    >
                      <Text size={15} height={19} lineHeight={23} style={[r.white]}>اعمال فیلتر</Text>
                    </Button>
                  </View>

                  <View style={[r.rtl, r.padd3]}>
                    <FilterBTN
                      period={this.state.period}
                      value={'today'}
                      title={'امروز'}
                      onPress={() => this.period('today')}
                    />

                    <View style={{ width: 5 }} />
                    
                    <FilterBTN
                      period={this.state.period}
                      value={'current-week'}
                      title={'هفته جاری'}
                      onPress={() => this.period('current-week')}
                    />

                    <View style={{ width: 5 }} />

                    <FilterBTN
                      period={this.state.period}
                      value={'current-month'}
                      title={'ماه جاری'}
                      onPress={() => this.period('current-month')}
                    />
                  </View>

                </View>

                <View style={[r.topM20, r.paddH15]}>
                  <FlatList 
                    data={this.props.state.salesReport.result.orders}
                    keyExtractor={item => item.id}
                    ListFooterComponent={() => (
                      <ListFooter 
                        items={this.props.state.salesReport.result.orders} 
                        loading={this.props.state.loading}
                        onPress={this.loadMore} 
                      />
                    )}
                    renderItem={({ item }) => (
                      <OrderItem
                        id={item.id}
                        date={item.orderPaidAt}
                        price={item.orderTotalPrice}
                        onPress={() => this.showOrder(item.id)}
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
          active = {'salesReport'}
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
export default connect(mapStateToProps, mapDispatchToProps)(SalesReport)

const FilterBTN = props => (
  <Button
    ripple={'#00000011'}
    style={[
      props.period === props.value ? r.bgWhite : r.bgLight5, 
      r.round20, r.center, { height: 32 }
    ]}
    androidStyle={[r.full, r.round20]}
    onPress={props.onPress}
    >
    <Text 
      bold={props.period === props.value}
      size={11} 
      height={16} 
      lineHeight={18} 
      style={[props.period === props.value ? r.grayDark : r.grayMid]}
      >
      {props.title}
    </Text>
    {props.period === props.value && (
      <LiveIcon 
        name={'remove-fill'}
        size={25}
        style={[r.red, r.absolute, { left: 5 }]}
        animation={'tada'}
        duration={200}
        easing={'ease-out-back'}
        useNativeDriver
      />
    )}
  </Button>
)

const OrderItem = ({id, date, price, onPress}) => (
  <Anim.View 
    style={[r.wFull, r.bgLight2, r.round15, r.shadow5, r.bottomM10, r.overhide, { 
      height: 120 
    }]}
    animation={'fadeIn'}
    duration={150}
    delay={50}
    useNativeDriver
  >

    <View style={[r.bgLight4, r.rightP10, r.vCenter, { height: 40 }]}>
      <Text
        bold
        size={12}
        height={25}
        lineHeight={28}
        style={[r.grayMid]}
      >
        شماره فاکتور: {id}
      </Text>
      <Button
        style={[g.bgGreen, r.center, g.salesReportOrderDetailBTN, { left: IOS ? 5 : 0 }]}
        androidStyle={[g.bgGreen, r.center, g.salesReportOrderDetailBTN]}
        onPress={onPress}
      >
        <Text 
          bold 
          size={12} 
          height={15} 
          lineHeight={18} 
          style={[r.white, r.centerText]}
        >
          جزییات فاکتور
        </Text>
      </Button>
    </View>
     <View style={[r.rightP15, r.vCenter, { height: 80 }]}>
       <Text size={13} style={[r.grayMid]}>
        تاریخ و زمان سفارش:‌ 
        <Text>  {date}</Text>
       </Text>

       <Text size={13} style={[r.grayMid, r.topM5]}>
        مجموع کل:‌ 
        <Text>  {numeral(price).format('0,0')}</Text>
        <Text size={12}>  تومان</Text>
       </Text>
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
