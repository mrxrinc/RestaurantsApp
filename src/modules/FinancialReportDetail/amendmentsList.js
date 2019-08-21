
import React, { Component } from 'react'
import { View, FlatList, RefreshControl } from 'react-native'
import { connect } from 'react-redux'
import * as Anim from 'react-native-animatable'
import numeral from 'numeral'
import IOS from '../assets/platform'
import { Text, Icon } from '../components/font'
import * as r from '../styles/rinc'
import * as g from '../styles/general'
import * as asset from '../assets'
import API from '../utils/service'
import Loading from '../components/loading'
import ListFooter from '../components/listFooter'
import analytics from '../../constants/analytics'

class AmendmentsList extends Component {
  static navigatorStyle = asset.navigatorStyle

  constructor(props) {
    super(props)
    this.state = {
        data: [
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
    }
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

  render() {
    analytics.setCurrentScreen('جزییات گزارش فروش')
    return (
      <View style={[r.full, g.bgPrimary]} >
          {this.props.state.loading && !this.props.state.salesReport && <Loading />}
          {this.state.data && (
            <View
              style={[r.full]}
              animation={'fadeIn'}
              duration={300}
              delay={0}
              useNativeDriver
            >

                <FlatList 
                    data={this.state.data}
                    style={[r.padd15]}
                    keyExtractor={item => item.id}
                    ListFooterComponent={() => (
                        <ListFooter 
                        items={this.state.data.invoices} 
                        loading={this.props.state.loading}
                        onPress={this.loadMore} 
                        />
                    )}
                    renderItem={({ item }) => (
                        <AmendmentItem
                            id={'CHL-AX7974YY'}
                            reason={'نرسیدن سفارش به مقصد'}
                            date={'1398/2/10 - 10:13'}
                            price={'55690'}
                        />
                    )}
                />

            </View>
          )}

      </View>
    )
  }
}

const mapStateToProps = state => ({ state })
const mapDispatchToProps = dispatch => ({ dispatch })
export default connect(mapStateToProps, mapDispatchToProps)(AmendmentsList)


const AmendmentItem = props => (
    <Anim.View
    style={[r.wFull, r.shadow5, r.bottomM20, r.overhide]}
    animation={'fadeInUp'}
    duration={150}
    delay={100}
    useNativeDriver
  >

    <View style={[r.wFull, r.bgLight2, r.round15, r.shadow5, r.rtl, r.spaceBetween]}>
      <View style={[r.rightP15, r.vCenter, r.paddV15]}>
        <Text size={14} style={[r.grayDark]} bold>
            شماره اصلاحیه:‌ 
          <Text>   {props.id}</Text>
        </Text>

        <Text size={11} style={[r.grayMid, r.topM5]}>
            دلیل اصلاح فاکتور:‌ 
          <Text>  {props.reason}</Text>
        </Text>

        <Text size={11} style={[r.grayMid, r.topM5]}>
            تاریخ و زمان ایجاد:‌ 
          <Text>  {props.date}</Text>
        </Text>

        <Text size={11} style={[r.grayMid, r.topM5]}>
            مبلغ:‌ 
          <Text>  {numeral(props.price).format('0,0')}-</Text>
          <Text size={11}>  تومان</Text>
        </Text>
      </View>
    </View>
  </Anim.View>
)

