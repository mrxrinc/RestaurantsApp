import React from 'react'
import { AsyncStorage } from 'react-native'
import axios from 'axios'
import { checkInternetConnection } from 'react-native-offline'
import { Navigation } from 'react-native-navigation'
import { showMessage, hideMessage } from "react-native-flash-message"
import Push from '../components/push'
// import RNExitApp from 'react-native-exit-app'
import * as api from '../../constants/api'
import * as util from './index'
import * as action from '../../actions'

// Global axios Variables
axios.defaults.baseURL = api.URL
axios.defaults.headers.common.Authorization = api.Auth
axios.defaults.headers.post['Content-Type'] = api.ContentType


class LocalToken {
  setData = data => {
    AsyncStorage.setItem('token', data)
  } 
  getData = async () => {
    const data = await AsyncStorage.getItem('token')
    return data
  }
  clearData = () => {
    try {
      AsyncStorage.removeItem('token', () => {
        // RNExitApp.exitApp()
        console.log('token removed after successfull logout!')
      })
    }
    catch(err) {
      console.log('error on deleting token from local storage', err)
    }
  }

  setChosenRestaurant = data => {
    AsyncStorage.setItem('chosenRestaurant', data)
  }
  getChosenRestaurant = async () => {
    const data = await AsyncStorage.getItem('chosenRestaurant')
    return data
  }
  clearChosenRestaurant = () => {
    try {
      AsyncStorage.removeItem('chosenRestaurant', () => {
        console.log('chosenRestaurant has been removed!')
      })
    }
    catch(err) {
      console.log('error on deleting chosenRestaurant from local storage', err)
    }
  }
}

class API { //exported to use in loginOTP page

  localDB = new LocalToken

  versionControl = props => {
    const { dispatch } = props
    dispatch(action.loadingStart())
    checkInternetConnection()
    .then(isConnected => {
      if(isConnected) {
        axios({
          method: 'post',
          url: 'general/appInit',
          timeout: 5000,
          data: {
            platform: api.INIT.platform,
            build: api.INIT.build,
            device_id: api.INIT.device_id,
            device: api.INIT.device,
            c_version: api.INIT.c_version
          }
        })
        .then(resp => {
          console.log(resp.data)
          util.handleOffline(props, true)
          dispatch(action.loadingEnd())
          if(resp.data.status) {
            console.log('VERSION CONTROL STATUS TRUE ', resp.data)
            const remoteData = resp.data.result.update || null
            const isNormal = remoteData.currentVersion > api.Version
            const isForce = remoteData.minimumVersion > api.Version
            let data = {
              title: remoteData.title,
              description: remoteData.description,
              link: remoteData.link,
              forceUpdate: isForce ? true :false
            }
            dispatch(action.update(data))
            if(isForce || isNormal) {
              Navigation.setStackRoot(props.componentId, [{ component: { name: 'Update' } }])
            } else {
              this.appInit(props)
            }
          } else {
            console.log('VERSION CONTROL STATUS FALSE')
            this.showPush({
              message: resp.data.message_fa,
              status: 'danger',
              timer: 3
            })
          }
        })
        .catch(err => {
          dispatch(action.loadingEnd())
          util.handleOffline(props, true)
          dispatch(action.storeUser(null))
          this.localDB.clearData()
          this.localDB.clearChosenRestaurant()
          Navigation.setStackRoot(props.componentId, [{ component: { name: 'LoginOTP' } }])

          console.log('VERSION CONTROL CATCH ERROR', err)
        })
      } else {
        console.log('IS_CONNECTED IS FALSE')
        Navigation.setStackRoot(props.componentId, [{ component: { name: 'Offline' } }])
      }
    })
    .catch(err => {
      console.log('CHECK_INTERNET_CONNECTION CATCH ERROR ', err)
      util.handleOffline(props, true)
    })
  }

