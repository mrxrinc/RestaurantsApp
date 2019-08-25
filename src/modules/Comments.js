import React, { Component } from 'react'
import { View, ScrollView, FlatList, RefreshControl } from 'react-native'
import { connect } from 'react-redux'
// import { Crashlytics} from 'react-native-fabric'
import Image from './components/image'
import Input from './components/input'
import Modal from './components/modal'
import ModalView from './components/modalView'
import * as asset from './assets'
import { Text, Icon } from './components/font'
import Button, { ButtonLight } from './components/button'
import Header from './components/header'
import Navbar from './components/navbar'
import Tabbar from './components/tabbar'
import Loading, { LoadingII } from './components/loading'
import ListFooter from './components/listFooter'
import API from './utils/service'
import * as r from './styles/rinc'
import * as g from './styles/general'
// import analytics from '../constants/analytics'


class Comments extends Component {
  static navigatorStyle = asset.navigatorStyle

  constructor(props) {
    super(props)
    this.state = {
      showNotification: false,
    }
    // Crashlytics.setUserName(this.props.state.user.result.session.user.fullName)
    // Crashlytics.setUserEmail(this.props.state.user.result.session.user.email)
    // Crashlytics.setUserIdentifier(`${this.props.state.user.result.session.user.id}`)
    // Crashlytics.setString('Screen', 'Comments')
  }

  componentDidMount() {
    API.comments(this.props)
  }

  reply = () => {
    const { commentId, voteId, message } = this.props.state.reply
    API.loadReplyData(this.props, {
      commentId,
      voteId,
      message
    })
    API.reply(this.props)
  }

  storeReplyData = data => {
    API.loadReplyData(this.props, data)
  } 

  emptyReplyData = () => {
    API.unloadReplyData(this.props.dispatch)
  }

  loadMore = () => {
    API.comments(this.props, true) // second arg is for pagination
  }

  report = commentId => {
    this.setState({ showNotification: true })
    API.reportComment(this.props, commentId)
  }

  handleVote = (num = null, color = false) => {
    switch(num) {
      case 1:
        return color ? '#E41D35' : 'upset'
      case 2:
        return color ? '#ffcc01' : 'speechless'
      case 3:
        return color ? '#1CBD2E' : 'smile'
      default:
        return color ? '#A6BCC7' : 'speechless'
    }
  }

