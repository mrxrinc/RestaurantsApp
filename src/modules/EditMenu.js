import React, { Component } from 'react'
import { View, ScrollView, TextInput, KeyboardAvoidingView, FlatList, RefreshControl } from 'react-native'
import { connect } from 'react-redux'
import numeral from 'numeral'
// import { Crashlytics} from 'react-native-fabric'
import { View as AnimView } from 'react-native-animatable'
import IOS from './assets/platform'
import Image from './components/image'
import Modal from './components/modal'
import ModalView from './components/modalView'
import { navigatorStyle } from './assets'
import { Text, Icon } from './components/font'
import Button, { ButtonLight } from './components/button'
import Header from './components/header'
import Navbar from './components/navbar'
import Loading, { LoadingII } from './components/loading'
import Notification from './components/notification'
import Tabbar from './components/tabbar'
import EmptyList from './components/emptyList'
import * as r from './styles/rinc'
import * as g from './styles/general'
import API from './utils/service'
import analytics from '../constants/analytics'


class EditMenu extends Component {
  static options = () => navigatorStyle

  constructor(props) {
    super(props)
    this.state = {
      showDetailModal: false,
      foodDisable: {
        visible: false,
        status: null,
        name: ''
      },
      foodOptionData: {},
      query: '',
      searched: false
    }
    // Crashlytics.setUserName(this.props.state.user.result.session.user.fullName)
    // Crashlytics.setUserEmail(this.props.state.user.result.session.user.email)
    // Crashlytics.setUserIdentifier(`${this.props.state.user.result.session.user.id}`)
    // Crashlytics.setString('Screen', 'Menu')
    analytics.setCurrentScreen('ویرایش منو')
  }

  componentDidMount() {
    API.editMenu(this.props)
  }

  showDetail(item) {
    this.setState({
      // this is for sending pressed item's data to foodOptionStatus. I dont show these data in opened modal! 
      // remember! just for tracking the pressed item for using it on updating modal data after side dish actions 
      foodOptionData: item 
    }, () => {
      API.loadFoodOptions(this.props, item)
    })
  }

  menuItemStatus = (props, row) => {
    console.log(row)
    this.setState({
      foodDisable: {
        ...this.state.foodDisable,
        name: row.name,
        status: row.status
      },
      query: '',
      searched: false
    })
    API.unloadFoodOptions(this.props.dispatch)
    this.props.state.loadingII === false && API.menuItemStatus(props, row)
  }

  foodOptionStatus = (props, item) => {
    this.props.state.loadingII === false && API.foodOptionStatus(props, item, this.state.foodOptionData)
  }

  foodMenuSearch = () => {
    if(typeof this.state.query == 'string' && this.state.query.trim().length > 0){
      this.setState({ searched: true })
      API.foodMenuSearch(this.props, this.state.query)
    }
  }

  clearSearch = () => {
    this.setState({ searched: false, query: '' })
    API.foodMenuSearch(this.props, null)
  }
 
