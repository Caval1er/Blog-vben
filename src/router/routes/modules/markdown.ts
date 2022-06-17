import type { AppRouteModule } from '/@/router/types'

import { LAYOUT } from '/@/router/constant'
import { t } from '/@/hooks/web/useI18n'

const markdown: AppRouteModule = {
  path: '/markdown',
  name: 'Markdown',
  component: LAYOUT,
  redirect: '/markdown/index',
  meta: {
    hideChildrenInMenu: true,
    icon: 'simple-icons:about-dot-me',
    title: 'markdown',
  },
  children: [
    {
      path: 'index',
      name: 'MarkdownPage',
      component: () => import('/@/views/editor/markdown/MarkdownForm.vue'),
      meta: {
        title: t('routes.dashboard.about'),
        icon: 'simple-icons:about-dot-me',
        hideMenu: true,
      },
    },
  ],
}

export default markdown
