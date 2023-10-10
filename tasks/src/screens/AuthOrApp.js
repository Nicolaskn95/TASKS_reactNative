import React, { Component } from 'react'
import axios from 'react-native-axios'
import AsyncStorage from '@react-native-async-storage/async-storage'

import {
    View,
    ActivityIndicator,
    StyleSheet
} from 'react-native'

export default class AuthOrApp extends Component {

    componentDidMount = async () => {
        const userDataJSON = await AsyncStorage.getItem('userData')
        let userData = null

        try {
            userData = JSON.parse(userDataJSON)
        } catch (e) {
            //userData esta invalido
            //TODO:
        }

        if (userData && userData.token) {
            axios.defaults.headers.common['Authorization'] = `bearer ${userData.token}`
            this.props.navigation.navigate('Drawer', userData)
        } else {
            this.props.navigation.navigate('Auth')
        }
    }


    render() {
        return (
            <View style={styles.container} >
                <ActivityIndicator size='large' color='#0000ff'/>
            </View>
        )
    } 
    
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#D3D3D3'
    }
})