  appInit = async props => {
    const { dispatch } = props
    try {
      dispatch(action.loadingStart())
      this.localDB.getData()
      .then( localToken => {
        if (localToken === null) {
          axios({
            method: 'post',
            url: 'general/appInit',
            data: {
              platform: api.INIT.platform,
              build: api.INIT.build,
              device_id: api.INIT.device_id,
              device: api.INIT.device,
              c_version: api.INIT.c_version
            }
          })
          .then( resp => {
            if (resp.data.status) {
              const firstToken = resp.data.result.session.token
              console.log('FRESH USER. FIRST TOKEN ===> ', firstToken)
              dispatch(action.loadingEnd())
              Navigation.setStackRoot(props.componentId, [{ component: { name: 'LoginOTP', passProps: { firstToken } } }])
            } else {
              console.log('INIT STATUS FALSE ===> ', resp.data)
              dispatch(action.loadingEnd())
              this.showPush({
                message: resp.data.message_fa,
                status: 'danger',
                timer: 3
              })
            }
          })
          .catch(err => {
            console.log('ERROR APP INIT REQUEST ===> ', err)
            dispatch(action.loadingEnd())
            util.handleOffline(props, true)
            this.showPush({
              message: 'مشکلی برای اپلیکیشن پیش آمد. لطفا با پشتیبانی تماس بگیرید!',
              status: 'danger',
              timer: 3
            })
          })
        } else {
          console.log('LOCAL TOKEN ===> ', localToken)
          axios.defaults.headers.common['token'] = localToken
          axios({
            method: 'get',
            url: 'user/current'
          })
            .then(resp => {
              if (resp.data.status) {
                console.log('WE GOT USER DETAIL ===> ', resp.data.message_fa, resp.data)
                const newData = { // coz the stupid backend treats differently on login and getCurrentUser :(
                  status: resp.data.status,
                  message_fa: resp.data.message_fa,
                  result: {
                    session: {
                      token: localToken,
                      user: resp.data.result.user
                    }
                  }
                }
                dispatch(action.loadingEnd())
                dispatch(action.storeUser(newData))
                Navigation.push(props.componentId, { component : { name: 'Dashboard' } })
              } else {
                console.log('CURRENT USER DETAIL STATUS FALSE ===> ', resp.data)
                dispatch(action.loadingEnd())
                this.localDB.clearData() // in case of broken local data
                // util.toErrorPage(1011, props)
                Navigation.setStackRoot(props.componentId, [{ component: { name: 'Login' } }])
              }
            })
            .catch(err => {
              console.log('FAIL ON GETTING USER DETAIL REQUEST ===> ', err)
              dispatch(action.loadingEnd())
              // dont clear local token here, coz if its broken we will get status false as we removing it there.
              util.toErrorPage(1028, props)
            })
        }
      })
      .catch(err => {
        console.log('ERROR ON GETTING LOCAL TOKEN: ===> ', err)
        dispatch(action.loadingEnd())
        this.localDB.clearData() // in case of broken local data
        alert('متاسفانه برای اپلیکیشن مشکلی پیش آمده است. لطفا از برنامه خارج شوید و دوباره آنرا باز نمایید!')
      })
    }
    catch(err) {
      console.log('ERROR ON APPINIT TRY_CATCH!', err)
      dispatch(action.loadingEnd())
      util.toErrorPage(1012, props)
    }
  }

  login = (props, data) => {
    console.log('LOGIN INPUT DATA ==> ', data)
    const { username, password, firstToken } = data
    const { dispatch } = props
    if(!props.state.loading) { // preventing double tap while one request is on progress!
      dispatch(action.loadingStart())
      if(username.trim().length === 0) {
        dispatch(action.loadingEnd())
        this.showNotification({
          title: 'خطا!',
          message: 'لطفا ایمیل یا نام کاربری خود را وارد کنید!',
          type: 'alarm'
        }, dispatch)
      } else if (password.trim().length === 0) {
        dispatch(action.loadingEnd())
        this.showNotification({
          title: 'خطا!',
          message: 'لطفا رمز عبور خود را وارد کنید!',
          type: 'alarm'
        }, dispatch)
      } else {
        axios({
          method: 'post',
          url: 'user/login',
          data: {
            username,
            password,
            platform: api.INIT.platform,
            build: api.INIT.build,
            device_id: api.INIT.device_id,
            device: api.INIT.device
          },
          headers: { token: firstToken }
        })
        .then(resp => {
          if(resp.data.status) {
            console.log('LOGIN STATUS TRUE ===> ', resp.data)
            dispatch(action.loadingEnd())
            dispatch(action.storeUser(resp.data))
            this.localDB.setData(resp.data.result.session.token)
            axios.defaults.headers.common['token'] = resp.data.result.session.token
            Navigation.setStackRoot(props.componentId, [{ component: { name: 'Dashboard' } }])
            console.log('TOKEN SAVED TO LOCAL') 
          } else {
            console.log('LOGIN STATUS FALSE ===> ', resp)
            dispatch(action.loadingEnd())
            this.showNotification({
              title: 'خطا!',
              message: `${resp.data.message_fa}! yo from login`,
              type: 'error'
            }, dispatch)
          }
        })
        .catch(err => {
          console.log('LOGIN REQUEST ERROR ===> ', err)
          dispatch(action.loadingEnd())
          util.handleOffline(props, true)
          this.showNotification({
            title: 'خطا!',
            message: 'مشکلی در درخواست ورود پیش آمد! لطفا مجددا تلاش کنید.',
            type: 'error'
          }, dispatch)
        })
      }
    }
  }

