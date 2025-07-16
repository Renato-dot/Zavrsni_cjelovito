import Home from './pages/Home.vue'
import ExternalLinks from './pages/ExternalLinks.vue'
import FieldListings from './pages/FieldListings.vue'
import Login from './pages/Login.vue'
import Register from './pages/Register.vue'
import Settings from './pages/Settings.vue'
import Search from './pages/Search.vue'

export default [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/external-links',
    name: 'external-links',
    component: ExternalLinks
  },
  {
    path: '/field-listings',
    name: 'field-listings',
    component: FieldListings
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/register',
    name: 'register',
    component: Register
  },
  {
    path: '/settings',
    name: 'settings',
    component: Settings
  },
  {
    path: '/search',
    name: 'search',
    component: Search
  }
]