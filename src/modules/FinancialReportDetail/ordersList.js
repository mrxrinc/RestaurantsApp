
import React, { Component } from 'react'
import { View, FlatList, RefreshControl } from 'react-native'
import { connect } from 'react-redux'
import * as Anim from 'react-native-animatable'
import numeral from 'numeral'
import Modal from 'react-native-modal'
import ModalView from '../components/modalView'
import { IOS } from '../assets'
import { Text, Icon } from '../components/font'
import Button, { ButtonLight } from '../components/button'
import * as r from '../styles/rinc'
import * as g from '../styles/general'
import * as asset from '../assets'
import API from '../utils/service'
import Loading from '../components/loading'
import ListFooter from '../components/listFooter'

class OrdersList extends Component {

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

  showModal = state => { this.setState({ showModal: state }) }

  render() {
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
                        <OrderItem
                            id={'CHL-AX7974YY'}
                            date={'1398/2/10 - 10:13'}
                            price={'55690'}
                            onPress={() => this.showModal(true)}
                        />
                    )}
                />

            </View>
          )}

        <Modal
          isVisible={this.state.showModal}
          animationIn={'slideInUp'}
          animationOut={'slideOutDown'}
          backdropOpacity={0.3}
          hideModalContentWhileAnimating
          useNativeDriver
          style={[g.modal, { marginTop: 40 }]}
          onBackdropPress={() => this.showModal(false)}
          onBackButtonPress={() => this.showModal(false)}
        >
          <ModalView
            style={[r.full]}
            visible={this.state.showModal}
          >
            <View style={[r.bgLight5, r.rtl, r.spaceBetween, r.hCenter, { height: 50 }]}>
              <Text bold size={14} height={24} lineHeight={25} style={[r.grayMid, r.rightM20]}>
                جزییات فاکتور فروش
              </Text>
              <Icon
                name={'remove'} 
                size={22}
                style={[r.grayMid, r.centerText, { width: 60 }]}
                onPress={() => this.showModal(false)}
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
         

      </View>
    )
  }
}

const mapStateToProps = state => ({ state })
const mapDispatchToProps = dispatch => ({ dispatch })
export default connect(mapStateToProps, mapDispatchToProps)(OrdersList)


const OrderItem = props => (
  <Anim.View
    style={[r.wFull, r.shadow5, r.bottomM20, r.overhide]}
    animation={'fadeInUp'}
    duration={150}
    delay={100}
    useNativeDriver
  >

    <ButtonLight 
        style={[r.wFull, r.bgLight2, r.round15, r.shadow5, r.rtl, r.spaceBetween]}
        onPress={props.onPress}
    >
      <View style={[r.rightP15, r.vCenter, r.paddV15]}>
        <Text size={14} style={[r.grayDark]} bold>
          شماره فاکتور:‌ 
          <Text>   {props.id}</Text>
        </Text>


        <Text size={11} style={[r.grayMid, r.topM5]}>
            تاریخ و زمان سفارش:‌ 
          <Text>  {props.date}</Text>
        </Text>


        <Text size={11} style={[r.grayMid, r.topM5]}>
            مجموع کل:‌ 
          <Text>  {numeral(props.price).format('0,0')}</Text>
          <Text size={11}>  تومان</Text>
        </Text>
      </View>
      <View style={[r.center, { width: 40 }]}>
        <Icon name={'left'} style={[r.grayLight]} size={25} />
      </View>
    </ButtonLight>
  </Anim.View>
)

