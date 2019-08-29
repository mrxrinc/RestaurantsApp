
import React, { Component } from 'react'
import { View, FlatList, RefreshControl } from 'react-native'
import { connect } from 'react-redux'
import * as Anim from 'react-native-animatable'
import numeral from 'numeral'
import { IOS } from '../assets'
import { Text, Icon } from '../components/font'
import * as r from '../styles/rinc'
import * as g from '../styles/general'
import * as asset from '../assets'
import API from '../utils/service'
import Loading from '../components/loading'
import ListFooter from '../components/listFooter'

class AmendmentsList extends Component {

  loadMore = () => {
    API.financialAmendments(this.props, this.props.invoiceId, true) // third arg is for pagination
  }

  render() {
    const amendmentsData = this.props.state.financialAmendments ? this.props.state.financialAmendments.result : null
    return (
      <View style={[r.full, g.bgPrimary]} >
          {this.props.state.loading && !this.props.state.salesReport && <Loading />}
          {amendmentsData && (
            <View
              style={[r.full]}
              animation={'fadeIn'}
              duration={300}
              delay={0}
              useNativeDriver
            >

                <FlatList 
                    data={amendmentsData.data}
                    style={[r.padd15]}
                    keyExtractor={item => item.id}
                    ListFooterComponent={() => (
                        <ListFooter 
                        items={amendmentsData.data} 
                        loading={this.props.state.loading}
                        onPress={this.loadMore} 
                        />
                    )}
                    renderItem={({ item }) => (
                        <AmendmentItem
                            id={item.id}
                            reason={item.reason}
                            date={item.createdAt}
                            price={item.amount}
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
          <Text>  {numeral(props.price).format('0,0')}</Text>
          <Text size={11}>  تومان</Text>
        </Text>
      </View>
    </View>
  </Anim.View>
)

