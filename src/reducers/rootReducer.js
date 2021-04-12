import { combineReducers } from 'redux'
import { reducer as network } from 'react-native-offline'
import {
  test,
  update,
  loading,
  loadingII,
  user,
  forgetPassword,
  dashboard,
  currentRestaurant,
  home,
  salesReport,
  financialReport,
  financialOrders,
  financialOrderDetail,
  financialAmendments,
  order,
  editMenu,
  searchedFood,
  foodOptions,
  comments,
  reply,
  deliveryZones,
  restaurantDetail,
  notification,
  empty
} from './index'

const rootReducer = combineReducers({
  test,
  update,
  loading,
  loadingII,
  user,
  forgetPassword,
  dashboard,
  currentRestaurant,
  home,
  salesReport,
  financialReport,
  financialOrders,
  financialOrderDetail,
  financialAmendments,
  order,
  editMenu,
  searchedFood,
  foodOptions,
  comments,
  reply,
  deliveryZones,
  restaurantDetail,
  network,
  notification,
  empty
})

export default rootReducer
