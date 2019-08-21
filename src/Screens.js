/* eslint-disable */
import React from 'react'
import { Navigation } from 'react-native-navigation'

import Splash from './modules/Splash'
import Offline from './modules/Offline'
import Error from './modules/Error'
import Update from './modules/Update'
import Login from './modules/Login'
import LoginOTP from './modules/LoginOTP'
import ForgetPassword from './modules/ForgetPassword'
import ResetPassword from './modules/ResetPassword'
import Dashboard from './modules/Dashboard'
import Home from './modules/Home'
import SalesReport from './modules/SalesReport'
import FinancialReport from './modules/FinancialReport'
import FinancialReportDetail from './modules/FinancialReportDetail'
import EditMenu from './modules/EditMenu'
import Comments from './modules/Comments'
import More from './modules/More'
import DeliveryZone from './modules/DeliveryZone'
import RestaurantDetail from './modules/RestaurantDetail'
import Notification from './modules/components/notification'
import Push from './modules/components/push'

export function registerScreens(store, Provider) {
  Navigation.registerComponent('Splash', () => props => (
    <Provider store={store}>
      <Splash {...props} />
    </Provider>
  ), () => Splash),

  Navigation.registerComponent('Offline', () => props => (
    <Provider store={store}>
      <Offline {...props} />
    </Provider>
  ), () => Offline),

  Navigation.registerComponent('Error', () => props => (
    <Provider store={store}>
      <Error {...props} />
    </Provider>
  ), () => Error),

  Navigation.registerComponent('Update', () => props => (
    <Provider store={store}>
      <Update {...props} />
    </Provider>
  ), () => Update),

  Navigation.registerComponent('Login', () => props => (
    <Provider store={store}>
      <Login {...props} />
    </Provider>
  ), () => Login),
  
  Navigation.registerComponent('LoginOTP', () => props => (
    <Provider store={store}>
      <LoginOTP {...props} />
    </Provider>
  ), () => LoginOTP),

  Navigation.registerComponent('ForgetPassword', () => props => (
    <Provider store={store}>
      <ForgetPassword {...props} />
    </Provider>
  ), () => ForgetPassword),
  
  Navigation.registerComponent('ResetPassword', () => props => (
    <Provider store={store}>
      <ResetPassword {...props} />
    </Provider>
  ), () => ResetPassword),
  
  Navigation.registerComponent('Dashboard', () => props => (
    <Provider store={store}>
      <Dashboard {...props} />
    </Provider>
  ), () => Dashboard),
  
  Navigation.registerComponent('Home', () => props => (
    <Provider store={store}>
      <Home {...props} />
    </Provider>
  ), () => Home),
  
  Navigation.registerComponent('SalesReport', () => props => (
    <Provider store={store}>
      <SalesReport {...props} />
    </Provider>
  ), () => SalesReport),
  
  Navigation.registerComponent('FinancialReport', () => props => (
    <Provider store={store}>
      <FinancialReport {...props} />
    </Provider>
  ), () => FinancialReport),
  
  Navigation.registerComponent('FinancialReportDetail', () => props => (
    <Provider store={store}>
      <FinancialReportDetail {...props} />
    </Provider>
  ), () => FinancialReportDetail),
  
  Navigation.registerComponent('EditMenu', () => props => (
    <Provider store={store}>
      <EditMenu {...props} />
    </Provider>
  ), () => EditMenu),
  
  Navigation.registerComponent('Comments', () => props => (
    <Provider store={store}>
      <Comments {...props} />
    </Provider>
  ), () => Comments),
  
  Navigation.registerComponent('More', () => props => (
    <Provider store={store}>
      <More {...props} />
    </Provider>
  ), () => More),
  
  Navigation.registerComponent('DeliveryZone', () => props => (
    <Provider store={store}>
      <DeliveryZone {...props} />
    </Provider>
  ), () => DeliveryZone),
  
  Navigation.registerComponent('RestaurantDetail', () => props => (
    <Provider store={store}>
      <RestaurantDetail {...props} />
    </Provider>
  ), () => RestaurantDetail),
  
  Navigation.registerComponent('Notification', () => props => (
    <Provider store={store}>
      <Notification {...props} />
    </Provider>
  ), () => Notification),
  
  Navigation.registerComponent('Push', () => props => (
    <Provider store={store}>
      <Push {...props} />
    </Provider>
  ), () => Push)

}
