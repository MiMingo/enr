import Vue from 'vue'
import App from './app.vue'
import Index from './routes/index.vue'
import NotFound from './routes/404.vue'

// Use Vue-Bootstrap
import BootstrapVue from 'bootstrap-vue'
Vue.use(BootstrapVue)
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

// Use Vue-Router
// vue-router: for single-page routing
import VueRouter from 'vue-router'
Vue.use(VueRouter)

// Register Routes
const routes = [
  { path: '', component: Index },
  { path: '*', component: NotFound }
]

const router = new VueRouter({ routes, mode: 'history' })

new Vue({
  render: createEle => createEle(App),
  router, // register VueRouter globally
}).$mount("#app")