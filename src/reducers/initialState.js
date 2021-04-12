// import { 
//   user,
//   dashboard,
//   home, 
//   salesReport, 
//   order,
//   editMenu,
//   comments,
//   deliveryZones,
//   restaurantDetail
// } from '../modules/assets/dumpData'

export default {
  test: 'Im initial',
  update: null,
  loading: false,
  loadingII: false,
  user: null,
  forgetPassword: null,
  dashboard: null,
  currentRestaurant: null, // this should be null in production
  home: null,
  salesReport: null,
  financialReport: null,
  financialOrders: null,
  financialOrderDetail: null,
  financialAmendments: null,
  order: null,
  editMenu: null,
  searchedFood: null,
  foodOptions: { visible: false },
  comments: null,
  reply: { visible: false },
  deliveryZones: null,
  restaurantDetail: null,
  network : {},
  notification: {
    visible: false,
    title: null,
    message: null,
    type: null
  },
  empty: {
    visible: false,
    icon: 'page-2',
    text: 'نتیجه ای یافت نشد!'
  }
}