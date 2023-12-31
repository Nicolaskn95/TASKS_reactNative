import React, { Component } from 'react'
import commomStyles from '../commomStyles';
import TodayImage from '../../assets/imgs/today.jpg'
import tommorowImage from '../../assets/imgs/tomorrow.jpg'
import weekImage from '../../assets/imgs/week.jpg'
import monthImage from '../../assets/imgs/month.jpg'
import Icon from 'react-native-vector-icons/FontAwesome'
import moment from 'moment';
import 'moment/locale/pt_br'
import AddTask from './AddTask';
import Task from '../components/Task';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'react-native-axios'
import {server, showError} from '../common'

import { 
    Text, 
    SafeAreaView, 
    View, 
    StyleSheet, 
    ImageBackground, 
    FlatList, 
    TouchableOpacity, 
    Platform,
    Alert 
} from 'react-native'

const initialState = {
        showAddTask: false,
        visibleTasks: [],
        showDoneTasks: true,
        tasks: []
}

export default class TaskList extends Component {
    state = {
        ...initialState
    }

    componentDidMount = async () => {
       const stateString = await AsyncStorage.getItem('taskState')
       const savedState = JSON.parse(stateString) || initialState
       this.setState({
        showDoneTasks: savedState.showDoneTasks,
       }, this.filterTasks)

       this.loadTasks()
    }

    loadTasks = async() => {
        try {
            const maxDate = moment()
            .add({days: this.props.daysAhead})
            .format('YYYY-MM-DD 23:59:59')
            const res = await axios.get(`${server}/tasks?date=${maxDate}`)
            console.log('Dados recebidos do servidor:', res.data);
            this.setState({tasks: res.data}, this.filterTasks)
        } catch (e) {
            showError(e)
        }
    }

    toggleFilter = () => {
        this.setState({showDoneTasks: !this.state.showDoneTasks}, this.filterTasks)
    }

    filterTasks = () => {
        let visibleTasks = null
        if(this.state.showDoneTasks) {
            visibleTasks = [...this.state.tasks]
        } else {
            const pending = task => task.doneAt === null
            visibleTasks = this.state.tasks.filter(pending)
        }
        this.setState({visibleTasks})
        AsyncStorage.setItem('taskState', JSON.stringify({
            showDoneTasks: this.state.showDoneTasks
        }))
    }

    toggleTask = async taskId => {
        try {
            await axios.put(`${server}/tasks/${taskId}/toggle`) ///tasks/:id/toggle'
            await this.loadTasks()
        } catch (e) {
            showError(e)
        }
    }

    addTask = async (newTask) => {
        if(!newTask.desc || !newTask.desc.trim()) {
            Alert.alert('Dados inválidos', 'Descrição não informada!')
            return
        }

        try {
            await axios.post(`${server}/tasks`,{
                desc: newTask.desc,
                estimateAt: newTask.date
            })
            
            this.setState({showAddTask: false}, this.loadTasks)
        } catch (e) {
            showError(e)
        }
}

    deleteTask = async id => {
        try {
            await axios.delete(`${server}/tasks/${id}`) //tasks/:id
            this.loadTasks()
        } catch (e) {
            showError(e)
        }
    }

    getImage = () => {
        switch(this.props.daysAhead) {
            case 0: return TodayImage
            case 1: return tommorowImage
            case 7: return weekImage
            default: return monthImage 
        }
    }

    getColor = () => {
        switch(this.props.daysAhead) {
            case 0: return commomStyles.colors.today
            case 1: return commomStyles.colors.tomorrow
            case 7: return commomStyles.colors.week
            default: return commomStyles.colors.month 
        }
    }
    
    render() {
        
        const today = moment().locale('pt_br').format('ddd, D [de] MMMM')
        return(
            <SafeAreaView style={styles.container}>
            <AddTask 
                isVisible={this.state.showAddTask}
                onCancel={() => this.setState({showAddTask: false})}
                onSave={this.addTask}
            />
            <ImageBackground source={this.getImage()}
                style={styles.background}>
                <View style={styles.iconBar}>
                    <TouchableOpacity onPress={this.toggleFilter}>
                        <Icon 
                            name={this.state.showDoneTasks ? 'eye' : 'eye-slash'} 
                            size={20}
                            color={commomStyles.colors.secondary}
                        />
                    </TouchableOpacity>
                </View>
                <View style={styles.titleBar}>
                    <Text style={styles.title}>{this.props.title}</Text>
                    <Text style={styles.subtitle}>{today}</Text>
                </View>
            </ImageBackground>
            <View style={styles.taskContainer}>
                <FlatList 
                    data={this.state.visibleTasks}
                    keyExtractor={item => `${item.id}`}
                    renderItem={({item}) => <Task {...item} onToggleTask={this.toggleTask} onDelete={this.deleteTask}/>}
                />
            </View>
            <TouchableOpacity 
                style={[styles.addButton, {backgroundColor: this.getColor()}]}
                onPress={() => this.setState({showAddTask: true})}
                activeOpacity={0.7}    
            >
                <Icon name='plus' size={20} color={commomStyles.colors.secondary}/>
            </TouchableOpacity>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    background: {
        flex: 3
    },

    taskContainer:{
        flex: 7
    },

    titleBar: {
        flex: 1,
        justifyContent: 'flex-end'
    },

    title : {
        fontFamily: commomStyles.fontFamily,
        fontSize: 50,
        color: commomStyles.colors.secondary,
        marginLeft: 20,
        marginBottom: 20
    },
    subtitle: {
        fontFamily: commomStyles.fontFamily,
        color: commomStyles.colors.secondary,
        fontSize: 20,
        marginLeft: 20,
        marginBottom: 30
    },
    iconBar: {
        flexDirection: 'row',
        marginHorizontal: 20,
        justifyContent: 'flex-end',
        marginTop: Platform.OS === 'ios' ? 30 : 10
    }, 
    addButton : {
        position: 'absolute',
        right: 30,
        bottom: 30,
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: commomStyles.colors.today,
        justifyContent: 'center',
        alignItems: 'center'
    }
})