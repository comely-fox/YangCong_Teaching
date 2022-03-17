import './styles/reset.scss'
import { createApp, App } from 'vue'
import Root from './App.vue'
import store from './store'
import api from './request/index'


const app: App = createApp(Root)

app.use(api)

app.use(store).mount('#app')
