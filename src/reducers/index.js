import * as TYPE from '../constants'
import initialState from './initialState'

export const test = (state = initialState.test, { type }) => {
  if (type === 'TEST') return 'I am from redux'
  return 'Im initial but from else of redux'
}

export const update = (state = initialState.update, { type, payload }) => {
  if (type === TYPE.UPDATE) return payload
  return state
}

export const loading = (state = initialState.loading, { type }) => {
  switch(type) {
    case 'LOADING_START': return true
    case 'LOADING_END' : return false
    default: return state
  }
}

export const loadingII = (state = initialState.loadingII, { type }) => {
  switch(type) {
    case 'LOADING_II_START': return true
    case 'LOADING_II_END' : return false
    default: return state
  }
}

export const notification = (state = initialState.notification, { type, payload }) => {
  switch (type) {
    case TYPE.SHOW_NOTIFICATION:
      return {...payload, visible: true }
    case TYPE.HIDE_NOTIFICATION:
      return { visible: false, title: null, message: null, type: null }
    default:
      return state
  }
}

export const empty = (state = initialState.empty, { type, payload }) => {
  switch (type) {
    case TYPE.SHOW_EMPTY:
      const newData = {
        visible: true,
        icon: payload.icon ? payload.icon : 'page-2',
        text: payload.text ? payload.text : 'نتیجه ای یافت نشد!'
      }
      return newData
    case TYPE.HIDE_EMPTY:
      return { 
        visible: false, 
        icon: 'page-2', 
        text: 'نتیجه ای یافت نشد!' 
      }
    default:
      return state
  }
}

export const user = (state = initialState.user, { type, payload }) => {
  if(type === TYPE.STORE_USER) return payload
  return state
}

export const forgetPassword = (state = initialState.forgetPassword, { type, payload }) => {
  if(type === TYPE.FORGET_PASSWORD) return payload
  return state
}

export const dashboard = (state = initialState.dashboard, { type, payload }) => {
  if(type === TYPE.LOAD_DASHBOARD) return payload
  return state
}

export const currentRestaurant = (state = initialState.currentRestaurant, { type, payload }) => {
  if(type === TYPE.CURRENT_RESTAURANT) return payload
  return state
}

export const home = (state = initialState.home, { type, payload }) => {
  if(type === TYPE.LOAD_HOME) return payload
  return state
}

export const salesReport = (state = initialState.salesReport, { type, payload }) => {
  if(type === TYPE.LOAD_SALES_REPORT) return payload
  else if(type === TYPE.LOAD_SALES_REPORT_ADDING && payload) { //after last page if u press 'more' we would get null on orders causing error! so we preventing
    const newOrders = [...state.result.orders, ...payload]
    const newResult = { ...state.result, orders: newOrders }
    return { ...state, result: newResult }
  }
  return state
}

export const order = (state = initialState.order, { type, payload }) => {
  switch (type) {
    case TYPE.LOAD_ORDER:
      return payload
    case TYPE.UNLOAD_ORDER:
      return null
    default:
      return state
  }
}

export const editMenu = (state = initialState.editMenu, { type, payload }) => {
  if(type === TYPE.LOAD_EDIT_MENU) return payload
  return state
}

export const searchedFood = (state = initialState.searchedFood, { type, payload }) => {
  if(type === TYPE.LOAD_SEARCHED_FOOD) return payload
  return state
}

export const foodOptions = (state = initialState.foodOptions, { type, payload }) => {
  switch (type) {
    case TYPE.LOAD_FOOD_OPTIONS:
      return {...payload, visible: true }
    case TYPE.UNLOAD_FOOD_OPTIONS:
      return { visible: false }
    default:
      return state
  }
}

export const comments = (state = initialState.comments, { type, payload }) => {
  if(type === TYPE.LOAD_COMMENTS) return payload
  else if(type === TYPE.LOAD_COMMENTS_ADDING && payload) { //after last page if u press 'more' we would get null on comments causing error! so we preventing
  console.log('========= payload from reducer ', payload)
    const newComments = [...state.result.comments, ...payload]
    const newResult = { ...state.result, comments: newComments }
    return { ...state, result: newResult }
  }
  return state
}

export const reply = (state = initialState.reply, { type, payload }) => {
  switch (type) {
    case TYPE.LOAD_REPLY:
      return {...state, ...payload}
    case TYPE.UNLOAD_REPLY:
      return { visible: false }
    default:
      return state
  }
}

export const restaurantDetail = (state = initialState.restaurantDetail, { type, payload }) => {
  if(type === TYPE.LOAD_RESTAURANT_DETAIL) return payload
  return state
}

export const deliveryZones = (state = initialState.deliveryZones, { type, payload }) => {
  if(type === TYPE.LOAD_DELIVERY_ZONES) return payload
  return state
}