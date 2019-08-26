import React from 'react'
import { 
  View,
  Image,
  TouchableOpacity
} from 'react-native'
import { Navigation } from 'react-native-navigation'
import { Text, Icon } from './font'
import Rainbow from './rainbow'
import * as r from '../styles/rinc'
import * as g from '../styles/general'

export default Navbar = props => (
  <View style={[g.navbar, g.bgPrimaryDark]}>
    <Image
      source={require('../images/pattern.jpg')}
      style={[r.whFull, r.absolute]}
      resizeMode={'cover'}
    />
    <Rainbow />
    <View style={[r.full, { marginTop: 22 }]}>

      <View style={[r.whFull, r.absolute, r.vCenter]}>
        <Text 
          bold
          size={14}
          style={[r.white, r.rtlText, r.centerText]}
          >
          {props.title}
        </Text> 
      </View>
    
      <View style={[r.full, r.rtl, r.spaceBetween]}>
        <View style={[{ width: 60 }]}>
          {props.back && (
            <TouchableOpacity 
              style={[r.center, r.full]}
              onPress={() => {
                if (!props.resetTo) {
                  props.modal ?
                    Navigation.dismissModal(props.componentId) :
                    Navigation.pop(props.componentId)
                } else {
                  Navigation.setStackRoot(props.componentId, [{ component: { name: props.resetTo } }])
                }
              }}
            >
              <Icon name={'right'} size={23} style={r.white} />
            </TouchableOpacity>
          )}
        </View>
        
        <View style={[r.hFull]}>
          {!!props.comments && (
            <TouchableOpacity 
              style={[r.full, r.rtl, r.vCenter, r.paddH10, r.hCenter]}
              onPress={() => {
                Navigation.push(props.componentId, { 
                  component: {
                    name: 'Comments',
                    options: { animations: { push: { enabled: false, waitForRender: true } } } 
                  } 
                })
              }}
            >
              <View>
                <Icon name={'message'} size={15} style={[r.white, r.leftM5, r.middleText, { height: 16 }]} />
                <View 
                  style={[r.absolute, g.bgRedLight, r.round20, r.center, {
                    minWidth: 20, height: 20, right: -12, top: -10 }
                  ]}
                >
                  <Text
                    size={11}
                    height={12}
                    lineHeight={17}
                    includefontPadding={false}
                    style={[r.centerText, r.white, { writingDirection: 'ltr' }]}
                  >
                    {props.comments < 100 ? props.comments : '99+'}
                  </Text>
                </View>
              </View>
              <Text
                size={11}
                height={20}
                style={[r.white, r.rtlText, r.centerText, r.middleText]}
                >
                نظرات کاربران
              </Text> 
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  </View>
)

