<template>
  <div class="markdown-form">
    <EditorHeader :title="formData.title">
      <template #actions>
        <a-popconfirm v-if="props.isEdit" title="确定删除文章吗？" @confirm="confirmDelArticle">
          <a-button type="primary" class="editor-header-button" danger
            ><Icon icon="fluent:delete-12-regular" :size="25"
          /></a-button>
        </a-popconfirm>
        <a-popconfirm title="确定清除文章内容吗？" @confirm="confirmClearArticle">
          <a-button type="primary" class="editor-header-button" danger
            ><Icon icon="bx:reset" :size="25"
          /></a-button>
        </a-popconfirm>
        <a-button type="primary" @click="showForm" class="editor-header-button"
          ><Icon icon="ic:round-publish" :size="25"
        /></a-button>
      </template>
    </EditorHeader>
    <Markdown v-model:value="formData.content" @get="getMarkdownInstace" />
    <a-drawer
      v-model:visible="visible"
      class="markdown-form-drawer"
      title="发布文章"
      :width="width"
      placement="right"
      :closable="false"
      @afterVisibleChange="handleDrawerOpen"
    >
      <a-form :label-col="{ style: { width: '40px' } }">
        <a-form-item name="title" v-bind="validateInfos.title">
          <MDInput v-model:value="formData.title" type="text" :is-autofocus="true">Title</MDInput>
        </a-form-item>
        <a-row :gutter="16">
          <a-col :span="16">
            <a-form-item name="author" v-bind="validateInfos.author">
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
        <a-form-item name="publish" v-bind="validateInfos.publish">
          <MDInput type="datePicker" v-model:value="formData.publish">Date</MDInput>
        </a-form-item>
      </a-form>
      <template #extra>
        <a-space>
          <a-popconfirm title="确定重置表单内容吗？" @confirm="confirmClearForm">
            <a-button type="primary" danger><Icon icon="bx:reset" :size="25" /></a-button>
          </a-popconfirm>
          <a-popconfirm title="确定上传文章吗？" @confirm="confirmPublish">
            <a-button type="primary"><Icon icon="ic:round-publish" :size="25" /></a-button>
          </a-popconfirm>
        </a-space>
      </template>
    </a-drawer>
    <Loading :loading="loading" :absolute="props.absolute" tip="Loading" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useMessage } from '/@/hooks/web/useMessage'
import dayjs from 'dayjs'
// 组件
import { Form } from 'ant-design-vue'
import Markdown from '/@/components/Markdown/src/Markdown.vue'
import MDInput from '/@/components/MDinput/index.vue'
import EditorHeader from '/@/views/editor/EditorHeader/index.vue'
import Icon from '/@/components/Icon/src/Icon.vue'
import { Loading } from '/@/components/Loading'
// 变量
import type { Rule } from 'ant-design-vue/es/form'
import { SingleArticleModel } from '/@/api/sys/model/articleModel'
import { getSingleArticle, editSingleArticle, createSingleArticle } from '/@/api/sys/article'
const props = defineProps({
  isEdit: { type: Boolean, default: false },
  absolute: {
    type: Boolean,
    default: true,
  },
})
const route = useRoute()

const { createMessage } = useMessage()
const visible = ref<boolean>(false)
const width = ref<Number>(500)
let timeout
let resetFormData
const markdownInstance = ref()
const loading = ref(false)
onMounted(() => {
  if (props.isEdit) {
    loading.value = true
    getSingleArticle(Number(route.params.id))
      .then((res) => {
        formData = Object.assign(formData, res)
        resetFormData = Object.assign({}, formData)
        loading.value = false
      })
      .catch((err) => {
        loading.value = false
        console.log(err)
      })
  }
})
onUnmounted(() => {
  if (!props.isEdit) {
    clearInterval(timeout)
  }
})
const getMarkdownInstace = (instance) => {
  markdownInstance.value = instance
  instance.focus()
}
const useForm = Form.useForm
let formData = reactive<SingleArticleModel>({
  title: '',
  publish: '',
  author: 'zjh',
  content: '',
})
const validateContent = async (_rule: Rule, value: string) => {
  if (value === '\n' || value === '') {
    return Promise.reject('文档内容不能为空')
  } else {
    return Promise.resolve()
  }
}
const rules = reactive<Record<string, Rule[]>>({
  title: [
    {
      required: true,
      message: '标题为必填项',
    },
    {
      min: 4,
      max: 15,
      message: '长度必须是4~15个字符',
      trigger: 'blur',
    },
  ],
  publish: [{ required: true, message: '发表时间为必填项', trigger: 'blur' }],
  author: [{ required: true, message: '作者为必填项' }],
  content: [
    {
      required: true,
      message: '文档为必填项',
    },
    {
      validator: validateContent,
    },
    {
      min: 1,
      message: '文档字数必须大于1',
      trigger: 'blur',
    },
  ],
})
const { resetFields, validate, validateInfos } = useForm(formData, rules)

