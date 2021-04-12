import { Navigation } from 'react-native-navigation'
import { Provider } from 'react-redux'
import { registerScreens } from './Screens'
import configureStore from './store/configureStore'

const store = configureStore()
registerScreens(store, Provider)

Navigation.events().registerAppLaunchedListener(() => {
   

  Navigation.setRoot({
    root: {
      stack: {
        children: [
          {
            component: {
              name: 'Splash'
            }
          }
        ]
      }
    }
  })
})
