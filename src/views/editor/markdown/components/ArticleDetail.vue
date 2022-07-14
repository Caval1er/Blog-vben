<template>
  <div class="markdown-form">
    <EditorHeader :title="formData.title">
      <template #date>
        <div v-if="props.isEdit">
          createdAt
          <a-typography-text code>{{
            dayjs(formData.createdAt).format('YYYY-MM-DD HH:mm:ss')
          }}</a-typography-text>
          updatedAt
          <a-typography-text code>{{
            dayjs(formData.updatedAt).format('YYYY-MM-DD HH:mm:ss')
          }}</a-typography-text>
        </div>
      </template>
      <template #actions>
        <a-popconfirm v-if="props.isEdit" title="确定删除文章吗？" @confirm="confirmDelArticle">
          <a-button type="primary" class="editor-header-button" danger
            ><Icon icon="fluent:delete-12-regular" />删除</a-button
          >
        </a-popconfirm>
        <a-popconfirm title="确定清除文章内容吗？" @confirm="confirmClearArticle">
          <a-button type="primary" class="editor-header-button" danger
            ><Icon icon="bx:reset" />清空</a-button
          >
        </a-popconfirm>
        <a-button type="primary" @click="showForm" class="editor-header-button"
          ><Icon icon="ic:round-publish" />发布</a-button
        >
      </template>
      <template #tags>
        <a-tag v-for="tag in formData.tags" :key="tag._id">{{ tag.name }}</a-tag>
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
    >
      <a-form :label-col="{ style: { width: '40px' } }">
        <a-form-item name="title">
          <MDInput
            v-model:value="formData.title"
            type="text"
            :is-autofocus="true"
            :visible="visible"
            >Title</MDInput
          >
        </a-form-item>
        <a-form-item name="summary">
          <a-textarea v-model:value="formData.summary" placeholder="文章概要" auto-size
        /></a-form-item>
        <a-form-item-rest>
          <a-spin :spinning="tagState.loading">
            <div class="tags-container">
              <template v-for="tag in tags" :key="tag._id">
                <a-checkable-tag
                  :checked="isTagChecked(tag)"
                  @change="(checked) => handleChange(tag, checked)"
                  :style="{ borderColor: 'rgb(217, 217, 217)' }"
                >
                  {{ tag.name }}
                </a-checkable-tag> </template
              ><a-input
                v-if="tagState.inputVisible"
                ref="inputRef"
                v-model:value="tagState.inputValue"
                type="text"
                size="small"
                :style="{ width: '78px' }"
                @blur="handleInputConfirm"
                @keyup.enter="handleInputConfirm"
              />
              <a-tag v-else @click="showInput">
                <Icon icon="eos-icons:content-new" :style="{ cursor: 'pointer' }" />
              </a-tag>
            </div> </a-spin
        ></a-form-item-rest>
        <a-form-item class="error-infos" v-bind="errorInfos" />
      </a-form>
      <template #extra>
        <a-space>
          <a-popconfirm title="确定重置表单内容吗？" @confirm="confirmClearForm">
            <a-button type="primary" danger><Icon icon="bx:reset" />重置</a-button>
          </a-popconfirm>
          <a-popconfirm title="确定上传文章吗？" @confirm="confirmPublish">
            <a-button type="primary"><Icon icon="ic:round-publish" />发布</a-button>
          </a-popconfirm>
        </a-space>
      </template>
    </a-drawer>
    <Loading :loading="loading" :absolute="props.absolute" tip="Loading" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, computed, nextTick, onActivated } from 'vue'
