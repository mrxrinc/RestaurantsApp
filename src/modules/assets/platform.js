import { Platform } from 'react-native'

export default IOS = Platform.select({
  ios: true,
  android: false
})
