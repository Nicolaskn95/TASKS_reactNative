import React from 'react'
import { View, Text, StyleSheet, TouchableWithoutFeedback,TouchableOpacity } from 'react-native'
import Swipeable from 'react-native-gesture-handler/Swipeable'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import commomStyles from '../commomStyles'
import Icon from 'react-native-vector-icons/FontAwesome'
import moment from 'moment'
import 'moment/locale/pt_br'

export default props => {

    const doneOrNotStyle = props.doneAt != null ? {textDecorationLine: 'line-through'} : {}

    const date = props.doneAt ? props.doneAt : props.estimateAt
    const formattedDate = moment(date).local('pt_br').format('dddd, D [de] MMMM')

    const getRightContent = () => {
        return (
            <TouchableOpacity style={styles.right} onPress={() => props.onDelete && props.onDelete(props.id)}>
                <Icon name='trash' size={30} color='#fff' />
            </TouchableOpacity>
        )
    }

    const getLeftContent = () => {
        return (
            <TouchableOpacity style={styles.left}>
                <Icon name='trash' size={20} color='#fff' style={styles.excludeIcon}/>
                <Text style={styles.excludeText}>Exluir</Text>
            </TouchableOpacity>
        )
    }


    return (
<GestureHandlerRootView>
    <Swipeable
        renderRightActions={getRightContent}
        renderLeftActions={getLeftContent}
        onSwipeableOpen={() => props.onDelete && props.onDelete(props.id)}
    >
        <View style={styles.container}>
            <TouchableWithoutFeedback 
                onPress={() => props.onToggleTask(props.id)}
            >
                <View style={styles.checkContainer}>
                    {getCheckView(props.doneAt)}
                </View>
            </TouchableWithoutFeedback>
            <View>
                <Text style={[styles.desc, doneOrNotStyle]}>{props.desc}</Text>
                <Text style={styles.date}>{formattedDate}</Text>
                {/* <Text>{props.doneAt + ''}</Text> */}
            </View>
        </View>
    </Swipeable>
</GestureHandlerRootView>
    )
}

function getCheckView(doneAt) {
    if(doneAt != null){
        return (
            <View style={styles.done}>
                <Icon 
                    name='check' 
                    size={20} 
                    color={'white'}
                />
            </View>
        )
    } else {
        return (
            <View style={styles.pending}>
                
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        borderColor: '#AAA',
        borderBottomWidth: 1,
        alignItems: 'center',
        paddingVertical: 10,
        backgroundColor: 'white'
    },

    checkContainer: {
        width: '20%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    pending: {
        height: 25,
        width: 25,
        borderRadius: 13,
        borderWidth: 1,
        borderColor: '#555'
    },
    done: {
        height: 25,
        width: 25,
        borderRadius: 13,
        backgroundColor: '#4D7031',
        alignItems: 'center',
        justifyContent: 'center'
    }, 
    desc: {
        fontFamily: commomStyles.fontFamily,
        color: commomStyles.colors.mainText,
        fontSize: 15,    
        fontWeight: 'bold'    
    },
    date: {
        fontFamily: commomStyles.fontFamily,
        color: commomStyles.colors.subText
    },
    right: {
        backgroundColor: 'red',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingHorizontal: 20
    },
    left: {
        flex:1,
        backgroundColor: 'red',
        flexDirection: 'row',
        alignItems: 'center',    
    },
    excludeText: {
        fontFamily: commomStyles.fontFamily,
        color: 'white',
        fontSize: 20,
        margin: 10

    },
    excludeIcon: {
        marginLeft: 10
    }
})