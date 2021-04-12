import React from 'react'
import { View } from 'react-native'
import { Icon } from './font'
import { ButtonLight } from './button'
import Loading from './loading'
import EmptyList from './emptyList'
import * as r from '../styles/rinc'

export default ListFooter = props => {
  if(props.items) {
    return (
      <View style={[r.center, r.wFull, r.bottomM10, { height: 60 }]}>
        {(props.items.length >= 10 || props.loading) && (
          <ButtonLight
            style={[r.round30, r.center, { width: 80, height: 40 }]}
            onPress={props.onPress}
          >
          {console.log('LIST FOOTER NEW ITEMS TO BE ADDED ', props.items)}
          {props.loading ? (
            <Loading /> 
          ) : (
            <Icon 
              name={'right'} 
              size={16} 
              style={[r.rotate90, r.white, r.centerText, { width: 13 }]} 
            />
          )}
          </ButtonLight>
        )}
    
        {/* {!props.loading && props.items.length === 0 && <EmptyList />} */}
        {/* <EmptyList /> */}
      </View>
    )
  } else {
    return (
      <View style={[r.center, r.wFull, r.bottomM10, { height: 60 }]}>
        <EmptyList />
      </View>
    )
  }
}