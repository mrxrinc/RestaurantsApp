import React, { Component } from 'react'
import { ScrollView, RefreshControl } from 'react-native'
import { View } from 'react-native-animatable'
import { connect } from 'react-redux'
// import { Crashlytics} from 'react-native-fabric'
import StarRating from 'react-native-star-rating'
import numeral from 'numeral'
import IOS from './assets/platform'
import Image from './components/image'
import { navigatorStyle } from './assets'
import { Text, Icon } from './components/font'
import Header from './components/header'
import Navbar from './components/navbar'
import Tabbar from './components/tabbar'
import Loading from './components/loading'
import API from './utils/service'
import * as r from './styles/rinc'
import * as g from './styles/general'
import Notification from './components/notification'
import analytics from '../constants/analytics'

class Home extends Component {
  static options = () => navigatorStyle

  constructor(props) {
    super(props)
    // Crashlytics.setUserName(this.props.state.user.result.session.user.fullName)
    // Crashlytics.setUserEmail(this.props.state.user.result.session.user.email)
    // Crashlytics.setUserIdentifier(`${this.props.state.user.result.session.user.id}`)
    // Crashlytics.setString('Screen', 'Home')
    analytics.setCurrentScreen('صفحه اصلی')
  }

  componentDidMount() {
    API.home(this.props)
  }

  // componentWillUnmount() {
  //   API.clearHome(this.props.dispatch)
  // }

