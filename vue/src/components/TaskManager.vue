<template>
  <div class="container">
    <h1>Task Manager</h1>
    <form @submit.prevent="addTask">
      <input v-model="newTask" placeholder="New task" />
      <button>Add</button>
    </form>
    <ul>
      <li v-for="task in tasks" :key="task.id">
        <input type="checkbox" v-model="task.completed" @change="updateTask(task)" />
        <span :class="{ done: task.completed }">{{ task.title }}</span>
        <button @click="deleteTask(task.id)">Delete</button>
      </li>
    </ul>
  </div>
</template>

<script setup>

import { ref, onMounted } from 'vue'
import axios from 'axios'

axios.defaults.baseURL = 'http://localhost:8000/api' // Laravel backend
const tasks = ref([])
const newTask = ref('')

const fetchTasks = async () => {
  const res = await axios.get('/tasks')
  tasks.value = res.data
}

const addTask = async () => {
  if (!newTask.value.trim()) return
  await axios.post('/tasks', { title: newTask.value })
  newTask.value = ''
  fetchTasks()
}

const updateTask = async (task) => {
  await axios.put(`/tasks/${task.id}`, task)
}

const deleteTask = async (id) => {
  await axios.delete(`/tasks/${id}`)
  fetchTasks()
}

onMounted(fetchTasks)
</script>

<style scoped>
.done {
  text-decoration: line-through;
}
</style>
