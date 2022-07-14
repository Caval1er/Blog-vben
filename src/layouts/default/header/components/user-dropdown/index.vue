<template>
  <a-dropdown placement="bottomLeft" :overlayClassName="`${prefixCls}-dropdown-overlay`">
    <span :class="[prefixCls, `${prefixCls}--${theme}`]" class="flex">
      <img :class="`${prefixCls}__header`" :src="getUserInfo.avatar" />
      <span :class="`${prefixCls}__info hidden md:block`">
        <span :class="`${prefixCls}__name  `" class="truncate">
          {{ getUserInfo.realName }}
        </span>
      </span>
    </span>

    <template #overlay>
      <a-menu @click="handleMenuClick">
        <a-menu-item key="doc" v-if="getShowDoc"
          ><span>文档<Icon icon="ion:document-text-outline" /></span
        ></a-menu-item>
        <MenuDivider v-if="getShowDoc" />
        <a-menu-item v-if="getUseLockPage" key="lock"
          ><span>锁定屏幕 </span><Icon icon="ion:lock-closed-outline" />
        </a-menu-item>
        <MenuDivider v-if="getShowDoc" />
        <a-menu-item key="logout"
          ><span>{{ t('layout.header.dropdownItemLoginOut') }} </span
          ><Icon icon="ion:power-outline"
        /></a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
  <LockAction @register="register" />
</template>
<script lang="ts">
// components
import { Menu } from 'ant-design-vue'

import { defineComponent, computed } from 'vue'

import { DOC_URL } from '/@/settings/siteSetting'

import { useUserStore } from '/@/store/modules/user'
import { useHeaderSetting } from '/@/hooks/setting/useHeaderSetting'
import { useI18n } from '/@/hooks/web/useI18n'
import { useDesign } from '/@/hooks/web/useDesign'
import { useModal } from '/@/components/Modal'

import headerImg from '/@/assets/images/header.jpg'
import { propTypes } from '/@/utils/propTypes'
import { openWindow } from '/@/utils'

import { createAsyncComponent } from '/@/utils/factory/createAsyncComponent'

type MenuEvent = 'logout' | 'doc' | 'lock'

export default defineComponent({
  name: 'UserDropdown',
  components: {
    MenuDivider: Menu.Divider,
    LockAction: createAsyncComponent(() => import('../lock/LockModal.vue')),
  },
  props: {
    theme: propTypes.oneOf(['dark', 'light']),
  },
  setup() {
    const { prefixCls } = useDesign('header-user-dropdown')
    const { t } = useI18n()
    const { getShowDoc, getUseLockPage } = useHeaderSetting()
    const userStore = useUserStore()

    const getUserInfo = computed(() => {
      const { realName = '', avatar, desc } = userStore.getUserInfo || {}
      return { realName, avatar: avatar || headerImg, desc }
    })

    const [register, { openModal }] = useModal()

    function handleLock() {
      openModal(true)
    }

    //  login out
    function handleLoginOut() {
      userStore.confirmLoginOut()
    }

    // open doc
    function openDoc() {
      openWindow(DOC_URL)
    }

    function handleMenuClick(e: { key: MenuEvent }) {
      switch (e.key) {
        case 'logout':
          handleLoginOut()
          break
        case 'doc':
          openDoc()
          break
        case 'lock':
          handleLock()
          break
      }
    }

    return {
      prefixCls,
      t,
      getUserInfo,
      handleMenuClick,
      getShowDoc,
      register,
      getUseLockPage,
    }
  },
})
</script>
<style lang="less">
@prefix-cls: ~'@{namespace}-header-user-dropdown';

.@{prefix-cls} {
  height: @header-height;
  padding: 0 0 0 10px;
  padding-right: 10px;
  overflow: hidden;
  font-size: 12px;
  cursor: pointer;
  align-items: center;

  img {
    width: 24px;
    height: 24px;
    margin-right: 12px;
  }

  &__header {
    border-radius: 50%;
  }

  &__name {
    font-size: 14px;
  }

  &--dark {
    &:hover {
      background-color: @header-dark-bg-hover-color;
    }
  }

  &--light {
    &:hover {
      background-color: @header-light-bg-hover-color;
    }

    .@{prefix-cls}__name {
      color: @text-color-base;
    }

    .@{prefix-cls}__desc {
      color: @header-light-desc-color;
    }
  }

  &-dropdown-overlay {
    .ant-dropdown-menu-item {
      min-width: 160px;
    }
    .ant-dropdown-menu-title-content {
      display: flex;
      align-items: center;
      gap: 2px;
    }
  }
}
</style>
