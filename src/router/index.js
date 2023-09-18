import Math_Scrabble from '../views/Math-Scrabble.vue'
import About from '../views/About.vue'
import Practice from '../views/Practice.vue'
import {createRouter , createWebHistory} from 'vue-router'

const routes = [
    {path: '/', name: 'Math-Scrabble',component: Math_Scrabble},
    {path: '/about', name: 'About',component: About},
    {path: '/practice', name:'Practice',component:Practice}
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router