  render() {
    return (
      <KeyboardAvoidingView style={[r.full, g.bgPrimary]} behavior='padding'>
        <Navbar
          title={'ویرایش منو'}
          comments={this.props.state.comments && this.props.state.comments.result.pagination.total}
          {...this.props}
        />

        <View style={r.full}>
          {/* {this.props.state.loading && <Loading />} */}
          {this.props.state.editMenu && (
            <ScrollView 
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl 
                  refreshing={this.props.state.loading}
                  onRefresh={() => API.editMenu(this.props, false)} // 'false' is for pull to refresh
                />
              }
            >
              <Header style={[r.padd10]}>
                {/* <View style={[r.topM10]}>
                  <Text
                    style={[r.white, r.centerText]}
                    size={14}
                    lineHeight={28}
                    numberOfLines={10}
                  >
                    <Text>
                      در صورت نیاز به هرگونه تغییر در منوی رستوران با بخش پشتیبانی رستوران ها با شماره تلفن
                    </Text>
                    <Text style={[g.accent]}> 42091404-021 </Text>
                    <Text>و یا تلگرام</Text>
                    <Text style={[g.accent]}> 09210125772 </Text>
                    <Text>و یا ایمیل</Text>
                    <Text style={[g.accent]}> aftersales@chilivery.com </Text>
                    <Text>تماس بگیرید. همچنین می توانید از طریق قسمت</Text>
                    <Text style={[g.accent]}> تماس با پشتیبانی </Text>
                    <Text>اقدام به ارسال تیکت نمایید.</Text>
                  </Text>
                </View> */}

                <View style={[r.rtl, r.bgLight2, r.round10, r.paddH10, r.paddV15, r.marginV20, r.marginH10]}>
                  <View style={[r.vCenter, { width: 60 }]}>
                    <Icon
                      name={'clock'} 
                      size={50}
                      style={[r.grayMid, r.rightText]}
                    />
                  </View>
                  <View style={[r.full]}>
                    <Text 
                      style={[r.grayDark]}
                      size={11}
                      lineHeight={23}
                    >
                      <Text> امکان فعال یا غیر فعال کردن هر یک از غذاهای منو وجود دارد. </Text>
                      <Text bold>
                        توجه داشته باشید تمامی غذاهای غیرفعال شده توسط شما در
                      </Text>
                      <Text bold style={g.accent}> ساعت ۶ صبح روز بعد </Text>
                      <Text>به حالت فعال درخواهد آمد.</Text>
                    </Text>
                  </View>
                </View>
                
              </Header>

              <View style={[r.bgLight1, r.topM20, r.rtl, r.round30, r.marginH15, { height: 35 }]}>
                <TextInput 
                  style={[r.full, r.fa, r.padd0, r.rightText, r.paddH10, { paddingTop: IOS ? 7 : 3 }]}
                  placeholder={'جستجوی غذا داخل منو ...'}
                  value={this.state.query}
                  onChangeText={query => this.setState({ query })}
                  onSubmitEditing={this.state.searched ? this.clearSearch : this.foodMenuSearch}
                />
                <Button
                  style={[this.state.searched && r.bgRed, r.round30, r.center, { maxWidth: 35 }]}
                  androidStyle={[r.full, { maxWidth: 35 }]}
                  ripple={'#00044'}
                  expandableRipple
                  onPress={this.state.searched ? this.clearSearch : this.foodMenuSearch}
                >
                  <Icon 
                    name={this.state.searched ? 'remove' : 'zoom'} 
                    size={20} 
                    style={[this.state.searched ? r.white : r.grayLight]}
                  />
                </Button>
              </View>
              
              <View style={[r.topM20, r.paddH15]}>
                <FlatList
                  data={this.props.state.searchedFood ? 
                    this.props.state.searchedFood.result.menu : 
                    this.props.state.editMenu.result.menu
                  }
                  // extraData={this.props.state.searchedFood}
                  // initialNumToRender={1}
                  keyExtractor={item => item.tagName}
                  renderItem={({ item }) => (
                    <Section name={item.tagName}>
                      {item.foods.map(row => (
                        <MenuItem
                          key={row.id}
                          itemPress={() => row.hasOption ? this.showDetail(row) : null}
                          statusChange={() => this.menuItemStatus(this.props, row)}
                          parent={this.props}
                          {...row}
                        />
                      ))}
                    </Section>
                  )}
                />
                {this.props.state.searchedFood && (
                  <View style={[r.wFull, { height: 150 }]}>
                    <EmptyList />
                  </View>
                )}
              </View>
            </ScrollView>
          )}
        </View>

        <Tabbar 
          {...this.props}
          active = {'editMenu'}
          notificationCount = {null}
        />
        
        <Modal
          general
          animationIn={'slideInUp'}
          animationOut={'slideOutDown'}
          hideModalContentWhileAnimating
          style={[g.modal, { marginTop: this.props.state.foodOptions.hasOption ? 100 : 350 }]}
          show={this.props.state.foodOptions.visible}
          hide={() => API.unloadFoodOptions(this.props.dispatch)}
          onHide={() => this.setState({ foodOptionData: {} })} // we reset the stated data of tracking pressed item
        >
          <ModalView
            style={[r.full]}
            visible={this.props.state.foodOptions.visible}
          >
            <View style={[r.bgLight5, r.rtl, r.spaceBetween, r.hCenter, { height: 60 }]}>
              <Text size={16} height={24} lineHeight={25} style={[r.grayMid, r.rightM20]}>
                <Text size={13} bold >{this.props.state.foodOptions.name}</Text>
                {this.props.state.foodOptions.hasOption && (
                  <Text size={11}> + ساید دیش</Text>
                )}
              </Text>
              <Icon
                name={'remove'}
                size={25}
                style={[r.grayMid, r.centerText, { width: 60 }]}
                onPress={() => API.unloadFoodOptions(this.props.dispatch)}
              />
            </View>

            <ScrollView>
              <View>
                <DetailHeader title={'فعال / غیرفعال سازی غذای اصلی'} />
                <DetailItem
                  id={this.props.state.foodOptions.id}
                  name={this.props.state.foodOptions.name}
                  price={this.props.state.foodOptions.price}
                  status={this.props.state.foodOptions.status}
                  statusChange={() => this.menuItemStatus(this.props, this.props.state.foodOptions)}
                />

                {this.props.state.foodOptions.hasOption && this.props.state.foodOptions.options.map((group, index) => (
                  <View key={index}>
                    <DetailHeader title={group.groupName} />
                    {group.options.length && group.options.map((item, index) => (
                      <DetailItem
                        key={index}
                        id={item.foodOptionId}
                        name={item.foodOptionName}
                        price={item.foodOptionPrice}
                        status={item.foodOptionStatus}
                        statusChange={() => this.foodOptionStatus(this.props, item)}
                      />
                    ))}
                  </View>
                ))}

              </View>
            </ScrollView>
            {this.props.state.loadingII && <LoadingII size={'large'} color={'#acb9c6'}/>}
          </ModalView>
        </Modal>
       
        <Modal
          title={'غذا موقتا غیر فعال شد!'}
          show={this.state.foodDisable.visible}
          hideModalContentWhileAnimating
          hide={() => this.setState({ foodDisable:  { ...this.state.foodDisable, visible: false } })}
          onHide={() => this.setState({ foodDisable:  { ...this.state.foodDisable, name: '', status: null } })}
        >
          <Text>{this.state.foodDisable.name} </Text>
          <Text>موقتا تا ساعت ۶ صبح فردا غیر فعال شد.</Text>      
        </Modal>

        <Modal
          loading
          show={this.props.state.loadingII}
          style={[g.modal]}
          backdrop={0.1}
          onHide={() => {
            if(this.state.foodDisable.status === 1) {
              this.setState({ foodDisable: { ...this.state.foodDisable, visible: true } })
            }
          }}
        />

        <Notification />

      </KeyboardAvoidingView>
    )
  }
}

