
import { Navigation } from 'react-native-navigation'
import j from 'jalaali-js'

export const dateReform = date => {
  const newDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
  console.log('ROW INPUT DATE ', date)
  console.log('CHOSEN DATE ', newDate)
  return newDate
}

export const jalali = date => {
  let value = date.split('-')
  const jalali = j.toJalaali(parseInt(value[0], 10), parseInt(value[1], 10), parseInt(value[2], 10))
  return `${jalali.jy}/${jalali.jm}/${jalali.jd}`
}

export const toErrorPage = (code, props) => {
  Navigation.setStackRoot(props.componentId, [{ component: { name: 'Dashboard', passProps: { errorCode: code } } }])
}

export const handleOffline = (props, redux = false) => {
  const { navigator, state } = props
  console.log(state.network)
  if (redux === false) {
    Navigation.setStackRoot(props.componentId, [{ component: { name: 'Splash' } }])
  } else {
    if(state.network.isConnected === false){
      Navigation.setStackRoot(props.componentId, [{ component: { name: 'Offline' } }])
    } 
    else return null
  }
}

export const toEnglishDigits = text => {
   const num = {"۰": "0", "۱": "1", "۲": "2", "۳": "3", "۴": "4", "۵": "5", "۶": "6", "۷": "7", "۸": "8", "۹": "9"}
   text = text.replace(/./g, function(c){
     return num[c] || c
   })
   return text
 }


 export const rateColor = rate => {
   // Rate colors
  const rating = {
    rate1: '#e66230',
    rate2: '#e69717',
    rate3: '#cec20c',
    rate4: '#97c21e',
    rate5: '#4fc238',
    gray: '#d4d7da'
  }

  rate = typeof rate === 'number' ? rate : 0
  switch (Math.floor(rate)) {
    case 0:
      return rating.gray
    case 1:
      return rating.rate1
    case 2:
      return rating.rate2
    case 3:
      return rating.rate3
    case 4:
      return rating.rate4
    case 5:
      return rating.rate5
    default:
      return rating.rate1
  }
}