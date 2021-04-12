
import React, { Component } from 'react'
import { View, ScrollView, TextInput, KeyboardAvoidingView, FlatList, RefreshControl } from 'react-native'
import { connect } from 'react-redux'
import * as Anim from 'react-native-animatable'
import numeral from 'numeral'
// import { Crashlytics} from 'react-native-fabric'
import PersianCalendarPicker from 'react-native-persian-calendar-picker'
import Modal from 'react-native-modal'
import ScrollableTabView from 'react-native-scrollable-tab-view'
import Image from '../components/image'
import ModalView from '../components/modalView'
import { Text, Icon } from '../components/font'
import Button, { ButtonLight } from '../components/button'
import Header from '../components/header'
import Navbar from '../components/navbar'
import Tabbar from '../components/tabbar'
import ScrollableTabBar from '../components/scrollableTabbar'
import * as r from '../styles/rinc'
import * as g from '../styles/general'
import { IOS, navigatorStyle } from '../assets'
import * as util from '../utils'
import API from '../utils/service'
import Loading from '../components/loading'
import ListFooter from '../components/listFooter'
import Notification from '../components/notification'
import analytics from '../../constants/analytics'
import OrdersList from './ordersList'
import AmendmentsList from './amendmentsList'

// const ScrollableTabBar = require('../components/scrollableTabbar')

class FinancialReportDetail extends Component {
  static options = () => navigatorStyle

  constructor(props) {
    super(props)
    this.state = {
      currentTab: 0,
      ordersCount: 300,
      amendmentsCount: 56,

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
    analytics.setCurrentScreen('جزییات گزارش فروش')
  }

  componentDidMount() {
    this.fetchData(this.props.invoiceId)
  }

  fetchData = (invoiceId, paginate) => {
    if(paginate == null) paginate = false
    API.financialOrders(this.props, invoiceId, paginate)
    API.financialAmendments(this.props, invoiceId, paginate)
  }

  render() {
    const ordersData = this.props.state.financialOrders ? this.props.state.financialOrders.result : null
    const amendmentsData = this.props.state.financialAmendments ? this.props.state.financialAmendments.result : null
    return (
      <View style={[r.full, g.bgPrimary]}>
        <Navbar
          back
          title={'گزارش مالی'}
          comments={this.props.state.comments && this.props.state.comments.result.pagination.total}
          {...this.props}
        />

        <View style={r.full}>
          {/* {this.props.state.loading && !this.props.state.salesReport && <Loading />} */}
          {(ordersData && amendmentsData) && (
            <View
              style={r.full}
              animation={'fadeIn'}
              duration={300}
              delay={0}
              useNativeDriver
            >
              <ScrollableTabView
                renderTabBar={() => (
                  <ScrollableTabBar 
                    orders={ordersData.data ? ordersData.pagination.total : 0}
                    amendments={amendmentsData.data ? amendmentsData.pagination.total : 0}
                  />
                )}
                initialPage={1}
                tabBarActiveTextColor={'#F64559'}
                tabBarInactiveTextColor={'#697989'}
              >
                <AmendmentsList tabLabel={'لیست اصلاحیه ها'} invoiceId ={this.props.invoiceId} />
                <OrdersList tabLabel={"لیست سفارشات"} invoiceId ={this.props.invoiceId} />
              </ScrollableTabView>

            </View>
          )}
        </View>

        <Tabbar 
          {...this.props}
          active = {'FinancialReport'}
          notificationCount = {null}  // this must be null if we dont have count
        />
 
        <Notification />
        
      </View>
    )
  }
}

const mapStateToProps = state => ({ state })
const mapDispatchToProps = dispatch => ({ dispatch })
export default connect(mapStateToProps, mapDispatchToProps)(FinancialReportDetail)


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