  loginOtp = (props, data) => {
    console.log('OTP INPUT DATA ==> ', data)
    const { recipient, secret, otp } = data
    const { dispatch } = props
    if(!props.state.loading) { // preventing double tap while one request is on progress!
      dispatch(action.loadingStart())
      if(otp.trim().length === 0) {
        dispatch(action.loadingEnd())
        this.showNotification({
          title: 'خطا!',
          message: 'لطفا شماره موبایل خود را وارد کنید!',
          type: 'alarm'
        }, dispatch)
      } else {
        axios({
          method: 'post',
          url: api.OTP_URL + 'otp/verify',
          data: {
            recipient,
            otp,
            secret,
            platform: api.INIT.platform,
            build: api.INIT.build,
            device_id: api.INIT.device_id,
            deviceId: api.INIT.device_id,
            device: api.INIT.device
          }
        })
        .then(resp => {
          if(resp.data.status) {
            console.log('OTP REQUEST STATUS TRUE ===> ', resp.data)
            dispatch(action.loadingEnd())
            dispatch(action.storeUser(resp.data))
            this.localDB.setData(resp.data.result.session.token)
            axios.defaults.headers.common['token'] = resp.data.result.session.token
            Navigation.setStackRoot(props.componentId, [{ component: { name: 'Dashboard' } }])
            console.log('TOKEN SAVED TO LOCAL') 
          } else {
            console.log('OTP REQUEST STATUS FALSE ===> ', resp)
            dispatch(action.loadingEnd())
            this.showNotification({
              title: 'خطا!',
              message: `${resp.data.message_fa}!yo inside services`,
              type: 'error'
            }, dispatch)
          }
          return resp.data
        })
        .catch(err => {
          console.log('OTP REQUEST ERROR ===> ', err)
          dispatch(action.loadingEnd())
          util.handleOffline(props, true)
          this.showNotification({
            title: 'خطا!',
            message: 'مشکلی در درخواست ورود پیش آمد! لطفا مجددا تلاش کنید.',
            type: 'error'
          }, dispatch)
          return err
        })
      }
    }
  }

  logout = props => {
    const { dispatch } = props
    dispatch(action.loadingIIStart())
    axios({
      method: 'get',
      url: 'user/logout'
    })
    .then( resp => {
      console.log('LOGOUT STATUS TRUE ', resp.data)
      if(resp.data.status) {
        dispatch(action.loadingIIEnd())
        dispatch(action.storeUser(null))
        this.localDB.clearData()
        this.localDB.clearChosenRestaurant()
        Navigation.setStackRoot(props.componentId, [{ component: { name: 'LoginOTP' } }])
      } else {
        console.log('LOGOUT STATUS FALSE ', resp.data)
        dispatch(action.loadingIIEnd())
        this.showPush({
          message: 'این کاربر قبلا خارج شده است!',
          status: 'danger'
        })
      }
    })
    .catch(err => {
      console.log('LOGOUT REQUEST ERROR ', err)
      dispatch(action.loadingIIEnd())
      util.handleOffline(props, true)
      util.toErrorPage(1013, props.navigator)
    })
  }

  forgetPassword = (props, username) => {
    const { dispatch } = props
    dispatch(action.loadingIIStart())
    axios({
      method: 'post',
      url: 'user/forgotPassword',
      data: {
        identification: username
      }
    })
    .then(resp => {
      console.log('FORGET_PASSWORD STATUS TRUE ', resp.data)
      if(resp.data.status) {
        dispatch(action.loadingIIEnd())
        dispatch(action.forgetPassword(resp.data.result.type))
      } else {
        console.log('FORGET_PASSWORD STATUS FALSE ', resp.data)
        dispatch(action.loadingIIEnd())
        this.showPush({
          message: typeof resp.data.message_fa === 'string' ? 
                    `${resp.data.message_fa}!` : 
                    resp.data.message_fa[0].identification[0],
          status: 'danger'
        })
      }
    })
    .catch(err => {
      console.log('FORGET_PASSWORD REQUEST ERROR ', err)
      dispatch(action.loadingIIEnd())
      util.handleOffline(props, true)
      util.toErrorPage(1031, props.navigator)
    })
  }

  resetForgetPasswordValue = dispatch => {
    dispatch(action.forgetPassword(null))
  }

  showNotification = (content, dispatch) => {
    dispatch(action.showNotification(content))
  }

  hideNotification = dispatch => {
    dispatch(action.hideNotification({}))
  }

  showPush = option => {
    option = option || {}
    showMessage({
      message: option.message ? option.message : '  یک متن تست برای نوتیفیکیشن',
      type: option.status ? option.status : "default",
      duration: option.timer || 1850,
      floating: true
    })
  }

  dashboard = (props, choosing = false) => {
    const { dispatch } = props
    this.localDB.getChosenRestaurant()
    .then(chosenRestaurant => {
      if(!!chosenRestaurant && choosing === false){
        this.currentRestaurant(props, dispatch, parseInt(chosenRestaurant)) // this will head to home 
      } else {
        dispatch(action.loadingStart())
        axios({
          method: 'get',
          url: 'dashboard/detail'
        })
        .then( resp => {
          console.log('DASHBOARD STATUS TRUE ', resp.data)
          if(resp.data.status) {
            dispatch(action.loadingEnd())
            dispatch(action.loadDashboard(resp.data))
          } else {
            console.log('DASHBOARD STATUS FALSE ', resp.data)
            dispatch(action.loadingEnd())
            dispatch(action.loadDashboard(null))
            dispatch(action.showEmpty({}))   // dashboard status must be false in case of empty array
          }
        })
        .catch(err => {
          console.log('DASHBOARD REQUEST ERROR ', err.response)
          dispatch(action.loadingEnd())
          util.handleOffline(props, true)
          if(err.response.data.status === false) {
            Navigation.setStackRoot(props.componentId, [{ component: { name: 'LoginOTP' } }])
            this.showPush({
              message: 'این کاربر دسترسی به پنل ندارد!',
              status: 'danger',
              timer: 3
            })
            this.localDB.clearData()
          } else {
            util.toErrorPage(1013, props.navigator)
          }
        })
      }
    })
    .catch(err => {
      console.log('ERROR ON GETTING LOCAL CHOSEN_RESTAURANT ID ', err)
      dispatch(action.loadingEnd())
      this.localDB.clearchosenRestaurant() // in case of broken local data
      util.toErrorPage(1013, props.navigator)
    })
  }

