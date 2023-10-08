import React, { Component } from 'react'
import Auth from './screens/Auth'
import TaskList from './screens/TaskList'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

const Stack = createNativeStackNavigator()
export default class Navigator extends Component {
    
    render () {
        
        return(
        <NavigationContainer>
        <Stack.Navigator initialRouteName='Auth' screenOptions={{headerShown: false}}>
            <Stack.Screen name="TaskList" component={TaskList}/>
            <Stack.Screen name="Auth" component={Auth}/>
        </Stack.Navigator>
      </NavigationContainer>
    )
  }
}