  render() {
    // analytics.setCurrentScreen('دیدگاه کاربران')
    return (
      <View style={[r.full, g.bgPrimary]}>
        <Navbar
          {...this.props}
          title={'نظرات کاربران'}
          back
        />

        <View style={r.full}>
          {this.props.state.loading && !this.props.state.comments &&  <Loading />}
          {this.props.state.comments && (
            <View
              style={r.full}
              animation={'fadeIn'}
              duration={300}
              delay={200}
              useNativeDriver
            >

              <ScrollView 
                showsVerticalScrollIndicator={false}
                refreshControl={
                  <RefreshControl 
                    refreshing={this.props.state.loading}
                    onRefresh={() => API.comments(this.props, false, true)} // false is for pagination, 'true' is for pull to refresh
                  />
                }
              >
                <Header style={[r.paddV30, r.paddH30]}>
                  <Text size={14} lineHeight={28} style={[r.light5, r.centerText, r.bottomM10]} numberOfLine={5}>
                    به هر یک از نظرات کاربران می توانید پاسخ داده و یا در صورت لزوم آن را گزارش دهید تا توسط پشتیبانی چیلیوری بررسی شود.
                  </Text>
                </Header>

                <View style={[r.paddH15, r.topP30]}>
                  <FlatList
                    data={this.props.state.comments.result.comments}
                    keyExtractor={item => `${item.id}`}
                    initialNumToRender={5}
                    ListFooterComponent={() => (
                      <ListFooter 
                        items={this.props.state.comments.result.comments} 
                        loading={this.props.state.loading}
                        onPress={this.loadMore} 
                      />
                    )}
                    renderItem={({ item }) => (
                      <View 
                        style={[g.commentsItem, r.bgLight2, r.round15, r.wFull, r.bottomM20, r.overhide]}
                        animation={'fadeIn'}
                        duration={150}
                        delay={50}
                        useNativeDriver
                      >
                        <View style={[r.padd10]}>
                          <View style={[r.wFull, r.rtl, r.spaceBetween]}>
                            <View style={[r.full, r.rtl, r.hCenter, r.overhide]}>
                              <Text bold size={16} style={[r.grayDark]} numberOfLine={1}>
                                {item.username}
                              </Text>
                              <Text size={12} style={[r.grayLight, r.rightM10]}>{item.date}</Text>
                            </View>
                            <View style={[{ width: 35 }]}>
                              <Icon
                                name={this.handleVote(item.vote.overall)}
                                color={this.handleVote(item.vote.overall, true)}
                                size={25}
                              />
                            </View>
                          </View>

                          <Text size={14} style={[r.grayDark, r.rtlText, r.topM10]}>{item.commentText}</Text>
                          
                          <View style={[r.rtl, r.topM15, { height: 45 }]}>
                            {item.vote && item.vote.foodQuality && (
                              <VoteItem
                                text={'کیفیت غذا'}
                                icon={this.handleVote(item.vote.foodQuality)} 
                                color={this.handleVote(item.vote.foodQuality, true)}
                              />
                            )}
                            {item.vote && item.vote.deliverySpeed && (
                              <VoteItem
                                text={'سرعت ارسال'}
                                icon={this.handleVote(item.vote.deliverySpeed)} 
                                color={this.handleVote(item.vote.deliverySpeed, true)}
                              />
                            )}
                            {/* {item.vote && item.vote.buyExperience && (
                              <VoteItem
                                text={'تجربه خرید'}
                                icon={this.handleVote(item.vote.buyExperience)} 
                                color={this.handleVote(item.vote.buyExperience, true)}
                              />
                            )} */}
                          </View>

                          <View style={[r.row, r.hCenter, { height: 40 }]}>
                            <ButtonLight
                              style={[r.row, r.hCenter, r.paddH10]}
                              onPress={() => item.reported ? null : this.report(item.id)}
                            >
                              <Text size={10} height={18} lineHeight={22} style={item.reported ? g.red : r.grayLight}>
                                {item.reported ? 'گزارش داده شده' : 'گزارش'}
                              </Text>
                              <Icon name={'alert'} size={14} style={[item.reported ? g.red : r.grayLight, r.leftM3]}/>
                            </ButtonLight>
                            {item.replies.length !== null && item.replies.length === 0 && (
                              <ButtonLight
                                style={[r.center, r.paddH20, r.round20, r.leftM20, { 
                                  height: 27, borderWidth: 1, borderColor: '#345'
                                }]}
                                onPress={() => {
                                  this.storeReplyData({
                                    commentId: item.id,
                                    voteId: item.vote.id
                                  })}
                                }
                              >
                                <Text size={12} height={16} lineHeight={19} style={[r.grayDark]}>پاسخ</Text>
                              </ButtonLight>
                            )}
                          </View>
                        </View>

                        <View 
                          style={[r.wFull, r.paddV5, g.commentsFoodRow, {
                            borderBottomWidth: item.replies.length > 0 ? 0.6 : 0
                          }]}
                        >
                          <FlatList
                            data={item.foods}
                            horizontal
                            inverted
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={[r.paddH10]}
                            keyExtractor={item => `${Math.random()}_${item.foodId}`}
                            renderItem={({ item }) => (
                              <View style={[r.leftM5, r.paddH10, r.center, g.commentsFoodRowItem, {
                                borderColor: this.handleVote(item.foodQuality, true)
                              }]}>
                                <Text size={11} style={[r.grayMid]}>{item.foodName}</Text>
                              </View>
                            )} 
                          />
                        </View>

                        {item.replies.length > 0 && this.props.state.home && (
                          <View style={[r.padd5, r.topP10, r.rtl]}>
                            <View style={[r.hCenter, { width: 60 }]}>
                              <Image 
                                uri={this.props.state.home.result.logo}
                                style={[r.round10, { width: 50, height: 50, borderColor:'#ccc', borderWidth: 0.5 }]}
                                resizeMode={'cover'}
                              />
                            </View>
                            <View style={[r.bgLight4, r.round15, r.full, r.padd10, g.commentsItem]}>
                              <Text bold size={15} style={[r.grayDark, r.rightText, r.rtlText]}>
                                {this.props.state.home.result.name}
                              </Text>
                              <Text size={10} style={[r.grayMid, r.rightText, r.rtlText]}>
                                {item.replies[0].date}
                              </Text>
                              <Text 
                                size={11} 
                                style={[r.grayDark, r.rightText, r.rtlText, r.topM10]} 
                                numberOfLine={20}
                              >
                                {item.replies[0].text}
                              </Text>
                            </View>
                          </View>
                        )}

                      </View>
                    )}
                  />
                </View>

              </ScrollView>

            </View>
          )}
        </View>

        <Tabbar 
          {...this.props}
          active = {''}
          notificationCount = {null}  // this must be null if we dont have count
        />
        
        <Modal
          general
          bottomAlign
          animationIn={'slideInUp'}
          animationOut={'slideOutDown'}
          avoidKeyboard
          style={[{ margin: 0, justifyContent: 'flex-end' }]} // modal problem fixed in ios
          show={this.props.state.reply.visible}
          hide={this.emptyReplyData}
          >
          <ModalView
            style={[{ height: 300 }, !IOS && { marginTop: asset.window.height - 300 }]} // same problem fixed in android
            visible={this.props.state.reply.visible}
          >
            <View style={[r.bgLight5, r.rtl, r.spaceBetween, r.hCenter, { height: 60 }]}>
              <Text bold size={16} height={20} lineHeight={25} style={[r.grayMid, r.rightM20]}>
                پاسخ به نظر مشتری
              </Text>
              <Icon
                name={'remove'} 
                size={25}
                style={[r.grayMid, r.centerText, { width: 60 }]}
                onPress={this.emptyReplyData}
              />
            </View>
            <ScrollView 
              contentContainerStyle={[r.topP30, r.full, r.paddH20]}
              keyboardShouldPersistTaps={'always'}
              keyboardDismissMode={'on-drag'}
            >
              <Input 
                bold
                icon={'message'}
                label={'پاسخ'}
                returnKeyType={'send'}
                textColor={'#4C6674'}
                baseColor={'#32434C'}
                tintColor={'#D68E43'}
                style={[r.bottomM40]}
                fieldStyle={[r.rightText, r.paddH10]}
                value={this.state.message}
                onChangeText={message => this.storeReplyData({ message })}
                onSubmitEditing={this.reply}
              />

              <Button
                style={[g.bgGreen, r.round30, r.center, { maxHeight: 50 }]}
                androidStyle={[r.round30, { height: 50 }]}
                ripple={'#ffffff44'}
                onPress={this.reply}
              >
                {this.props.state.loadingII ? (
                  <LoadingII />
                ) : (
                  <Text size={18} height={19} lineHeight={26} style={[r.white]}>ثبت</Text>
                )}
              </Button>
            </ScrollView>
          </ModalView>
        </Modal>

        <Modal
          title={'گزارش شد!'}
          show={this.state.showNotification}
          hide={() => this.setState({ showNotification: false })}
        >
          <Text size={15} style={[r.grayMid, r.centerText, r.rtlText]}>
            به زودی پشتیبانی چیلیوری بررسی خواهد کرد.
          </Text>       
        </Modal>

      </View>
    )
  }
}

const mapStateToProps = state => ({ state })
const mapDispatchToProps = dispatch => ({ dispatch })
export default connect(mapStateToProps, mapDispatchToProps)(Comments)

const VoteItem = props => (
  <Text style={[r.leftM15]}>
    <Text size={12} style={[r.grayMid]}>{props.text} </Text>
    <Icon
      name={props.icon}
      color={props.color}
      size={16}
    />
  </Text>
)