  currentRestaurant = (props, dispatch, id) => {
    console.log('CURRENT RESTAURANT ID SET TO ', id)
    dispatch(action.currentRestaurant(id))
    this.localDB.setChosenRestaurant(`${id}`)
    Navigation.setStackRoot(props.componentId, [{ 
      component: {
        name: 'Home',
        options: {
          animations: {
            setStackRoot: {
              enabled: true,
              animationType: 'fade'
            }
          }
        } 
      } 
    }])
  }

  home = props => { 
    // this should fetch data everytime coz of possibility of changing restaurant from dashboard
    const { dispatch, navigator } = props
    dispatch(action.loadingStart())
    axios({
      method: 'get',
      url: `restaurant/restaurantReport/${props.state.currentRestaurant}`,
      params: {
        id: props.state.currentRestaurant  // for checking accesibility of restaurant
      }
    })
    .then( resp => {
      console.log('HOME STATUS TRUE ', resp.data)
      if(resp.data.status) {
        dispatch(action.loadingEnd())
        dispatch(action.loadHome(resp.data))
        this.comments(props, false, false, true) // to show the comments counter

      } else {
        console.log('HOME STATUS FALSE ', resp.data)
        dispatch(action.loadingEnd())
        util.toErrorPage(1014, props.navigator)
      }
    })
    .catch(err => {
      console.log('HOME REQUEST ERROR ', err)
      dispatch(action.loadingEnd())
      if(err.response.status == 401) {
        dispatch(action.currentRestaurant(null))
        this.localDB.clearChosenRestaurant()
        // setTimeout(() => navigator.resetTo({ screen: 'Dashboard' }), 1000) // ensure everything goes well
      } else {
        util.handleOffline(props, true)
        util.toErrorPage(1015, props.navigator)
      }
    })
  }

  clearHome = dispatch => {
    dispatch(action.loadHome(null))
  }

  salesReport = (props, paginate = false, startDate = null, endDate = null, period = null, orderId = '') => {
    const { dispatch } = props
    let page = props.state.salesReport && props.state.salesReport.result.orders ? 
      Math.ceil(props.state.salesReport.result.orders.length / 20) : 1
      console.log('ORDERS PAGE NUMBER 01 ', page)
    page = page === 0 ? 1 : page // avoiding zero division 
    page = paginate ? page + 1 : 1 // no pagination means all the first data nedded
    console.log('ORDERS PAGE NUMBER 02', page)
    orderId = typeof orderId === 'string' && orderId.length > 0 ? orderId.trim().toUpperCase() : null
    console.log('ORDER ID', orderId)
    dispatch(action.loadingStart())
    dispatch(action.hideEmpty({}))
    const params = {
      restaurantId: props.state.currentRestaurant,
      id: props.state.currentRestaurant, // for checking accesibility of restaurant
      startDate,
      endDate,
      period,
      page
    }
    if(orderId) params['orderId'] = orderId
    axios({
      method: 'get',
      url: 'order/report',
      params 
    })
    .then( resp => {
      console.log('SALES_REPORT STATUS TRUE ', resp.data)
      if(resp.data.status) {
        dispatch(action.loadingEnd())
        if(page === 1) dispatch(action.loadSalesReport(resp.data))
        else dispatch(action.loadSalesReportAdding(resp.data.result.orders))
        if(!resp.data.result.orders || resp.data.result.orders.length === 0) dispatch(action.showEmpty({}))
      } else {
        console.log('SALES_REPORT STATUS FALSE ', resp.data)
        dispatch(action.loadingEnd())
        util.toErrorPage(1016, props.navigator)
      }
    })
    .catch(err => {
      console.log('SALES_REPORT REQUEST ERROR ', err)
      dispatch(action.loadingEnd())
      util.handleOffline(props, true)
      util.toErrorPage(1017, props.navigator)
    })
  }

