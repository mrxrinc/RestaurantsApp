
import React, { Component } from 'react'
import { View, FlatList, ScrollView, RefreshControl } from 'react-native'
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
        showModal: false
    }
  }

  loadMore = () => {
    API.financialOrders(this.props, this.props.invoiceId, true) // third arg is for pagination
  }

  showModal = (state, orderId) => { 
    this.setState({ showModal: state })
    if(state) API.financialOrderDetail(this.props, orderId)
  }

  render() {
    const ordersData = this.props.state.financialOrders ? this.props.state.financialOrders.result : null
    const modalData = this.props.state.financialOrderDetail ? this.props.state.financialOrderDetail.result : null
    return (
      <View style={[r.full, g.bgPrimary]} >
          {this.props.state.loading && !this.props.state.salesReport && <Loading />}
          {ordersData && (
            <View
              style={[r.full]}
              animation={'fadeIn'}
              duration={300}
              delay={0}
              useNativeDriver
            >

                <FlatList 
                    data={ordersData.data}
                    style={[r.padd15]}
                    keyExtractor={item => item.id}
                    ListFooterComponent={() => (
                        <ListFooter 
                            items={ordersData.data} 
                            loading={this.props.state.loading}
                            onPress={this.loadMore} 
                        />
                    )}
                    renderItem={({ item }) => (
                        <OrderItem
                            id={item.id}
                            date={item.orderPaidAt}
                            price={item.totalPrice}
                            onPress={() => this.showModal(true, item.id)}
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
            {modalData && (
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
                    left={modalData.orderId}
                  />
                  <OrderDetailRow 
                    right={'تاریخ و زمان سفارش'}
                    left={modalData.orderPaidAt}
                  />
                  <OrderDetailRow 
                    right={'نام مشتری'}
                    left={modalData.userName}
                  />
                  <OrderDetailRow 
                    right={'شماره همراه مشتری'}
                    left={modalData.userPhone}
                  />
                  <OrderDetailRow 
                    right={'آدرس مشتری'}
                    left={modalData.userAddress}
                    multiline={20}
                  />
                  <OrderDetailRow 
                    right={'توضیحات کاربر'}
                    left={modalData.orderDescription}
                    multiline={20}
                  />

                  <View style={[r.bgLight4, r.round10, r.margin10, r.marginV20]}> 
                    {modalData.items.map((item, index) => (
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
                            <PriceText>{numeral(item.totalOrderItemPrice).format('0,0')}</PriceText>
                          </>
                        )}
                      />
                    ))}
                    <OrderDetailRow 
                      bold
                      items
                      right={`مجموع (${modalData.orderItemCount} عدد) `}
                      left={(
                        <>
                          <PriceText bold> تومان </PriceText>
                          <PriceText bold>{numeral(modalData.totalOrderItemPrices).format('0,0')}</PriceText>
                        </>
                      )}
                    />
                    <OrderDetailRow 
                      items
                      right={'هزینه بسته بندی'}
                      left={(
                        <>
                          {modalData.packagingPrice != 0 && <PriceText> تومان </PriceText>}
                          <PriceText>{numeral(modalData.packagingPrice).format('0,0')}</PriceText>
                        </>
                      )}
                    />
                    <OrderDetailRow 
                      items
                      right={`مالیات بر ارزش افزوده (${modalData.vatPercent}%) `}
                      left={(
                        <>
                          {modalData.orderVat != 0 && <PriceText> تومان </PriceText>}
                          <PriceText>{numeral(modalData.orderVat).format('0,0')}</PriceText>
                        </>
                      )}
                    />
                    <OrderDetailRow 
                      items
                      right={'تخفیف رستوران'}
                      left={(
                        <>
                          {modalData.restaurantDiscount != 0 && <PriceText> تومان </PriceText>}
                          <PriceText>{numeral(modalData.restaurantDiscount).format('0,0')}</PriceText>
                        </>
                      )}
                    />
                    <OrderDetailRow 
                      items
                      right={'هزینه ارسال'}
                      left={(
                        <>
                          {modalData.deliveryPrice != 0 && <PriceText> تومان </PriceText>}
                          <PriceText>{numeral(modalData.deliveryPrice).format('0,0')}</PriceText>
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
                          <PriceText bold>{numeral(modalData.orderTotalPrice).format('0,0')}</PriceText>
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