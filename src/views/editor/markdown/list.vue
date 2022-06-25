<template>
  <div class="article-list-container">
    <a-table
      :columns="columns"
      :data-source="data"
      bordered
      @resizeColumn="handleResizeColumn"
      :row-class-name="(_record, index) => (index % 2 === 1 ? 'table-striped' : null)"
      class="ant-table-striped"
      :loading="loading"
    >
      <!-- <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'title'">
          <span>
            {{ record.title }}
          </span>
        </template>
        <template v-if="column.key === 'author'">
          <span>
            {{ record.author }}
          </span>
        </template>
        <template v-if="column.key === 'content'">
          <span>
            {{ record.content }}
          </span>
        </template>
      </template> -->
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'title'">
          <a>
            {{ record.title }}
          </a>
        </template>
        <template v-if="column.key === 'operation'">
          <div class="table-container-operation">
            <a-space>
              <a-button
                type="primary"
                class="editor-header-button"
                @click="handleEditArticle(record.id)"
                ><Icon icon="akar-icons:edit" :size="20"
              /></a-button>
              <a-popconfirm title="确定删除文章吗？" @confirm="hanldeDelArticle">
                <a-button type="primary" class="editor-header-button" danger
                  ><Icon icon="fluent:delete-12-regular" :size="20"
                /></a-button>
              </a-popconfirm>
            </a-space>
          </div>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted, ref } from 'vue'
import { useGo } from '/@/hooks/web/usePage'
import { getAllArticles } from '/@/api/sys/article'
import { ArticleListModel } from '/@/api/sys/model/articleModel'
const go = useGo()
const loading = ref(true)
onMounted(async () => {
  try {
    loading.value = true
    const articleList = await getAllArticles()
    data.push(...articleList)
  } catch (error) {
  } finally {
    loading.value = false
  }
})
const columns = reactive([
  {
    title: 'Title',
    dataIndex: 'title',
    key: 'title',
    resizable: true,
    width: 200,
    minWidth: 200,
    maxWidth: 350,
  },
  {
    title: 'Author',
    dataIndex: 'author',
    key: 'author',
    width: 100,
    minWidth: 100,
    maxWidth: 200,
    resizable: true,
  },
  {
    title: 'Content',
    dataIndex: 'content',
    key: 'content',
    ellipsis: true,
  },
  {
    title: 'Date',
    dataIndex: 'publish',
    key: 'date',
    width: 250,
  },
  {
    title: 'Operation',
    dataIndex: 'operation',
    key: 'operation',
    width: 300,
    fixed: 'right',
  },
])
const handleResizeColumn = (w, col) => {
  col.width = w
}
const data = reactive([] as ArticleListModel[])

const handleEditArticle = (id: number) => {
  go(`/article/edit/${id}`)
}
const hanldeDelArticle = () => {
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

<style lang="less" scoped>
.ant-table-striped :deep(.table-striped) td {
  background-color: #fafafa;
}
.table-container-operation {
  display: flex;
  justify-content: center;
}
</style>
