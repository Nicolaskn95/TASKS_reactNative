import React, { Component } from 'react'
import {View, Text} from 'react-native'
import TaskList from './TaskList'
import { NavigationContainer } from '@react-navigation/native'
import {createDrawerNavigator} from '@react-navigation/drawer'
import CustomDrawer from '../components/CustomDrawer'

const Drawer = createDrawerNavigator()

export default props => {
    // console.warn(Object.keys(props))
    // console.warn(props.route.params.email)
    const params = props
    return(
      <Drawer.Navigator drawerContent={props => <CustomDrawer {...props} {...params}/>} screenOptions={{headerTransparent: true, headerTintColor: 'white', headerTitle:''}} initialRouteName='TaskList'>
        <Drawer.Screen name='Hoje'>
        {props => <TaskList daysAhead={0} title='Hoje' {...props}/>}
        </Drawer.Screen>
        <Drawer.Screen name='Amanhã'>
        {props => <TaskList daysAhead={1} title='Amanhã' {...props}/>} 
        </Drawer.Screen>
        <Drawer.Screen name='Semana'>
        {props => <TaskList daysAhead={7} title='Semana' {...props}/>}
        </Drawer.Screen>
        <Drawer.Screen name='Mês'>
        {props => <TaskList daysAhead={30} title='Mês' {...props}/>}
        </Drawer.Screen>

      </Drawer.Navigator>  
    )
}