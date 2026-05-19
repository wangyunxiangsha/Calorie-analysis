import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '../views/LoginView.vue';
import LayoutView from '../views/LayoutView.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/login', name: 'login', component: LoginView },
    {
      path: '/',
      component: LayoutView,
      meta: { requiresAuth: true },
      children: [
        { path: '', redirect: '/dashboard' },
        {
          path: 'dashboard',
          name: 'dashboard',
          component: () => import('../views/DashboardView.vue'),
        },
        {
          path: 'foods',
          name: 'foods',
          component: () => import('../views/FoodsView.vue'),
        },
        {
          path: 'modes',
          name: 'modes',
          component: () => import('../views/ModesView.vue'),
        },
        {
          path: 'recognition-feedback',
          name: 'recognition-feedback',
          component: () => import('../views/RecognitionFeedbackView.vue'),
        },
      ],
    },
  ],
});

router.beforeEach((to) => {
  const token = localStorage.getItem('admin_token');
  if (to.meta.requiresAuth && !token) return { name: 'login' };
  if (to.name === 'login' && token) return { path: '/dashboard' };
});

export default router;
