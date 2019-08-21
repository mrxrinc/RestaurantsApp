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

export const toErrorPage = (code, navigator) => {
  navigator.resetTo({
    screen: 'Error',
    passProps: {
      errorCode: code
    }
  })
}

export const handleOffline = (props, redux = false) => {
  const { navigator, state } = props
  console.log(state.network)
  if (redux === false) {
    navigator.resetTo({ screen: 'Splash' }) 
  } else {
    if(state.network.isConnected === false){
      navigator.resetTo({ screen: 'Offline' })
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
