import type { AppRouteModule } from '/@/router/types'

import { LAYOUT } from '/@/router/constant'
import { t } from '/@/hooks/web/useI18n'

const markdown: AppRouteModule = {
  path: '/markdown',
  name: 'Markdown',
  component: LAYOUT,
  redirect: '/markdown/list',
  meta: {
    // hideChildrenInMenu: true,
    icon: 'simple-icons:about-dot-me',
    title: 'markdown',
  },
  children: [
    {
      path: 'create',
      name: 'createArticle',
      component: () => import('/@/views/editor/markdown/create.vue'),
      meta: {
        title: t('routes.dashboard.about'),
        icon: 'simple-icons:about-dot-me',
        // hideMenu: true,
      },
    },
    {
      path: 'edit/:id',
      name: 'editArticle',
      component: () => import('/@/views/editor/markdown/edit.vue'),
      meta: {
        title: t('routes.dashboard.about'),
        icon: 'simple-icons:about-dot-me',
        // hideMenu: true,
      },
    },
    {
      path: 'list',
      name: 'article-list',
      component: () => import('/@/views/editor/markdown/list.vue'),
      meta: {
        title: t('routes.dashboard.about'),
        icon: 'simple-icons:about-dot-me',
        // hideMenu: true,
      },
    },
  ],
}

export default markdown
