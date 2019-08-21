import React from 'react'
import {
  View,
  Animated,
  TouchableWithoutFeedback
} from 'react-native'
import { Text } from './font'
import r from '../styles/rinc'

const createReactClass = require('create-react-class')

const ScrollableTabBar = createReactClass({
  handleBadges(page) {
    switch (page) {
      case 1:
        return this.props.orders
      case 0:
        return this.props.amendments
      default:
        return 0
    }
  },
  renderTab(name, page, isTabActive, onPressHandler) {
    const { activeTextColor, inactiveTextColor } = this.props
    const activeColor = isTabActive ? activeTextColor : inactiveTextColor
    const titleColor = isTabActive ? '#fff' : '#acb9c6'
    return (
      <TouchableWithoutFeedback
        style={r.full}
        key={name}
        onPress={() => onPressHandler(page)} 
      >
        <View style={[r.full, r.center, r.rtl]}>
          <Text size={12} style={{ color: titleColor }}>{name}</Text>
          <View 
            style={[r.round20, r.center, r.rightM5, { 
              backgroundColor: activeColor,
              marginBottom: 4
            }]} 
            removeClippedSubviews
          >
            <Text 
              size={12}
              style={[ r.white, {
                height: 20,
                minWidth: 20,
                paddingTop: 1,
                paddingHorizontal: 5,
                textAlign: 'center',
                textAlignVertical: 'center'
              }]}
            >
              {this.handleBadges(page)}
            </Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    )
  },
  render() {
    const containerWidth = this.props.containerWidth
    const numberOfTabs = this.props.tabs.length
    const left = this.props.scrollValue.interpolate({
      inputRange: [0, 1], outputRange: [0, containerWidth / numberOfTabs]
    })
    return (
      <View 
        style={[r.row, r.selfCenter, r.spaceAround, 
          { height: 50, borderColor: '#697989', borderBottomWidth: 0.5 }
        ]}
      >
        {this.props.tabs.map((name, page) => {
          const isTabActive = this.props.activeTab === page
          const renderTab = this.props.renderTab || this.renderTab
          return renderTab(name, page, isTabActive, this.props.goToPage)
        })}
        <Animated.View 
          style={[r.absolute, r.selfCenter, { 
            width: containerWidth / numberOfTabs,
            height: 2,
            backgroundColor: this.props.activeTextColor,
            bottom: 0,
            transform: [{ translateX: left }] 
          }]} 
        />
      </View>
    )
  }
})

module.exports = ScrollableTabBar
