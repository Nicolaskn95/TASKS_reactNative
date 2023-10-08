import React, { Component } from 'react'
import commomStyles from '../commomStyles';
import TodayImage from '../../assets/imgs/today.jpg'
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
            const maxDate = moment().format('YYYY-MM-DD 23:59:59')
            const res = await axios.get(`${server}/tasks?date=${maxDate}`)
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

    toggleTask = taskId => {
        const tasks = [...this.state.tasks]
        tasks.forEach(task => {
            if(task.id === taskId) {
                task.doneAt = task.doneAt ? null: new Date()
            }
        })
        this.setState({tasks: tasks}, this.filterTasks)
    }

    addTask = (newTask) => {
        if(!newTask.desc || !newTask.desc.trim()) {
            Alert.alert('Dados inválidos', 'Descrição não informada!')
            return
        }

        const tasks = [...this.state.tasks]
        tasks.push({
            id: Math.random(),
            desc: newTask.desc,
            estimateAt: newTask.date,
            doneAt: null
        })
        this.setState({tasks, showAddTask: false}, this.filterTasks)
}

    deleteTask = id => {
        const tasks = this.state.tasks.filter(task => task.id !== id)
        this.setState({tasks}, this.filterTasks)
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
            <ImageBackground source={TodayImage}
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
                    <Text style={styles.title}>Hoje</Text>
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
                style={styles.addButton}
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