  render() {
    return (
      <View style={[r.full, g.bgPrimary]}>
        <Navbar
          title={'خانه'}
          comments={this.props.state.comments && this.props.state.comments.result.pagination.total}
          {...this.props}
        />

        <View style={r.full}>
          {this.props.state.loading && !this.props.state.home && <Loading />}
          {this.props.state.home && (
            <View
              style={r.full}
              animation={'fadeIn'}
              duration={300}
              delay={0}
              useNativeDriver
            >
              <ScrollView 
                showsVerticalScrollIndicator={false}
                refreshControl={
                  <RefreshControl 
                    refreshing={this.props.state.loading}
                    onRefresh={() => API.home(this.props)}
                  />
                }
              >
                <Header style={[r.hCenter]}>
                  <View style={[r.topM30, r.round15, g.homeProfile]}>
                    <Image
                      uri={this.props.state.home.result.logo}
                      key={this.props.state.home.result.logo}
                      style={[r.round15, g.homeAvatar]}
                      resizeMode={'cover'}
                    />

                    {!!this.props.state.home.result.salePercentage &&
                      this.props.state.home.result.salePercentage !== 0 && (
                      <View style={[r.absolute, g.bgRedLight, r.center, g.homeSalePercent]}>
                        <Text
                          bold
                          size={18}
                          height={17}
                          lineHeight={27}
                          includefontPadding={false}
                          style={[r.centerText, r.white]}
                        >
                          ٪{this.props.state.home.result.salePercentage}
                        </Text>
                      </View>
                    )}
                  </View>
                  <View style={[r.hCenter, { width: '80%' }]}>
                    <Text bold size={18} multiline style={[r.white, r.centerText, r.marginV10]}>
                      {this.props.state.home.result.name}
                    </Text>
                    <View style={[r.bgWhite, r.round10, r.rtl, r.padd7, r.center]}>
                      <StarRating 
                        starSize={IOS ? 22 : 20}
                        disabled
                        rating={this.props.state.home.result.rate.overall}
                        halfStarEnabled
                        reversed 
                        fullStarColor={'#FFD201'}
                        emptyStarColor={'#ccc'}
                        containerStyle={[r.rightM10]}
                        starStyle={[ !IOS && r.bgLight1, !IOS && r.rightM3, r.round10]}
                      />
                      <Text 
                        size={20} 
                        lineHeight={30} 
                        height={20} 
                        style={[r.centerText, r.leftM10, r.grayDark]}
                      >
                        {this.props.state.home.result.rate.overall}
                      </Text>

                      <Text 
                        size={13} 
                        lineHeight={22} 
                        height={17} 
                        style={[r.centerText, r.ltrText, r.grayLight]}
                      >
                        (
                          <Text>{numeral(this.props.state.home.result.rate.count).format('0,0')} </Text>
                          <Icon name={'person'} size={11} />
                        )
                      </Text>
                    </View>
                    
                    <View style={[r.rtl, r.wFull, r.paddV3, r.topM15, { height: 40 }]}>

                      <View style={[r.full, r.rtl, r.center]}>
                        <Text
                          size={15}
                          height={22}
                          lineHeight={26}
                          style={[r.white, r.centerText]}
                        >
                          کیفیت غذا
                        </Text>
                        <View 
                          style={[g.bgGreenLight, r.round5, r.rtl, r.center, 
                            r.paddH5, r.leftM10, { height: 25 }
                          ]}
                        >
                          <Text bold size={17} height={15} lineHeight={25} style={[r.white]}>
                            {this.props.state.home.result.rate.foodQuality}
                          </Text>
                          <Icon name={'star-fill'} size={15} style={[r.white, r.rightM2]}/>
                        </View>
                      </View>

                      <View style={[r.full, r.rtl, r.center]}>
                        <Text
                          size={15} 
                          height={22} 
                          lineHeight={26} 
                          style={[r.white, r.centerText]}
                        >
                          سرعت ارسال
                        </Text>
                        <View 
                          style={[g.bgAccent, r.round5, r.rtl, r.center, 
                            r.paddH5, r.leftM10, { height: 25 }
                          ]}
                        >
                          <Text bold size={17} height={15} lineHeight={25} style={[r.white]}>
                            {this.props.state.home.result.rate.deliverySpeed}
                          </Text>
                          <Icon name={'star-fill'} size={15} style={[r.white, r.rightM2]}/>
                        </View>
                      </View>
                    </View>
                  </View>
                </Header>
                
                {/* <EmptyMessage /> */}

                <View style={[r.padd20, r.center]}>
                  <SaleItem 
                    range = {'امروز'}
                    // sale = {numeral(this.props.state.home.result.today.sale).format('0,0')}
                    count = {numeral(this.props.state.home.result.today.count).format('0,0')}
                  />
                  <SaleItem 
                    range = {'هفته جاری'}
                    // sale = {numeral(this.props.state.home.result.currentWeek.sale).format('0,0')}
                    count = {numeral(this.props.state.home.result.currentWeek.count).format('0,0')}
                  />
                  <SaleItem 
                    range = {'ماه جاری'}
                    // sale = {numeral(this.props.state.home.result.currentMonth.sale).format('0,0')}
                    count = {numeral(this.props.state.home.result.currentMonth.count).format('0,0')}
                  />
                </View>

                <View style={[r.padd20, r.topM10]}>
                  <Text
                    size={14}
                    includefontPadding={false}
                    style={[r.rightText, g.lightText, r.rightP10]}
                  >
                    پرفروش ترین غذاهای ۳۰ روز گذشته
                  </Text>
                  
                  {this.props.state.home.result['30Days'].topSeller.map((item, index) => (
                    <FoodItem 
                      key={index}
                      title={item.name}
                      image={item.image}
                      count = {numeral(item.count).format('0,0')}
                      rate = {item.rate}
                    />
                  ))}
                </View>

                <View style={[r.padd20, r.topM10]}>
                  <Text
                    size={14}
                    includefontPadding={false}
                    style={[r.rightText, g.lightText, r.rightP10]}
                  >
                غذاهای نیاز به بازنگری بیشتر در ۳۰ روز گذشته
                  </Text>
                  
                  {this.props.state.home.result['30Days'].lowSeller.map((item, index) => (
                    <FoodItem 
                      key={index}
                      title={item.name}
                      image={item.image}
                      count = {numeral(item.count).format('0,0')}
                      rate = {item.rate}
                    />
                  ))}
                </View>

              </ScrollView>
            </View>
          )}
        </View>

        <Notification />

        <Tabbar 
          {...this.props}
          active = {'home'}
          notificationCount = {null}  // this must be null if we dont have count
        />
          
      </View>
    )
  } 
}