  financialReport = (props, paginate = false) => {
    const { dispatch } = props
    let page = props.state.financialReport && props.state.financialReport.result.data ? 
      Math.ceil(props.state.financialReport.result.data.length / 20) : 1
    page = page === 0 ? 1 : page // avoiding zero division 
    page = paginate ? page + 1 : 1 // no pagination means all the first data nedded
    dispatch(action.loadingStart())
    dispatch(action.hideEmpty({}))
    const params = {
      restaurantId: props.state.currentRestaurant,
      page: 1
    }
    axios({
      method: 'get',
      url: 'restaurantInvoice/list',
      params 
    })
    .then( resp => {
      console.log('FINANCIAL_REPORT STATUS TRUE ', resp.data)
      if(resp.data.status) {
        dispatch(action.loadingEnd())
        if(page === 1) dispatch(action.loadFinancialReport(resp.data))
        else dispatch(action.loadFinancialReportAdding(resp.data.result.data))
        if(!resp.data.result.data || resp.data.result.data.length === 0) dispatch(action.showEmpty({}))
      } else {
        console.log('FINANCIAL_REPORT STATUS FALSE ', resp.data)
        dispatch(action.loadingEnd())
        util.toErrorPage(1032, props.navigator)
      }
    })
    .catch(err => {
      console.log('FINANCIAL_REPORT REQUEST ERROR ', err)
      dispatch(action.loadingEnd())
      util.handleOffline(props, true)
      util.toErrorPage(1033, props.navigator)
    })
  }

  financialOrders = (props, invoiceId, paginate = false) => {
    const { dispatch } = props
    let page = props.state.financialOrders && props.state.financialOrders.result.data ? 
      Math.ceil(props.state.financialOrders.result.data.length / 20) : 1
      console.log('FINANCIAL_ORDERS PAGE NUMBER ', page)
    page = page === 0 ? 1 : page // avoiding zero division 
    page = paginate ? page + 1 : 1 // no pagination means all the first data needed
    dispatch(action.loadingStart())
    dispatch(action.hideEmpty({}))
    const params = {
      invoiceId,
      page: 1
    }
    axios({
      method: 'get',
      url: 'restaurantInvoice/orders',
      params
    })
    .then( resp => {
      console.log('FINANCIAL_ORDERS STATUS TRUE ', resp.data)
      if(resp.data.status) {
        dispatch(action.loadingEnd())
        if(page === 1) dispatch(action.loadFinancialOrders(resp.data))
        else dispatch(action.loadFinancialOrdersAdding(resp.data.result.data))
        if(!resp.data.result.data || resp.data.result.data.length === 0) dispatch(action.showEmpty({}))
      } else {
        console.log('FINANCIAL_ORDERS STATUS FALSE ', resp.data)
        dispatch(action.loadingEnd())
        util.toErrorPage(1034, props.navigator)
      }
    })
    .catch(err => {
      console.log('FINANCIAL_ORDERS REQUEST ERROR ', err)
      dispatch(action.loadingEnd())
      util.handleOffline(props, true)
      util.toErrorPage(1035, props.navigator)
    })
  }

  financialOrderDetail = (props, orderId) => {
    const { dispatch } = props
    dispatch(action.loadingStart())
    dispatch(action.loadFinancialOrderDetail(null))
    const params = { orderId }
    axios({
      method: 'get',
      url: 'order/detailForInvoice',
      params
    })
    .then( resp => {
      if(resp.data.status) {
        console.log('FINANCIAL_ORDER_DETAIL STATUS TRUE ', resp.data)
        dispatch(action.loadingEnd())
        dispatch(action.loadFinancialOrderDetail(resp.data))
      } else {
        console.log('FINANCIAL_ORDER_DETAIL STATUS FALSE ', resp.data)
        dispatch(action.loadingEnd())
        util.toErrorPage(1036, props)
      }
    })
    .catch(err => {
      console.log('FINANCIAL_ORDER_DETAIL REQUEST ERROR ', err)
      dispatch(action.loadingEnd())
      util.handleOffline(props, true)
      util.toErrorPage(1037, props)
    })
  }

  financialAmendments = (props, invoiceId, paginate = false) => {
    const { dispatch } = props
    let page = props.state.financialAmendments && props.state.financialAmendments.result.data ? 
      Math.ceil(props.state.financialAmendments.result.data.length / 20) : 1
      console.log('FINANCIAL_AMENDMENTS PAGE NUMBER ', page)
    page = page === 0 ? 1 : page // avoiding zero division 
    page = paginate ? page + 1 : 1 // no pagination means all the first data needed
    dispatch(action.loadingStart())
    dispatch(action.hideEmpty({}))
    const params = {
      invoiceId,
      page: 1
    }
    axios({
      method: 'get',
      url: 'restaurantInvoice/orderCorrections',
      params
    })
    .then( resp => {
      console.log('FINANCIAL_AMENDMENTS STATUS TRUE ', resp.data)
      if(resp.data.status) {
        dispatch(action.loadingEnd())
        if(page === 1) dispatch(action.loadFinancialAmendments(resp.data))
        else dispatch(action.loadFinancialAmendmentsAdding(resp.data.result.data))
        if(!resp.data.result.data || resp.data.result.data.length === 0) dispatch(action.showEmpty({}))
      } else {
        console.log('FINANCIAL_AMENDMENTS STATUS FALSE ', resp.data)
        dispatch(action.loadingEnd())
        util.toErrorPage(1036, props)
      }
    })
    .catch(err => {
      console.log('FINANCIAL_AMENDMENTS REQUEST ERROR ', err)
      dispatch(action.loadingEnd())
      util.handleOffline(props, true)
      util.toErrorPage(1037, props)
    })
  }

