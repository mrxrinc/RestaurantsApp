import React, { Component } from 'react'
import { View } from 'react-native'
import { Text, Icon } from './font'
import Button from '../components/button'
import r from '../styles/rinc'
import g from '../styles/general'

const iconSize = 22
const titleSize = 10
export default class Tabbar extends Component {

  color(active) {
    switch(active) {
      case 'home':
        return this.props.active === 'home' ? r.white : g.lightText
      case 'salesReport':
        return this.props.active === 'salesReport' ? r.white : g.lightText
      case 'FinancialReport':
        return this.props.active === 'FinancialReport' ? r.white : g.lightText
      case 'editMenu':
        return this.props.active === 'editMenu' ? r.white : g.lightText
      case 'more':
        return this.props.active === 'more' ? r.white : g.lightText
      default:
        return g.lightText
    }
  }

  render() {
    return (
      <View style={[g.tabbar, g.bgPrimaryDark, r.rtl, r.topP3]}>

        <Button 
          style={[r.center]}
          androidStyle={[r.full]}
          ripple={'#ffffff11'}
          expandableRipple
          onPress={this.props.active !== 'home' ? () => {
            this.props.navigator.resetTo({
              screen: 'Home',
              animationType: 'fade'
            })
          } : null}
        >
          <Icon name={'logo'} size={iconSize + 3} style={[this.color('home')]}/>
          <Text size={titleSize} height={22} lineHeight={23} style={[r.white, r.centerText]}>
            خانه
          </Text>
        </Button>

        <Button 
          style={[r.center]}
          androidStyle={[r.full]}
          ripple={'#ffffff11'}
          expandableRipple
          onPress={this.props.active !== 'salesReport' ? () => {
            this.props.navigator.push({
              screen: 'SalesReport',
              animationType: 'fade'
            })
          } : null}
        >
          <Icon name={'page'} size={iconSize} style={this.color('salesReport')}/>
          <Text size={titleSize} height={22} lineHeight={23} style={[r.white]}>
            گزارش فروش
          </Text>
        </Button>

        <Button 
          style={[r.center]}
          androidStyle={[r.full]}
          ripple={'#ffffff11'}
          expandableRipple
          onPress={this.props.active !== 'FinancialReport' ? () => {
            this.props.navigator.push({
              screen: 'FinancialReport',
              animationType: 'fade'
            })
          } : null}
        >
          <Icon name={'layers'} size={iconSize} style={this.color('FinancialReport')}/>
          <Text size={titleSize} height={22} lineHeight={23} style={[r.white]}>
            گزارش مالی
          </Text>
        </Button>

        <Button 
          style={[r.center]}
          androidStyle={[r.full]}
          ripple={'#ffffff11'}
          expandableRipple
          onPress={this.props.active !== 'editMenu' ? () => {
            this.props.navigator.push({
              screen: 'EditMenu',
              animationType: 'fade'
            })
          } : null}
        >
          <Icon name={'restaurant'} size={iconSize} style={this.color('editMenu')}/>
          <Text size={titleSize} height={22} lineHeight={23} style={[r.white]}>
            ویرایش منو
          </Text>
        </Button>

        <Button 
          style={[r.center]}
          androidStyle={[r.full]}
          ripple={'#ffffff11'}
          expandableRipple
          onPress={
            this.props.active !== 'more' ? () => {
              this.props.navigator.push({
                screen: 'More',
                animationType: 'fade'
              })
            } : this.props.childOfMore ? () => { // now the childs of 'More' will pop back on 'More' tab press
              this.props.navigator.pop()
            } : null
          }
        >
          <View>
            <Icon name={'more'} size={iconSize} style={[this.color('more')]}/>
            <Text size={titleSize} height={22} lineHeight={23} style={[r.centerText, r.white]}>
              بیشتر
            </Text>

            {this.props.notificationCount && ( // make it null if there is no count number
              <View 
                style={[r.absolute, g.bgRedLight, r.round20, r.center, {
                  minWidth: 20, height: 20, right: -12, top: -3 }
                ]}
              >
                <Text
                  size={13}
                  height={12}
                  lineHeight={19}
                  includefontPadding={false}
                  style={[r.centerText, r.white, { writingDirection: 'ltr' }]}
                >
                  {this.props.notificationCount}
                </Text>
              </View>
            )}
          </View>

        </Button>

      </View>
    )
  }
}