const mapStateToProps = state =>  ({ state })
const mapDispatchToProps = dispatch => ({ dispatch })
export default connect(mapStateToProps, mapDispatchToProps)(Home)


const SaleItem = ({range, sale, count}) => (
  <View 
    style={[r.wFull, r.bgGrayMid, r.rtl, r.round15, r.shadow5, r.topM10, { 
      height: 60 // will be 90 in double line case 
    }]}>
    <View style={[g.bgAccent, r.center, g.homeSaleItemRightBox]}>
      <Text
        bold
        size={12}
        height={23}
        lineHeight={22}
        style={[r.grayDark]}
      >
        {range}
      </Text>
    </View>

    <View style={[r.rightP15, r.paddV10, r.vCenter, r.spaceAround]}>
      {/* <Text
        size={15}
        height={23}
        lineHeight={28}
        style={[r.white]} 
      >
        <Text>مجموع فروش: </Text>
        <Text bold>{sale}</Text>
        <Text style={r.midText}> تومان</Text>
      </Text> */}

      <Text
        size={12}
        height={23}
        lineHeight={25}
        style={[r.white]} 
      >
        <Text>تعداد سفارشات:   </Text>
        <Text bold size={15}>{count}</Text>
      </Text>
    </View>
  </View>
)

const FoodItem = ({title, image, count, rate}) => (
  <View 
    style={[r.wFull, r.bgWhite, r.rtl, r.round15, r.shadow5, r.topM10, { 
      height: 100 
    }]}>
    <View style={[r.center, r.rightM10]}>
      <Image
        uri={image}
        style={[r.round10, {width: 100, height: 80, borderWidth: 1, borderColor: '#eee' }]}
      />
    </View>

    <View style={[r.full, r.rightP15, r.padd10, r.spaceAround]}>
      
      <Text
        bold
        size={12}
        // height={23}
        lineHeight={24}
        numberOfLines={2}
        style={[r.grayDark]} 
      >
        {title}
      </Text>

      <Text
        size={12}
        height={23}
        lineHeight={25}
        style={[r.grayMid]} 
      >
        <Text>تعداد سفارشات: </Text>
        <Text bold>
          {count}
        </Text>
      </Text>

      <View style={[r.rtl]}>
        <Text
          size={12}
          height={23}
          lineHeight={25}
          style={[r.grayMid]} 
        >
          میزان رضایت مشتریان: 
        </Text>

        <View 
          style={[g.bgGreenLight, r.round5, r.rtl, r.center, 
            r.paddH5, r.leftM20, { height: 25 }
          ]}
        >
          <Text bold size={15} height={16} lineHeight={23} style={[r.white]}>
            {rate ? rate : '--'}
          </Text>
          <Icon name={'star-fill'} size={13} style={[r.white, r.rightM3]}/>
        </View>
      </View>

    </View>
  </View>
)

const EmptyMessage = () => (
  <View style={[r.bgGrayMid, r.round20, r.padd20, r.margin20]}>
    <Text bold size={14} style={[r.white, r.centerText]}>
      در حال حاضر اطلاعات رستوران موجود نمی باشد!
    </Text>
    <Text multiline size={12} style={[r.white, r.topM10, r.centerText]}>
    مدیر گرامی رستوران! به دلیل اینکه رستوران شما به تازگی در سامانه چیلیوری به ثبت رسیده است هنوز اطلاعات دقیقی از میزان فروش و جزئیات رستوران شما در دسترس نیست. به زودی این بخش به روز رسانی خواهد شد.
    </Text>
  </View>
)