const handleSubmit = () => {
  validate()
    .then(async () => {
      //调用发送文章的api
      try {
        if (props.isEdit) {
          await editSingleArticle(Number(route.params.id), formData)
        } else {
          await createSingleArticle(formData)
        }
      } catch (error) {
        console.log(error)
      } finally {
        resetFields()
        visible.value = false
        createMessage.success('文章上传成功', 2)
      }
      // 提示用户继续编辑还是回到文章列表
    })
    .catch((err) => {
      console.log('error', err)
      const contentResult = err.errorFields.find((item) => item.name === 'content')

      if (contentResult) {
        createMessage.error('文章发表失败，文档不能为空', 2)
      } else {
        createMessage.error('文章发表失败', 2)
      }
    })
}

let authorDisabled = ref<boolean>(false)
//抽屉
const showForm = () => {
  visible.value = true
}
const handleDrawerOpen = (visible: boolean) => {
  if (!props.isEdit) {
    if (visible) {
      formData.publish = dayjs().format('YYYY-MM-DD HH:mm:ss')
      timeout = setInterval(() => (formData.publish = dayjs().format('YYYY-MM-DD HH:mm:ss')), 1000)
    } else {
      clearInterval(timeout)
    }
  }
}
//气泡弹出框
const confirmClearArticle = () => {
  return new Promise((resolve) => {
    formData.content = ''
    resolve(true)
    createMessage.success('文档已清空', 1)
  })
}

const confirmClearForm = () => {
  return new Promise((resolve) => {
    // resetFields(['title'])
    if (!props.isEdit) {
      formData.title = ''
      formData.content = ''
      formData.publish = dayjs().format('YYYY-MM-DD HH:mm:ss')
    } else {
      formData = Object.assign(formData, resetFormData)
    }
    resolve(true)
    createMessage.success('表单内容清空', 1)
  })
}

const confirmPublish = () => {
  return new Promise(async (resolve, reject) => {
    try {
      await handleSubmit()
      resolve(true)
    } catch (error) {
      reject(error)
    }
  })
}

const confirmDelArticle = () => {
  return new Promise(async (resolve, reject) => {
    try {
      //执行删除文章api
      resolve(true)
    } catch (error) {
      reject(error)
    }
  })
}
</script>

<style lang="less">
html[data-theme='dark'] {
  .markdown-form-drawer {
    .ant-drawer-content-wrapper {
      background-color: #fff;
      .ant-drawer-content {
        background-color: #fff;
      }
      .ant-drawer-header {
        color: inherit;
        border-bottom: 1px solid #f0f0f0;
        background-color: #fff;
        .ant-drawer-title {
          color: rgba(0, 0, 0, 0.85);
        }
      }
      .ant-picker-input {
        input {
          color: rgba(0, 0, 0, 0.85);
          border: 0;
          &:focus {
            box-shadow: none;
          }
        }
        .ant-picker-suffix {
          color: rgba(0, 0, 0, 0.25);
        }
      }
    }
  }
}
</style>
<style lang="less" scoped>
.markdown-form-drawer {
  .markdown-author-modify {
    position: absolute;
    bottom: 25px;
  }
}
.editor-header-button {
  margin-right: 15px;
}
</style>
