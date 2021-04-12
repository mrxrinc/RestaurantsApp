import { offlineActionTypes } from 'react-native-offline'
import * as TYPE from "../constants"

export const test = () => ({ type: TYPE.TEST })

export const update = payload => ({ 
  type: TYPE.UPDATE,
  payload
})

export const loadingStart = () => ({ type: TYPE.LOADING_START })

export const loadingEnd = () => ({ type: TYPE.LOADING_END })

export const loadingIIStart = () => ({ type: TYPE.LOADING_II_START })

export const loadingIIEnd = () => ({ type: TYPE.LOADING_II_END })

export const internetChecker = isConnected => ({
  type: offlineActionTypes.CONNECTION_CHANGE,
  payload: isConnected
})

export const storeUser = payload => ({
  type: TYPE.STORE_USER,
  payload
})

export const forgetPassword = payload => ({
  type: TYPE.FORGET_PASSWORD,
  payload
})

export const showNotification = payload => ({
  type: TYPE.SHOW_NOTIFICATION,
  payload
})

export const hideNotification = () => ({ type: TYPE.HIDE_NOTIFICATION })

export const showEmpty = payload => ({
  type: TYPE.SHOW_EMPTY,
  payload
})

export const hideEmpty = () => ({ type: TYPE.HIDE_EMPTY })

export const loadDashboard = payload => ({
  type: TYPE.LOAD_DASHBOARD,
  payload
})

export const currentRestaurant = payload => ({
  type: TYPE.CURRENT_RESTAURANT,
  payload
})

export const loadHome = payload => ({
  type: TYPE.LOAD_HOME,
  payload
})

export const loadSalesReport = payload => ({
  type: TYPE.LOAD_SALES_REPORT,
  payload
})

export const loadSalesReportAdding = payload => ({
  type: TYPE.LOAD_SALES_REPORT_ADDING,
  payload
})

export const loadFinancialReport = payload => ({
  type: TYPE.LOAD_FINANCIAL_REPORT,
  payload
})

export const loadFinancialReportAdding = payload => ({
  type: TYPE.LOAD_FINANCIAL_REPORT_ADDING,
  payload
})

export const loadFinancialOrders = payload => ({
  type: TYPE.LOAD_FINANCIAL_ORDERS,
  payload
})

export const loadFinancialOrdersAdding = payload => ({
  type: TYPE.LOAD_FINANCIAL_ORDERS_ADDING,
  payload
})

export const loadFinancialOrderDetail = payload => ({
  type: TYPE.LOAD_FINANCIAL_ORDER_DETAIL,
  payload
})

export const loadFinancialAmendments = payload => ({
  type: TYPE.LOAD_FINANCIAL_AMENDMENTS,
  payload
})

export const loadFinancialAmendmentsAdding = payload => ({
  type: TYPE.LOAD_FINANCIAL_AMENDMENTS_ADDING,
  payload
})

export const loadOrder = payload => ({
  type: TYPE.LOAD_ORDER,
  payload
})

export const unloadOrder = () => ({ type: TYPE.UNLOAD_ORDER })

export const loadEditMenu = payload => ({
  type: TYPE.LOAD_EDIT_MENU,
  payload
})

export const loadSearchedFood = payload => ({
  type: TYPE.LOAD_SEARCHED_FOOD,
  payload
})

export const loadFoodOptions = payload => ({
  type: TYPE.LOAD_FOOD_OPTIONS,
  payload
})

export const unloadFoodOptions = () => ({ type: TYPE.UNLOAD_FOOD_OPTIONS })

export const loadRestaurantDetail = payload => ({
  type: TYPE.LOAD_RESTAURANT_DETAIL,
  payload
})

export const loadComments = payload => ({
  type: TYPE.LOAD_COMMENTS,
  payload
})

export const loadCommentsAdding = payload => ({
  type: TYPE.LOAD_COMMENTS_ADDING,
  payload
})

export const loadReply = payload => ({
  type: TYPE.LOAD_REPLY,
  payload
})

export const unloadReply = () => ({ type: TYPE.UNLOAD_REPLY })

export const loadDeliveryZones = payload => ({
  type: TYPE.LOAD_DELIVERY_ZONES,
  payload
})