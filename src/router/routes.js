
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') },
      { path: 'dashboard', component: () => import('pages/Dashboard.vue') }, 
      { path: 'options', component: () => import('pages/Options.vue') },
      { path: 'about', component: () => import('pages/About.vue') },
      { path: 'focus', component: () => import('pages/Focus.vue') },
    ]
  },
  { path: '/config',component: () => import('pages/Config.vue')},
  { path: '/popup',component: () => import('pages/Popup.vue')},

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
