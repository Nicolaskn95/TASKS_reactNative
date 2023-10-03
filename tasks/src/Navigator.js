import React from 'react'
import {NavigationContainer} from '@react-navigation/native'

import Auth from './screens/Auth'
import TaskList from './screens/TaskList'

const MainRoutes = {
    Auth: {
        name: 'Auth',
        screen: Auth
    },
    Home: {
        name: 'Home',
        screen: TaskList
    }
}



const AppNavigator = props => {
    const isAuth = useSelector(state => !!state.auth.access_token);

    return (
        <NavigationContainer>
            { isAuth && <MyCustomNavigator/>}
            { !isAuth && <AuthNavigator/>}
        </NavigationContainer>
    );
};
export default AppNavigator;