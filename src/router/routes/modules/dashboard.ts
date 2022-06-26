import type { AppRouteModule } from '/@/router/types'

import { LAYOUT } from '/@/router/constant'
import { t } from '/@/hooks/web/useI18n'

const dashboard: AppRouteModule = {
  path: '/dashboard',
  name: 'Dashboard',
  component: LAYOUT,
  redirect: '/dashboard/homepage',
  meta: {
    orderNo: 1,
    icon: 'ion:grid-outline',
    title: t('routes.dashboard.dashboard'),
  },
  children: [
    {
      path: 'homepage',
      name: 'Homepage',
      component: () => import('/@/views/dashboard/index.vue'),
      meta: {
        title: 'homepage',
        icon: 'bx:home-circle',
      },
    },
  ],
}

export default dashboard