import { useRoute } from 'vue-router'
import { useMessage } from '/@/hooks/web/useMessage'
import { useGo } from '/@/hooks/web/usePage'
// 组件
import { Form } from 'ant-design-vue'
import Markdown from '/@/components/Markdown/src/Markdown.vue'
import MDInput from '/@/components/MDinput/index.vue'
import EditorHeader from '/@/views/editor/EditorHeader/index.vue'
import Icon from '/@/components/Icon/src/Icon.vue'
import { Loading } from '/@/components/Loading'
// 变量
import type { Rule } from 'ant-design-vue/es/form'
import { toArray } from 'lodash-es'
import { SingleArticleModel, Tag, Tags } from '/@/api/sys/model/articleModel'
import {
  getSingleArticle,
  editSingleArticle,
  createSingleArticle,
  deleteSingleArticle,
  getAlltag,
  addTag,
} from '/@/api/sys/article'
import dayjs from 'dayjs'
import { cloneDeep } from 'lodash-es'
import { useUserStore } from '/@/store/modules/user'
const props = defineProps({
  isEdit: { type: Boolean, default: false },
  absolute: {
    type: Boolean,
    default: true,
  },
})
const route = useRoute()
const go = useGo()
const userStore = useUserStore()
const Message = useMessage().createMessage
const visible = ref<boolean>(false)
const width = ref<Number>(500)
let resetFormData
const markdownInstance = ref()
const loading = ref(false)
const tags = ref<Tags>([])
onMounted(async () => {
  if (props.isEdit) {
    try {
      loading.value = true
      const article = await getSingleArticle(route.params.id as string)
      formData = Object.assign(formData, article)
      resetFormData = cloneDeep(formData)
      const Tag = await getAlltag()
      tags.value = Tag.tags
    } catch (error) {
      console.log(error)
    } finally {
      loading.value = false
    }
  } else {
    try {
      loading.value = true
      const Tag = await getAlltag()
      tags.value = Tag.tags
    } catch (error) {
      console.log(error)
    } finally {
      loading.value = false
    }
  }
})
onActivated(async () => {
  try {
    tagState.loading = true
    const Tag = await getAlltag()
    tags.value = Tag.tags
    console.log(tags.value)
  } catch (error) {
    console.log(error)
  } finally {
    tagState.loading = false
  }
})
onUnmounted(() => {})
const getMarkdownInstace = (instance) => {
  markdownInstance.value = instance
  instance.focus()
}
const useForm = Form.useForm
let formData = reactive<SingleArticleModel>({
  _id: '',
  title: '',
  createdAt: '',
  updatedAt: '',
  author: userStore.userInfo!.realName,
  summary: '',
  content: '',
  tags: [],
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
      message: '标题:必填项',
    },
    {
      min: 2,
      max: 15,
      message: '标题:长度必须是2~15个字符',
      // trigger: 'blur',
    },
  ],
  content: [
    {
      required: true,
      message: '文档:必填项',
    },
    {
      validator: validateContent,
    },
  ],
})
const { resetFields, validate, validateInfos, mergeValidateInfo } = useForm(formData, rules)

const handleSubmit = () => {
  validate()
    .then(async () => {
      try {
        if (props.isEdit) {
          const articleModify = await editSingleArticle(route.params.id as string, formData)
          Object.assign(formData, articleModify)
          resetFormData = cloneDeep(formData)
        } else {
          await createSingleArticle(formData)
          resetFields()
        }
      } catch (error) {
        console.log(error)
      } finally {
        visible.value = false
        Message.success('文章上传成功', 2)
      }
      // 提示用户继续编辑还是回到文章列表 TODO
    })
    .catch((err) => {
      console.log('error', err)
      const contentResult = err.errorFields.find((item) => item.name === 'content')
      if (contentResult) {
        Message.error('文章发表失败，文档不能为空', 2)
      } else {
        Message.error('文章发表失败', 2)
      }
    })
}
const errorInfos = computed(() => {
  return mergeValidateInfo(toArray(validateInfos))
})

//抽屉
const showForm = () => {
  visible.value = true
}
//气泡弹出框
const confirmClearArticle = () => {
  return new Promise((resolve) => {
    formData.content = ''
    resolve(true)
    Message.success('文档已清空', 1)
  })
}

const confirmClearForm = () => {
  return new Promise((resolve) => {
    // resetFields(['title'])
    if (!props.isEdit) {
      resetFields()
    } else {
      Object.assign(formData, resetFormData)
    }
    resolve(true)
    Message.success('表单内容清空', 1)
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
      await deleteSingleArticle(route.params.id as string)
      resolve(true)
      Message.success('文章已删除', 1)
      go('/article/list')
    } catch (error) {
      reject(error)
    }
  })
}
const tagState = reactive({
  inputVisible: false,
  inputValue: '',
  loading: false,
})
const inputRef = ref()

const handleChange = (tag: Tag, checked: boolean) => {
  checked
    ? formData.tags.push(tag)
    : (formData.tags = formData.tags.filter((t) => t.name !== tag.name))
}
const isTagChecked = (tag: Tag) => {
  return formData.tags.some((item) => item.name === tag.name)
}
const handleInputConfirm = async () => {
  const inputValue = tagState.inputValue
  if (inputValue && tags.value.some((item) => item.name === inputValue)) {
    Message.error('标签不能重复！', 1)
  } else if (inputValue) {
    try {
      tagState.loading = true
      const tag = await addTag({
        name: inputValue,
      })
      formData.tags.push(tag)
      tags.value.push(tag)
      Message.success('添加标签成功', 1)
    } catch (error) {
      console.log(error)
    } finally {
      tagState.loading = false
    }
  }
  Object.assign(tagState, {
    inputVisible: false,
    inputValue: '',
  })
}
const showInput = () => {
  tagState.inputVisible = true
  nextTick(() => {
    inputRef.value.focus()
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

.tags-container {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
  .ant-tag {
    font-size: 16px;
    font-weight: 500;
    line-height: 30px;
  }
}
</style>
