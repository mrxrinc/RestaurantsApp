import { StyleSheet } from 'react-native'


module.exports = StyleSheet.create({
  primary: { color: '#32434C' },
  bgPrimary: { backgroundColor: '#32434C' },
  primaryLight: { color: '#4C6674' },
  bgPrimaryLight: { backgroundColor: '#4C6674' },
  primaryDark: { color: '#2A3A43' },
  bgPrimaryDark: { backgroundColor: '#2A3A43' },
  accent: { color: '#F89F41' },
  bgAccent: { backgroundColor: '#F89F41' },
  accentLight: { color: '#ffcc01' },
  bgAccentLight: { backgroundColor: '#ffcc01' },
  accentDark: { color: '#D68E43' },
  bgAccentDark: { backgroundColor: '#D68E43' },
  green: { color: '#1CBD2E' },
  bgGreen: { backgroundColor: '#1CBD2E' },
  greenLight: { color: '#97C21E' },
  bgGreenLight: { backgroundColor: '#97C21E' },
  red: { color: '#E41D35' },
  bgRed: { backgroundColor: '#E41D35' },
  redLight: { color: '#F64559' },
  bgRedLight: { backgroundColor: '#F64559' },
  redDark: { color: '#BB172D' },
  bgRedDark: { backgroundColor: '#BB172D' },
  greenHighlight: { color: '#949E49' },
  bgGreenHighlight: { backgroundColor: '#949E49' },
  lightText: { color: '#A6BCC7'},
  round: { borderRadius: 3 },
  safeBottom: { height: 90 },
  line: {
    height: 1,
    backgroundColor: '#e8ebef'
  },
  btn: {
    height: 45,
    borderRadius: 30
  },
  navbar: {
    height: 75,
    borderColor: '#1B2A32',
    borderBottomWidth: 1
  },
  tabbar: {
    height: 55,
    width: '100%',
    elevation: 10
  },
  homeProfile: {
    elevation: 5,
    borderRadius: 15,
    shadowColor: '#000', 
    shadowRadius: 3, 
    shadowOpacity: 0.5, 
    shadowOffset: {width: 0, height: 2 },
  },
  homeAvatar: {
    width: 90, 
    height: 90, 
    borderWidth: 3, 
    borderColor: '#ffffff33'
  },
  homeSalePercent: {
    minWidth: 30, 
    height: 30, 
    left: -12, 
    top: -10, 
    elevation: 3, 
    shadowColor: '#BB172D', 
    shadowRadius:10, 
    shadowOpacity: 0.8, 
    shadowOffset: {width: 0, height: 5 },
    borderRadius: 30,
  },
  homeSaleItemRightBox: {
    width: 100,
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15
  },
  salesReportOrderDetailBTN: {
    position: 'absolute',
    left: 5,
    width: 100,
    height: 28,
    borderRadius: 20,
  },
  modal: {
    width: '100%',
    margin: 0,
    marginTop: 100
  },
  orderDetailRow: {
    minHeight: 60,
    borderTopColor: '#eee',
    borderTopWidth: 1,
  },
  menuModalGroupHeader: {
    padding: 5,
    paddingTop: 50,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc'
  },
  commentsItem: {
    minHeight: 50,
    borderTopRightRadius: 0
  },
  commentsFoodRow: { 
    borderColor: '#acb9c6', 
    borderTopWidth: 0.6
  },
  commentsFoodRowItem: {
    paddingVertical: 5,
    borderWidth: 0.5,
    borderRadius: 7
  },
  moreRowItem:{ // 'more' refers to the page 'More'
    width: '100%',
    height: 60,
    borderColor: '#3c4d59',
    borderBottomWidth: 1,
  },
  restaurantDetailRowHead: {
    height: 50, 
    borderColor: '#3c4d59', 
    borderBottomWidth: 0.5
  },
  restaurantDetailRowItem:{ 
    width: '100%',
    minHeight: 60,
    borderColor: '#3c4d59',
    borderBottomWidth: 1,
  },
  workingHoursRow: {
    height: 35,
    borderRadius: 5,
    borderColor: '#ccc',
  },
  otpInput: {
    letterSpacing: 20,
    borderBottomWidth: 1,
    borderColor: '#bbb',
    fontSize: 35,
    padding: 1,
    height: 50,
  }



})
