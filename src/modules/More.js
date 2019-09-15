import React, { Component } from 'react'
import { View, ScrollView, Linking } from 'react-native'
import { connect } from 'react-redux'
import { Navigation } from 'react-native-navigation'
// import { Crashlytics} from 'react-native-fabric'
import ActionModal from './components/actionModal'
// import Image from './components/image'
import { navigatorStyle } from './assets'
import { Text, Icon } from './components/font'
import Header from './components/header'
import { ButtonLight } from './components/button'
import { LoadingII } from './components/loading'
import Navbar from './components/navbar'
import Tabbar from './components/tabbar'
import * as r from './styles/rinc'
import * as g from './styles/general'
import API from './utils/service'
import analytics from '../constants/analytics'
import FlashMessage from 'react-native-flash-message'


class More extends Component {
  static options = () => navigatorStyle
  constructor(props) {
    super(props)
    this.state = {
      showContactModal: false,
      showLogoutModal: false,
      phoneNumberMenu: '02142091404',
      phoneNumberDeliveryZones: '02142091408',
      phoneNumberTrade: '02142091409',
      phoneNumberComments: '02142091410',
      phoneNumberMotochili: '02142091470',
      link: 'https://t.me/chilivery_menu'
    }
    // Crashlytics.setUserName(this.props.state.user.result.session.user.fullName)
    // Crashlytics.setUserEmail(this.props.state.user.result.session.user.email)
    // Crashlytics.setUserIdentifier(`${this.props.state.user.result.session.user.id}`)
    // Crashlytics.setString('Screen', 'More')
    analytics.setCurrentScreen('بیشتر...')
  }

  callPhoneMenu = () => {
    Linking.openURL(`tel:${this.state.phoneNumberMenu}`)
  }
  callPhoneDeliveryZones = () => {
    Linking.openURL(`tel:${this.state.phoneNumberDeliveryZones}`)
  }
  callPhoneTrade = () => {
    Linking.openURL(`tel:${this.state.phoneNumberTrade}`)
  }
  callPhoneComments = () => {
    Linking.openURL(`tel:${this.state.phoneNumberComments}`)
  }
  callMotochili = () => {
    Linking.openURL(`tel:${this.state.phoneNumberMotochili}`)
  }

  callTelegram = () => {
    Linking.openURL(this.state.link)
  }

  logout = () => {
    this.setState({ showContactModal: false })
    API.logout(this.props)
  }