  loadOrder = (props, id) => {
    const { dispatch } = props
    dispatch(action.loadingStart())
    axios({
      method: 'get',
      url: 'order/detail',
      params: { 
        order_id: id,
        id: props.state.currentRestaurant  // for checking accesibility of restaurant
      }
    })
    .then( resp => {
      console.log('ORDER STATUS TRUE ', resp.data)
      if(resp.data.status) {
        dispatch(action.loadingEnd())
        dispatch(action.loadOrder(resp.data))
      } else {
        console.log('ORDER STATUS FALSE ', resp.data)
        dispatch(action.loadingEnd())
        util.toErrorPage(1018, props.navigator)
      }
    })
    .catch(err => {
      console.log('ORDER REQUEST ERROR ', err)
      dispatch(action.loadingEnd())
      util.handleOffline(props, true)
      util.toErrorPage(1019, props.navigator)
    })
  }

  unloadOrder = dispatch => {
    dispatch(action.unloadOrder({}))
  }

  editMenu = (props, hasLoading = true, superGroup = null) => {
    // if(hasLoading === false) { // This is useless but dont touch it! ;)
      const { dispatch } = props
      hasLoading && dispatch(action.loadingStart())
      dispatch(action.loadSearchedFood(null))
      axios({
        method: 'get',
        url: 'food',
        params: { 
          id: props.state.currentRestaurant,
          id: props.state.currentRestaurant  // for checking accesibility of restaurant
        }
      })
      .then( resp => {
        console.log('EDIT_MENU STATUS TRUE ', resp.data)
        if(resp.data.status) {
          hasLoading && dispatch(action.loadingEnd())
          dispatch(action.loadingIIEnd()) // this is for the case of foodStatus Change!
          dispatch(action.hideEmpty())
          dispatch(action.loadEditMenu(resp.data))
          if(superGroup) {
            let updatedMenuItem = null
            resp.data.result.menu.map(FoodRow => {
              FoodRow.foods.map(PressedItem => {
                if(superGroup.id === PressedItem.id) {
                  updatedMenuItem = PressedItem
                }
              })
            })
            this.loadFoodOptions(props, updatedMenuItem)
          }
        } else {
          console.log('EDIT_MENU STATUS FALSE ', resp.data)
          hasLoading && dispatch(action.loadingEnd())
          dispatch(action.loadingIIEnd())
          util.toErrorPage(1020, props.navigator)
        }
      })
      .catch(err => {
        console.log('EDIT_MENU REQUEST ERROR ', err)
        hasLoading && dispatch(action.loadingEnd())
        dispatch(action.loadingIIEnd())
        util.handleOffline(props, true)
        util.toErrorPage(1021, props.navigator)
      })
    // }
    // else return null
  }

  foodMenuSearch = (props, query) => {
    const { dispatch } = props
    if(query !== null) {
      console.log('QUERY ===', query)
      if(query.length > 0) {
        query = query.trim()
        let data = props.state.editMenu.result.menu
        data = data.map(group => {
          let foods = group.foods.map(item => {
            if(item.name.search(query) !== -1) {
              return item
            }
            return null
          })
          foods = foods.filter(n => n)
          
          if(foods.length > 0) return { ...group, foods }
          return null
        })
        data = data.filter(n => n)
        console.log('SEARCHED DATA FIRST === ', data)
        if(data.length === 0) {
          dispatch(action.showEmpty({}))
          console.log('EMPTY SEARCH RESULT')
        }
        data = {
          ...props.state.editMenu,
          result: {
            ...props.state.editMenu.result,
            menu: data
          }
        }
        dispatch(action.loadSearchedFood(data))
        console.log('SEARCHED DATA LAST === ', data)
      }
    } else {
      dispatch(action.loadSearchedFood(null))
    }
  }

  menuItemStatus = (props, item, superGroup) => {
    const { dispatch } = props
    const { id, status } = item
    console.log('MENU ITEM STATUS CHANGE INPUT PROPS', props)
    dispatch(action.loadingIIStart())
    axios({
      method: 'put',
      url: 'food/changeFoodStatus',
      data: {
        foodId: id,
        foodStatus: status === 1 ? 2 : 1,
        id: props.state.currentRestaurant  // for checking accesibility of restaurant
      }
    })
    .then( resp => {
      console.log('MENU ITEM STATUS CHANGE IS TRUE', resp.data)
      dispatch(action.loadingIIEnd())
      if(resp.data.status) {
        this.editMenu(props, false, superGroup) // this also has LoadingII end and item index for reloading food options modalModal !
        if(status !== 1) {
          this.showPush({
            message: resp.data.message_fa,
            status: 'success'
          })
        }
      } else {
        console.log('MENU ITEM STATUS CHANGE IS FALSE', resp.data)
        this.showPush({
          message: resp.data.message_fa,
          status: 'alarm'
        })
      }
    })
    .catch( err => {
      console.log('MENU ITEM STATUS CHANGE RQUEST FAILED ', err)
      dispatch(action.loadingIIEnd())
      util.handleOffline(props, true)
      this.showPush({
        message: 'مشکلی در تغییر وضعیت غذا پیش آمد. لطفا دوباره سعی کنید!',
        status: 'alarm'
      })
    })
  }

