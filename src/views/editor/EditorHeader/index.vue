<template>
  <div class="editor-header">
    <div class="editor-header-fixed">
      <a-page-header
        :title="props.title ? props.title : ''"
        @back="goArticleList"
        class="editor-page-header"
      >
        <template #tags>
          <slot name="tags"><a-tag color="blue">tags</a-tag></slot>
        </template>
        <template #extra>
          <div class="date-container">
            <slot name="date"></slot>
          </div>
          <div class="actions-container">
            <slot name="actions">actions</slot>
          </div>
        </template>
      </a-page-header>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGo } from '/@/hooks/web/usePage'
const props = defineProps({
  title: {
    type: String,
    default: 'Title',
  },
})
const go = useGo()
const goArticleList = () => {
  go('/article/list')
}
</script>

<style lang="less" scoped>
html[data-theme='dark'] {
  .editor-header {
    background-color: #151515;
  }
}
.editor-header {
  height: 35px;
  position: relative;
  z-index: 100;
  padding: 0 10px;
  box-sizing: border-box;
  .editor-header-fixed {
    z-index: 1000;
    width: 100%;
    height: 35px;
    display: flex;
    align-items: center;
    .editor-page-header {
      width: 100%;
      padding: 0;
      :deep(.ant-page-header-heading) {
        .ant-page-header-heading-left {
          margin: 0;
          .ant-page-header-heading-title {
            font-size: 22px;
          }
        }
        .ant-page-header-heading-extra {
          margin: 0;
        }
        .ant-page-header-heading-extra {
          display: flex;
          align-items: center;
        }
      }
    }
  }
}
</style>
