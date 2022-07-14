import type { AppRouteModule } from '/@/router/types'

import { LAYOUT } from '/@/router/constant'

const markdown: AppRouteModule = {
  path: '/article',
  name: 'Article',
  component: LAYOUT,
  redirect: '/article/list',
  meta: {
    // hideChildrenInMenu: true,
    icon: 'ri:article-line',
    title: 'Article',
    orderNo: 2,
  },
  children: [
    {
      path: 'list',
      name: 'article-list',
      component: () => import('/@/views/editor/markdown/list.vue'),
      meta: {
        title: 'List',
        icon: 'ant-design:unordered-list-outlined',
        // hideMenu: true,
      },
    },
    {
      path: 'create',
      name: 'createArticle',
      component: () => import('/@/views/editor/markdown/create.vue'),
      meta: {
        title: 'Create',
        icon: 'akar-icons:edit',
        // hideMenu: true,
      },
    },
    {
      path: 'edit/:id',
      name: 'editArticle',
      component: () => import('/@/views/editor/markdown/edit.vue'),
      meta: {
        title: 'Edit',
        icon: 'akar-icons:edit',
        hideMenu: true,
        currentActiveMenu: '/article/list',
        ignoreKeepAlive: true,
      },
    },
  ],
}

export default markdown
