/* eslint-disable */
import React from 'react'
import { Navigation } from 'react-native-navigation'
import { ReduxNetworkProvider } from 'react-native-offline'

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
      <ReduxNetworkProvider>
        <Splash {...props} />
      </ReduxNetworkProvider>
    </Provider>
  ), () => Splash),

  Navigation.registerComponent('Offline', () => props => (
    <Provider store={store}>
      <ReduxNetworkProvider>
        <Offline {...props} />
      </ReduxNetworkProvider>
    </Provider>
  ), () => Offline),

  Navigation.registerComponent('Error', () => props => (
    <Provider store={store}>
      <ReduxNetworkProvider>
        <Error {...props} />
      </ReduxNetworkProvider>
    </Provider>
  ), () => Error),

  Navigation.registerComponent('Update', () => props => (
    <Provider store={store}>
      <ReduxNetworkProvider>
        <Update {...props} />
      </ReduxNetworkProvider>
    </Provider>
  ), () => Update),

  Navigation.registerComponent('Login', () => props => (
    <Provider store={store}>
      <ReduxNetworkProvider>
        <Login {...props} />
      </ReduxNetworkProvider>
    </Provider>
  ), () => Login),
  
  Navigation.registerComponent('LoginOTP', () => props => (
    <Provider store={store}>
      <ReduxNetworkProvider>
        <LoginOTP {...props} />
      </ReduxNetworkProvider>
    </Provider>
  ), () => LoginOTP),

  Navigation.registerComponent('ForgetPassword', () => props => (
    <Provider store={store}>
      <ReduxNetworkProvider>
        <ForgetPassword {...props} />
      </ReduxNetworkProvider>
    </Provider>
  ), () => ForgetPassword),
  
  Navigation.registerComponent('ResetPassword', () => props => (
    <Provider store={store}>
      <ReduxNetworkProvider>
        <ResetPassword {...props} />
      </ReduxNetworkProvider>
    </Provider>
  ), () => ResetPassword),
  
  Navigation.registerComponent('Dashboard', () => props => (
    <Provider store={store}>
      <ReduxNetworkProvider>
        <Dashboard {...props} />
      </ReduxNetworkProvider>
    </Provider>
  ), () => Dashboard),
  
  Navigation.registerComponent('Home', () => props => (
    <Provider store={store}>
      <ReduxNetworkProvider>
        <Home {...props} />
      </ReduxNetworkProvider>
    </Provider>
  ), () => Home),
  
  Navigation.registerComponent('SalesReport', () => props => (
    <Provider store={store}>
      <ReduxNetworkProvider>
        <SalesReport {...props} />
      </ReduxNetworkProvider>
    </Provider>
  ), () => SalesReport),
  
  Navigation.registerComponent('FinancialReport', () => props => (
    <Provider store={store}>
      <ReduxNetworkProvider>
        <FinancialReport {...props} />
      </ReduxNetworkProvider>
    </Provider>
  ), () => FinancialReport),
  
  Navigation.registerComponent('FinancialReportDetail', () => props => (
    <Provider store={store}>
      <ReduxNetworkProvider>
        <FinancialReportDetail {...props} />
      </ReduxNetworkProvider>
    </Provider>
  ), () => FinancialReportDetail),
  
  Navigation.registerComponent('EditMenu', () => props => (
    <Provider store={store}>
      <ReduxNetworkProvider>
        <EditMenu {...props} />
      </ReduxNetworkProvider>
    </Provider>
  ), () => EditMenu),
  
  Navigation.registerComponent('Comments', () => props => (
    <Provider store={store}>
      <ReduxNetworkProvider>
        <Comments {...props} />
      </ReduxNetworkProvider>
    </Provider>
  ), () => Comments),
  
  Navigation.registerComponent('More', () => props => (
    <Provider store={store}>
      <ReduxNetworkProvider>
        <More {...props} />
      </ReduxNetworkProvider>
    </Provider>
  ), () => More),
  
  Navigation.registerComponent('DeliveryZone', () => props => (
    <Provider store={store}>
      <ReduxNetworkProvider>
        <DeliveryZone {...props} />
      </ReduxNetworkProvider>
    </Provider>
  ), () => DeliveryZone),
  
  Navigation.registerComponent('RestaurantDetail', () => props => (
    <Provider store={store}>
      <ReduxNetworkProvider>
        <RestaurantDetail {...props} />
      </ReduxNetworkProvider>
    </Provider>
  ), () => RestaurantDetail),
  
  Navigation.registerComponent('Notification', () => props => (
    <Provider store={store}>
      <ReduxNetworkProvider>
        <Notification {...props} />
      </ReduxNetworkProvider>
    </Provider>
  ), () => Notification),
  
  Navigation.registerComponent('Push', () => props => (
    <Provider store={store}>
      <ReduxNetworkProvider>
        <Push {...props} />
      </ReduxNetworkProvider>
    </Provider>
  ), () => Push)

}