  render() {
    return (
      <View style={[r.full, g.bgPrimary]}>
        <Navbar
          title={'بیشتر...'}
          comments={this.props.state.comments && this.props.state.comments.result.pagination.total}
          {...this.props}
        />

        <ScrollView showsVerticalScrollIndicator={false}>
          {this.props.state.user && ( //this is nedded for safety after login!
            <Header style={[r.hCenter]}>
              <View style={[r.topM30, r.center, { 
                width: 100, height: 100, borderRadius: 50, backgroundColor: '#ffffff11'
                }]}
              >
                {/* <Image
                  uri={this.props.state.user.result.session.user.avatar}
                  style={[r.round15, ]}
                  resizeMode={'cover'}
                /> */}
                <Icon name={'person'} size={50} style={[g.lightText]} />
              </View>
              <View style={[r.center, ]}>
                <Text bold size={17} style={[r.white, r.topM10]}>
                  {this.props.state.user.result.session.user.fullName}
                </Text>
                <Text size={13} style={[r.white, r.topM5]}>
                  {this.props.state.user.result.session.user.email}
                </Text>
                <Text size={13} style={[r.white, r.topM3]}>
                  {this.props.state.user.result.session.user.mobileNumber}
                </Text>
              </View>
            </Header>
          )}

          <View>
            <RowItem 
              icon={'store'}
              title={'انتخاب رستوران / شعبه'}
              onPress={() => {
                Navigation.push(this.props.componentId, { 
                  component: {
                    name: 'Dashboard',
                    passProps: { hasBack: true },
                    options: { animations: { push: { enabled: false, waitForRender: true } } } 
                  } 
                })
              }}
            />
            {/* <RowItem 
              icon={'money'}
              title={'حسابداری'}
              onPress={() => null}
            /> */}
            <RowItem 
              icon={'pins'}
              title={'محدوده سرویس دهی'}
              onPress={() => {
                Navigation.push(this.props.componentId, { 
                  component: {
                    name: 'DeliveryZone',
                    options: { animations: { push: { enabled: false, waitForRender: true } } } 
                  } 
                })
              }}
            />
            <RowItem 
              icon={'phone'}
              title={'تماس با پشتیبانی چیلیوری'}
              onPress={() => this.setState({ showContactModal: true })}
            />
            {/* <RowItem 
              icon={'chat'}
              title={'صندوق پیام ها (تیکت)'}
              notificationCount={2}
              onPress={() => null}
            /> */}
            {/* <RowItem 
              icon={'restaurant'}
              title={'ارسال عکس منو غذا'}
              onPress={() => null}
            /> */}
            {/* <RowItem 
              icon={'bell'}
              title={'اعلان ها'}
              notificationCount={1}
              onPress={() => null}
            /> */}
            <RowItem 
              icon={'info'}
              title={'اطلاعات رستوران'}
              onPress={() => {
                Navigation.push(this.props.componentId, { 
                  component: {
                    name: 'RestaurantDetail',
                    options: { animations: { push: { enabled: false, waitForRender: true } } } 
                  } 
                })
              }}
            />
            <RowItem 
              icon={'logout'}
              title={'خروج'}
              onPress={() => this.setState({ showLogoutModal: true })}
            />
          </View>
        
        </ScrollView>

        <Tabbar 
          {...this.props}
          active = {'more'}
          notificationCount = {null}  // this must be null if we dont have count
        />

        <ActionModal
          visible={this.state.showContactModal}
          title={'تماس با پشتیبانی چیلیوری'}
          icon={'phone'}
          height={360}
          hide={() => this.setState({ showContactModal: false })}
        >
          <ButtonLight
            style={[r.rightP20, r.vCenter, { 
              height: 50, 
              borderColor: '#d4d7da', 
              borderBottomWidth: 0.5 
            }]}
            onPress={this.callPhoneMenu}
          >
            <Text size={14} style={[r.grayMid]}>منوی رستوران</Text>
          </ButtonLight>

          <ButtonLight
            style={[r.rightP20, r.vCenter, { 
              height: 50, 
              borderColor: '#d4d7da', 
              borderBottomWidth: 0.5 
            }]}
            onPress={this.callPhoneDeliveryZones}
          >
            <Text size={14} style={[r.grayMid]}>محدوده های دسترسی</Text>
          </ButtonLight>

          <ButtonLight
            style={[r.rightP20, r.vCenter, { 
              height: 50, 
              borderColor: '#d4d7da', 
              borderBottomWidth: 0.5 
            }]}
            onPress={this.callPhoneTrade}
          >
            <Text size={14} style={[r.grayMid]}>امور مالی</Text>
          </ButtonLight>

          <ButtonLight
            style={[r.rightP20, r.vCenter, { 
              height: 50, 
              borderColor: '#d4d7da', 
              borderBottomWidth: 0.5 
            }]}
            onPress={this.callPhoneComments}
          >
            <Text size={14} style={[r.grayMid]}>نظرات مشتریان</Text>
          </ButtonLight>

          <ButtonLight
            style={[r.rightP20, r.vCenter, { 
              height: 50, 
              borderColor: '#d4d7da', 
              borderBottomWidth: 0.5 
            }]}
            onPress={this.callMotochili}
          >
            <Text size={14} style={[r.grayMid]}>موتوچیلی</Text>
          </ButtonLight>

          <ButtonLight
            style={[r.rightP20, r.vCenter, { height: 50 }]}
            onPress={this.callTelegram}
          >
            <Text size={14} style={[r.grayMid]}>ارسال پیام در تلگرام</Text>
          </ButtonLight>
        </ActionModal>


        <ActionModal
          visible={this.state.showLogoutModal}
          title={'خروج از چیلیوری'}
          hide={() => this.setState({ showLogoutModal: false })}
        >
          <Text style={[r.centerText, r.marginV20, r.grayMid]}>
            آیا مطمئن هستید؟
          </Text>
          <View style={[r.rtl, { height: 50, borderColor: '#d4d7da', borderTopWidth: 0.5 }]}
          >
            {this.props.state.loadingII ? (
              <LoadingII color={'#A6BCC7'}/>
            ) : (
              <ButtonLight
                style={[r.full, r.center, { borderColor: '#d4d7da', borderLeftWidth: 0.5 }]}
                onPress={this.logout}
              >
                <Text size={14} height={18} lineHeight={21} style={[r.grayMid]}>بله</Text>
              </ButtonLight>
            )}
            <ButtonLight
              style={[r.full, r.center]}
              onPress={() => this.setState({ showLogoutModal: false })}
            >
              <Text size={14} height={18} lineHeight={21} style={[r.grayMid]}>خیر</Text>
            </ButtonLight>
          </View>
        </ActionModal>
          
        <FlashMessage position="top" style={[r.rtl]} />
      </View>
    )
  }
}

const mapStateToProps = state => ({ state })
const mapDispatchToProps = dispatch => ({ dispatch })
export default connect(mapStateToProps, mapDispatchToProps)(More)


const RowItem = (props) => (
  <Button
    style={[r.rtl, r.spaceBetween, g.moreRowItem]}
    ripple={'#ffffff0b'}
    onPress={props.onPress}
  >
    <View style={[r.rtl, r.hCenter, r.paddH20]}>
      <Icon 
        name={props.icon}
        size={28}
        style={[r.light1, r.leftM10]}
      />
      <Text size={13} height={17} lineHeight={20} style={[r.white, r.rightText, r.topM5]}>
        {props.title}        
      </Text>
    </View>
    <View style={[r.row, r.hCenter, r.leftP10]}>
      <Icon 
        name={'left'}
        size={30}
        style={[r.white]}
      />
      {props.notificationCount && (
        <View 
          style={[g.bgRedLight, r.round20, r.center, {
            minWidth: 20, height: 20 }
          ]}
        >
          <Text
            size={12}
            height={14}
            lineHeight={19}
            includefontPadding={false}
            style={[r.centerText, r.white, r.paddH5]}
          >
            {props.notificationCount}
          </Text>
        </View>
      )}
    </View>
  </Button>
)