  loadFoodOptions = (props, item) => {
    const { dispatch } = props
    dispatch(action.loadFoodOptions(item))
  }

  unloadFoodOptions = dispatch => {
    dispatch(action.unloadFoodOptions({}))
  }

  foodOptionStatus = (props, item, superGroup) => {
    const { dispatch } = props
    const id = item.foodOptionId
    const status = item.foodOptionStatus
    console.log('FOOD_OPTION ITEM STATUS CHANGE INPUT ', props, item)
    dispatch(action.loadingIIStart())
    axios({
      method: 'put',
      url: 'food-options/changeFoodOptionStatus',
      data: {
        foodOptionId: id,
        foodOptionStatus: status === 1 ? 2 : 1,
        id: props.state.currentRestaurant  // for checking accesibility of restaurant
      }
    })
    .then( resp => {
      console.log('FOOD_OPTION ITEM STATUS CHANGE IS TRUE', resp.data)
      console.log('FOOD ITEM IS =-=-=-=- ', item)
      dispatch(action.loadingIIEnd())
      if(resp.data.status) {
        this.editMenu(props, false, superGroup) // this also has LoadingII end !
      } else {
        console.log('FOOD_OPTION ITEM STATUS CHANGE IS FALSE', resp.data)
        this.showPush({
          message: resp.data.message_fa,
          status: 'alarm'
        })
      }
    })
    .catch( err => {
      console.log('FOOD_OPTION ITEM STATUS CHANGE RQUEST FAILED ', err)
      dispatch(action.loadingIIEnd())
      util.handleOffline(props, true)
      this.showPush({
        message: 'مشکلی در تغییر وضعیت غذا پیش آمد. لطفا دوباره سعی کنید!',
        status: 'alarm'
      })
    })
  }

  restaurantDetail = props => {
    const { dispatch } = props
    dispatch(action.loadingStart())
    axios({
      method: 'get',
      url: `restaurant/detail?id=${props.state.currentRestaurant}`,
      params: {
        id: props.state.currentRestaurant  // for checking accesibility of restaurant
      }
    })
    .then( resp => {
      console.log('RESTAURANT DETAIL STATUS TRUE ', resp.data)
      if(resp.data.status) {
        dispatch(action.loadingEnd())
        dispatch(action.loadRestaurantDetail(resp.data))
      } else {
        console.log('RESTAURANT DETAIL STATUS FALSE ', resp.data)
        dispatch(action.loadingEnd())
        util.toErrorPage(1022, props.navigator)
      }
    })
    .catch(err => {
      console.log('RESTAURANT DETAIL REQUEST ERROR ', err)
      dispatch(action.loadingEnd())
      util.handleOffline(props, true)
      util.toErrorPage(1023, props.navigator)
    })
  }

  comments = (props, paginate = false, reload, noLoading) => {
    console.log('yoyoyo', noLoading)
    // if(!props.state.comments || reload) { // made me bugs when multi restaurants owner wants to switch!
      const { dispatch } = props
      let page = props.state.comments && props.state.comments.result.comments ? 
        Math.ceil(props.state.comments.result.comments.length / 20) : 1
      page = page === 0 ? 1 : page // avoiding zero division 
      page = paginate ? page + 1 : 1 // no pagination means all the first data nedded
      !noLoading && dispatch(action.loadingStart()) // no double loading in home page
      axios({
        method: 'get',
        url: 'comment/list',
        params: {
          restaurant_id: props.state.currentRestaurant,
          page,
          id: props.state.currentRestaurant  // for checking accesibility of restaurant
        }
      })
      .then( resp => {
        console.log('COMMENTS STATUS TRUE ', resp.data)
        if(resp.data.status) {
          console.log('COMMENTS PAGE NUMBER ', page)
          dispatch(action.loadingEnd())
          if(page === 1) dispatch(action.loadComments(resp.data))
          else dispatch(action.loadCommentsAdding(resp.data.result.comments))
          console.log('######### from services', resp.data.result.comments)
        } else {
          console.log('COMMENTS STATUS FALSE ', resp.data)
          dispatch(action.loadingEnd())
          util.toErrorPage(1024, props.navigator)
        }
      })
      .catch(err => {
        console.log('COMMENTS REQUEST ERROR ', err)
        dispatch(action.loadingEnd())
        util.handleOffline(props, true)
        util.toErrorPage(1025, props.navigator)
      })
    // }
    // else return null
  }

