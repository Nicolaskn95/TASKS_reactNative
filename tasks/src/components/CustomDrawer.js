import React from 'react'
import { Text, View, StyleSheet, Platform, TouchableOpacity } from 'react-native'
import { DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer'
import Gravatar from '@krosben/react-native-gravatar'
import commomStyles from '../commomStyles'
import axios from 'react-native-axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Icon from 'react-native-vector-icons/FontAwesome'

const CustomDrawer = (props) => {

    const logout = () => {
        delete axios.defaults.headers.common['Authorization']
        AsyncStorage.removeItem('userData')
        props.navigation.navigate('Auth')
    }

    return(
        <DrawerContentScrollView {...props}>
            <View style={styles.header}>
            <Text style={styles.title}>TASKS</Text>
            <View style={{marginLeft: 10, padding: 5}}>
                <Gravatar size={100} defaultImage='mm'   style={{marginLeft:20}}
                    options= {{
                        email: props.route.params.email,
                        secure: true
                    }}
                />
            </View>
                <View style={styles.userInfo}>
                    <Text style={styles.name}>{props.route.params.name}</Text>
                    <Text style={styles.email}>{props.route.params.email}</Text>
                </View>
                <TouchableOpacity onPress={logout}>
                    <View style={styles.iconSignOut}>
                        <Icon name='sign-out' size={30} color='#800'/>
                    </View>
                </TouchableOpacity>
            </View>
            <DrawerItemList {...props}/>
        </DrawerContentScrollView>
    )
}

export default CustomDrawer

const styles = StyleSheet.create ({
    header: {
        borderBottomWidth: 1,
        borderColor: '#DDD'
    },
    avatar: {
        width: 80,
        height: 60,
        borderWidth: 3,
        borderRadius: 30,
        margin: 30,
    },
    title: {
        color: '#000',
        fontFamily: commomStyles.fontFamily,
        fontSize: 30,
        paddingTop: 30,
        padding: 10,
        marginTop: Platform.OS === 'ios' ? 70: 0
    },
    userInfo: {
        marginLeft:10,
        
    },
    email: {
        fontFamily: commomStyles.fontFamily,
        fontSize: 15,
        color: commomStyles.colors.subText,
        marginBottom:10
    },
    name:{
        fontFamily: commomStyles.fontFamily,
        fontSize: 20,
        marginBottom: 5,
        color: commomStyles.colors.mainText,
        marginBottom: 5
    },
    iconSignOut : {
        marginLeft: 10,
        marginBottom: 10
    }
})