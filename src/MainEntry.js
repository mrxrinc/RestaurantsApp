import { Navigation } from 'react-native-navigation'
import { Provider } from 'react-redux'
import { registerScreens } from './Screens'
import configureStore from './store/configureStore'

const store = configureStore()
registerScreens(store, Provider)

Navigation.events().registerAppLaunchedListener(() => {
  Navigation.setDefaultOptions({
    topBar: {
      visible: false,
      drawBehind: true
    },
    layout: {
      orientation: ['portrait'],
      backgroundColor: '#32434C'
    },
    statusBar: {
      blur: true,
      drawBehind: true,
      backgroundColor: '#00000011',
      style: 'light'
    }
  })

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