  loadReplyData = (props, data) => {
    const { dispatch } = props
    dispatch(action.loadReply({ ...data, visible: true }))
  }

  unloadReplyData = dispatch => {
    dispatch(action.unloadReply({}))
  }

  reply = props => {
    console.log('REPLY INPUT DATA ==> ', props.state.reply)
    const { dispatch } = props
    let { commentId, voteId, message } = props.state.reply
    if(!props.state.loadingII) { // preventing double tap while one request is on progress!
      dispatch(action.loadingIIStart())
      let notEmpty = false
      if(typeof message == 'string') { notEmpty = true }
      console.log('MESSAGE', message)
      if(notEmpty) {
        if(message.length > 0) { message = message.trim() }
        if(message.length === 0) {
          console.log('TRIMMED MESSAGE IS ALSO EMPTY!!!!')
          dispatch(action.loadingIIEnd())
          this.showPush({
            message: 'لطفا متن پیام خود را وارد نمایید!',
            status: 'danger'
          })
        } else {
          axios({
            method: 'post',
            url: 'comment/reply',
            data: {
              comment_id: commentId,
              vote_id: voteId,
              comment_reply: message,
              id: props.state.currentRestaurant  // for checking accesibility of restaurant
            }
          })
          .then(resp => {
            if(resp.data.status) {
              console.log('REPLY STATUS TRUE ===> ', resp.data)
              dispatch(action.loadingIIEnd())
              this.unloadReplyData(dispatch)
              this.comments(props, false, true) // args => (props, loading, reload comments after reply)
              this.showPush({
                message: resp.data.message_fa,
                status: 'success'
              })
            } else {
              console.log('REPLY STATUS FALSE ===> ', resp.data)
              dispatch(action.loadingIIEnd())
              this.showPush({
                message: `${resp.data.message_fa}!`,
                status: 'danger'
              })
            }
          })
          .catch(err => {
            console.log('REPLY REQUEST ERROR ===> ', err)
            dispatch(action.loadingIIEnd())
            util.handleOffline(props, true)
            this.showPush({
              message: 'مشکلی در درخواست پاسخ پیش آمد! لطفا مجددا تلاش کنید.',
              status: 'danger'
            })
          })
        }
      } else {
        console.log('MESSAGE IS EMPTY')
        dispatch(action.loadingIIEnd())
        this.showPush({
          message: 'لطفا متن پیام خود را وارد نمایید!',
          status: 'danger'
        })
      }
    }
  }

  reportComment = (props, commentId) => {
    console.log('REPORT_COMMENT INPUT DATA ==> ', props)
    const { dispatch } = props
    let { currentRestaurant } = props.state
    if(!props.state.loadingII) { // preventing double tap while one request is on progress!
      dispatch(action.loadingIIStart())
          axios({
            method: 'post',
            url: 'reportedComment/report',
            data: {
              comment_id: commentId,
              restaurant_id: currentRestaurant,
              id: currentRestaurant  // for checking accesibility of restaurant
            }
          })
          .then(resp => {
            if(resp.data.status) {
              console.log('REPORT_COMMENT STATUS TRUE ===> ', resp.data)
              dispatch(action.loadingIIEnd())
              this.comments(props, false, true) // args => (props, loading, reload comments after reply)
            } else {
              console.log('REPORT_COMMENT STATUS FALSE ===> ', resp.data)
              dispatch(action.loadingIIEnd())
              this.showPush({
                message: `${resp.data.message_fa}!`,
                status: 'danger'
              })
            }
          })
          .catch(err => {
            console.log('REPORT_COMMENT REQUEST ERROR ===> ', err)
            dispatch(action.loadingIIEnd())
            util.handleOffline(props, true)
            this.showPush({
              message: 'مشکلی در درخواست گزارش پیش آمد! لطفا مجددا تلاش کنید.',
              status: 'danger'
            })
          })
    }
  }

  deliveryZones = (props, reload = false) => {
    // if(!props.state.deliveryZones || reload) { // same issue as comments prevents using this approach
      const { dispatch } = props
      dispatch(action.loadingStart())
      axios({
        method: 'get',
        url: 'deliveryZone/list',
        params: {
          restaurant_id: props.state.currentRestaurant,
          id: props.state.currentRestaurant  // for checking accesibility of restaurant
        }
      })
      .then( resp => {
        console.log('DELIVERY_ZONES STATUS TRUE ', resp.data)
        if(resp.data.status) {
          dispatch(action.loadingEnd())
          dispatch(action.loadDeliveryZones(resp.data))
        } else {
          console.log('DELIVERY_ZONES STATUS FALSE ', resp.data)
          dispatch(action.loadingEnd())
          util.toErrorPage(1026, props.navigator)
        }
      })
      .catch(err => {
        console.log('DELIVERY_ZONES REQUEST ERROR ', err)
        dispatch(action.loadingEnd())
        util.handleOffline(props, true)
        util.toErrorPage(1027, props.navigator)
      })
    // }
    // else return null
  }

}

export default new API()