const mapStateToProps = state => ({ state })
const mapDispatchToProps = dispatch => ({ dispatch })
export default connect(mapStateToProps, mapDispatchToProps)(EditMenu)

const Section = ({ name, children }) => (
  <AnimView 
    style={[r.wFull, r.bgLight2, r.round15, r.shadow5, r.bottomM10, r.overhide]}
    animation={'fadeIn'}
    duration={200}
    useNativeDriver
  >

    <View style={[r.bgLight4, r.rightP15, r.vCenter, { height: 40 }]}>
      <Text
        bold
        size={14}
        height={26}
        lineHeight={28}
        style={[r.grayMid]}
      >
        {name}
      </Text>
    </View>
    <View style={[r.full, r.bgLight1]}>
      {children}
    </View>
  </AnimView>
)

const MenuItem = props => (
  <View style={[r.full, r.rtl, { height: 100 }]}>
    <ButtonLight
      style={[r.full, r.rtl]}
      activeOpacity={0.7}
      onPress={props.itemPress}
    >
      <View style={[r.center, { width: 90 }]}>
        <Image 
          uri={props.pic}
          style={[r.round10, r.bgLight4, { width: 80, height: 60 }]}
          resizeMode={'cover'}
        />
      </View>

      <View style={[r.vCenter, r.full]}>
        <Text style={[r.grayDark]} numberOfLines={2}>
          <Text size={13} bold >{props.name}</Text>
          {props.hasOption && (
            <Text size={11} style={[r.grayMid]}> + ساید دیش</Text>
          )}
        </Text>
        <Text style={[r.grayMid]}>
          (
            <Text size={13} > {numeral(props.price).format('0,0')}</Text>
            <Text size={11} style={[r.grayMid]}> تومان </Text>
          )
        </Text>
        {props.description !== null && props.description !== '' && (
          <Text size={11} style={[r.grayMid, r.full, { maxHeight: 17 }]} numberOfLines={1}>
            {props.description}
          </Text>
        )}
      </View>
    </ButtonLight>

    <View style={[r.center, { width: 90 }]}>
      <ButtonLight
        style={[r.center, r.round15, { width: '85%', height: 30 }, props.status === 2 ? g.bgGreen : r.bgRed]}
        onPress={props.statusChange}
      >
        <Text bold size={11} height={15} lineHeight={17} style={[r.white]}>
          {props.status === 2 ? 'فعال کن' : 'غیرفعال کن'}
        </Text>
      </ButtonLight>
    </View>

    <View style={[r.absolute, r.bottom, r.wFull, r.hCenter]}>
      <View style={[g.line, r.w95]} />
    </View>
  </View>
)

const DetailHeader = ({ title }) => (
  <View style={[r.bgLight3, g.menuModalGroupHeader]}>
    <Text size={14} style={[r.grayLight]}>
      {title}
    </Text>
  </View>
)

const DetailItem = props => (
  <View style={[r.rtl, { height: 60 }]}>
    <View style={[r.full, r.vCenter, r.rightP15]}>
      <Text style={[r.grayMid]}>
        <Text size={14} bold>{props.name}   </Text>
        <Text size={11} style={[r.grayLight]}> 
          ({numeral(props.price).format('0,0')} تومان)
        </Text>
      </Text>
    </View>
    <View style={[r.center, { width: 120 }]}>
      <ButtonLight
        style={[r.center, r.round15, { width: '85%', height: 30 }, props.status === 2 ? g.bgGreen : r.bgRed]}
        onPress={props.statusChange}
      >
        <Text bold size={11} height={15} lineHeight={17} style={[r.white]}>
          {props.status === 2 ? 'فعال کن' : 'غیرفعال کن'}
        </Text>
      </ButtonLight>
    </View>
  </View>
)






{/* <SectionList 
  sections={this.props.editMenu.result.menu.map(item => ({
    title: item.tagName,
    data: item.foods
  }))}
  keyExtractor={item => item.tagName}
  renderItem={({ item, index, section }) => (
    <MenuItem 
      key={item.id}
      name={item.name}
    />
  )}
  renderSectionHeader={({ section: { title }}) => (
    <View style={[r.bgLight4, r.rightP15, r.vCenter, { height: 40 }]}>
      <Text
        bold
        size={14}
        height={23}
        lineHeight={28}
        style={[r.grayMid]}
      >
        {title}
      </Text>
    </View>
  )}
/> */}