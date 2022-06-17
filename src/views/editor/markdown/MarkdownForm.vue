<template>
  <div class="markdown-form">
    <Markdown />
    <a-button type="primary" @click="showDrawer">Open</a-button>
    <a-drawer
      v-model:visible="visible"
      class="markdown-form-drawer"
      title="发布文章"
      :width="width"
      placement="right"
      :closable="false"
    >
      <a-form :model="formData" :rules="rules" :label-col="{ style: { width: '40px' } }">
        <a-form-item name="title" :rules="[{ validator: checkTitle }]">
          <MDInput v-model:value="formData.title" type="text">Title</MDInput>
        </a-form-item>
        <a-row :gutter="16">
          <a-col :span="16">
            <a-form-item name="author">
              <MDInput v-model:value="formData.author" type="text" :disabled="!authorDisabled"
                >Author</MDInput
              >
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <div class="markdown-author-modify">
              <a-switch
                v-model:checked="authorDisabled"
                checked-children="可修改"
                un-checked-children="不可修改"
              />
            </div>
          </a-col>
        </a-row>
        <a-form-item name="publish" :rules="[{ validator: checkPublish }]">
          <MDInput type="datePicker" v-model:value="formData.publish">Date</MDInput>
        </a-form-item>
      </a-form>
      <template #extra>
        <a-space>
          <a-button>Cancel</a-button>
          <a-button type="primary">Submit</a-button>
        </a-space>
      </template>
    </a-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
// 组件
import Markdown from '/@/components/Markdown/src/Markdown.vue'
import MDInput from '/@/components/MDinput/index.vue'
// 变量
import type { Rule } from 'ant-design-vue/es/form'
const visible = ref<boolean>(false)
const width = ref<Number>(500)

// 表单数据
const formData = reactive<Record<string, any>>({
  title: '第一篇markdown文章',
  publish: null,
  author: 'zjh',
  content: '',
})
const rules: Record<string, Rule[]> = {}
const checkTitle = (_: any, value: String) => {
  if (value !== '') {
    return Promise.resolve()
  }
  return Promise.reject(new Error('标题为必填项'))
}
const checkPublish = (_: any, value: any) => {
  if (value !== null) {
    return Promise.resolve()
  }
  return Promise.reject(new Error('发布日期为必填项'))
}
let authorDisabled = ref<boolean>(true)
//抽屉
const showDrawer = () => {
  visible.value = true
}
</script>

<style lang="less" scoped>
.markdown-form-drawer {
  .markdown-author-modify {
    position: absolute;
    bottom: 25px;
  }
}
</style>
