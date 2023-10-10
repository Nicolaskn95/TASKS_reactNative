import React, { Component } from 'react'
import Auth from './screens/Auth'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Drawer from './screens/DrawerTaskList'
import AuthOrApp from './screens/AuthOrApp'

const Stack = createNativeStackNavigator()


export default class Navigator extends Component {
    
    render () {
        
        return(
        <NavigationContainer>
        <Stack.Navigator initialRouteName='AuthOrApp' screenOptions={{headerShown: false}}>
            <Stack.Screen name='AuthOrApp' component={AuthOrApp} />
            <Stack.Screen name="Drawer" component={Drawer}/>
            <Stack.Screen name="Auth" component={Auth}/>
        </Stack.Navigator>
      </NavigationContainer>
    )
  }
}