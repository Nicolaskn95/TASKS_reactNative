import React, { Component } from 'react'
import Auth from './screens/Auth'
import TaskList from './screens/TaskList'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

const Stack = createNativeStackNavigator()
const isSignedIn = false
export default class Navigator extends Component {
    
    render () {
        
        return(
        <NavigationContainer>
        <Stack.Navigator screenOptions={{headerShown: false}}>
          {isSignedIn ? (
            // No token found, user isn't signed in
            <Stack.Screen name="TaskList" component={TaskList}/>
          ) : (
            // User is signed in
            <Stack.Screen name="Auth" component={Auth}/>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    )
  }
}