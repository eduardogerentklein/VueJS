import Vue from 'vue'
import VueRouter from 'vue-router'

import Erro404 from './views/Erro404.vue'
import Login from './views/login/Login.vue'

import EventBus from './event-bus'

Vue.use(VueRouter)

const Contatos = () => import(/* webpackChunkName: "contatos" */'./views/contatos/Contatos.vue')
const ContatoEditar = () => import(/* webpackChunkName: "contatos" */'./views/contatos/ContatoEditar.vue')
const ContatoHome = () => import('./views/contatos/ContatoHome.vue')
const ContatoDetalhe = () => import(/* webpackChunkName: "contatos" */'./views/contatos/ContatoDetalhe.vue')
const Home = () => import(/* webpackChunkName: "contatos" */'./views/Home.vue')

const extractParameterId = (route) => ({
  id: +route.params.id
})

const router = new VueRouter({
  mode: 'history',
  linkActiveClass: 'active',
  scrollBehavior(to, from, savedPosition) {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (savedPosition) {
          return resolve(savedPosition)
        }
        if (to.hash){
          return resolve({
            selector: to.hash
          })
        }
        resolve({ x: 0, y: 0 })
      }, 3000);
    })
  },
  routes: [
    {
      path: '/contatos',
      alias: ['/meus-contatos', '/lista-de-contatos'],
      component: Contatos,
      props: (route) => {
        const busca = route.query.busca
        return busca ? { busca } : {}
      },
      children: [
        {
          path: ':id(\\d+)',
          component:
            ContatoDetalhe,
          name: 'contato',
          props: extractParameterId,
        },
        {
          // path: ':id(\\d+)/editar/:opcional?',
          // alias: ':id(\\d+)/alterar',
          path: ':id(\\d+)/editar',
          meta: {
            requerAutenticacao: true
          },
          beforeEnter: (to, from, next) => {
            console.log('beforeEnter')
            // next(false)
            //next(new Error(`Permissoes insuficientes para acessar o recurso "${to.fullPath}"`))
            next()
          },
          components: {
            default: ContatoEditar,
            'contato-detalhes': ContatoDetalhe
          },
          props: {
            default: true,
            'contato-detalhes': true
          },
          name: 'editarContato'
        },
        {
          path: '',
          component: ContatoHome,
          name: 'contatos',
          props: {
            default: true,
            'contato-detalhes': true
          }
        }
      ]
    },
    { path: '/home', component: Home },
    { path: '/login', component: Login },
    { path: '/', redirect: '/contatos' },
    {
      path: '*', component: Erro404
    }
  ]
})

router.beforeEach((to, from, next) => {
  console.log('beforeEach')
  console.log('Requer autenticacao? ', to.meta.requerAutenticacao)
  const estaAutenticado = EventBus.autenticado
  if (to.matched.some(rota => rota.meta.requerAutenticacao)){
    if (!estaAutenticado) {
      next({ 
        path: '/login', 
        redirecionar: to.fullPath 
      })
      return
    }
  }
  next()
})

router.beforeResolve((to, from, next) => {
  console.log('beforeResolve')
  next()
})

router.afterEach((/* to, from */) => {
  console.log('afterEach ')
})

router.onError(error => {
  console.log('Erro: ', error)
})

export default router