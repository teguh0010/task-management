import { createRouter, createWebHistory } from 'vue-router';

import Todos from './views/Todos.vue';
import Home from './views/Home.vue';
import MainView from './views/MainView.vue';
import Categories from './views/Categories.vue';
import Profile from './views/Profile.vue';


import {  RouteRecordRaw } from 'vue-router';

import { getCurrentUserFromServerSide } from './utils/auth';


const routes: Array<RouteRecordRaw> = [
  {
    path: '/main-view',
    component: MainView,
    meta: { requiresAuth: true },
    children: [
      { path: '/todos', component: Todos, meta: { requiresAuth: true } },
      { path: '/categories', component: Categories, meta: { requiresAuth: true } },
      { path: '/profile', component: Profile, meta: { requiresAuth: true } }
    ]
  },
  { path: '/', component: Home, meta: { redirectIfAuthorized: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  if (to.matched.some((record) => record.meta.redirectIfAuthorized)) {
    if (await getCurrentUserFromServerSide()) next('/main-view');
    else next();
  } else if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (await getCurrentUserFromServerSide()) next();
    else next('/');
  } else next();
});

export default router;
