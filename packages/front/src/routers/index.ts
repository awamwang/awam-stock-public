import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import BoardView from '@/views/BoardView.vue'
import DingpanView from '@/views/board/DingpanView.vue'
import BeforeOpenView from '@/views/board/BeforeOpenView.vue'
import FupanView from '@/views/board/FupanView.vue'
import HistoryView from '@/views/board/HistoryView.vue'
import SettingView from '@/views/board/SettingView.vue'
import NoteView from '@/views/board/NoteView.vue'

import FocusedDepartmentView from '@/views/setting/FocusedDepartmentView.vue'
import StocksoftView from '@/views/setting/StocksoftView.vue'
import FeatureSettingView from '@/views/setting/FeatureView.vue'

const routes: Array<RouteRecordRaw> = [
  // {
  //   path: '/',
  //   name: 'home',
  //   component: () => import('../views/HomeView.vue'),
  // },
  {
    path: '/',
    name: 'home',
    redirect: '/board/ding-pan',
  },
  {
    path: '/set-code/:id(\\d+)',
    name: 'set-code',
    component: () => import('../views/SetCodeView.vue'),
    meta: {
      keepAlive: true,
    },
  },
  {
    path: '/board',
    name: 'board',
    component: BoardView,
    meta: {
      keepAlive: true,
    },
    children: [
      {
        path: 'ding-pan',
        name: 'ding-pan',
        component: DingpanView,
      },
      {
        path: 'before-open',
        name: 'before-open',
        component: BeforeOpenView,
      },
      {
        path: 'fu-pan',
        name: 'fu-pan',
        component: FupanView,
      },
      {
        path: 'history',
        name: 'history',
        component: HistoryView,
      },
      {
        path: 'setting',
        name: 'setting',
        component: SettingView,
        children: [
          {
            path: 'focusedDepartment',
            name: 'setting/focusedDepartment',
            component: FocusedDepartmentView,
          },
          {
            path: 'stocksoft',
            name: 'setting/stocksoft',
            component: StocksoftView,
          },
          {
            path: 'setting/system/feature',
            name: 'setting/system/feature',
            component: FeatureSettingView,
          },
        ],
      },
      {
        path: 'note',
        name: 'note',
        component: NoteView,
      },
    ],
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
