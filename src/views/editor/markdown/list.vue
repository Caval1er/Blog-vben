<template>
  <div class="article-list-container">
    <a-table
      :columns="columns"
      :data-source="dataSource?.list"
      bordered
      @resizeColumn="handleResizeColumn"
      :row-class-name="(_record, index) => (index % 2 === 1 ? 'table-striped' : null)"
      class="ant-table-striped"
      :loading="loading"
      :row-key="(record) => record.id"
      :pagination="pagination"
      @change="handleTableChange"
    >
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
import { reactive, computed } from 'vue'
import { useGo } from '/@/hooks/web/usePage'
import type { TableProps } from 'ant-design-vue'
import { usePagination } from 'vue-request'
import { getArticlesByLimit, deleteSingleArticle } from '/@/api/sys/article'
import { useMessage } from '/@/hooks/web/useMessage'
const { createMessage } = useMessage()
const go = useGo()

const columns = reactive([
  {
    title: 'Title',
    dataIndex: 'title',
    key: 'title',
    resizable: true,
    width: 200,
    minWidth: 200,
    maxWidth: 350,
    align: 'center',
  },
  {
    title: 'Author',
    dataIndex: 'author',
    key: 'author',
    width: 150,
    minWidth: 150,
    maxWidth: 200,
    resizable: true,
    align: 'center',
  },
  {
    title: 'Content',
    dataIndex: 'content',
    key: 'content',
    ellipsis: true,
    align: 'center',
  },
  {
    title: 'Date',
    dataIndex: 'publish',
    key: 'date',
    width: 250,
    align: 'center',
  },
  {
    title: 'Operation',
    dataIndex: 'operation',
    key: 'operation',
    width: 300,
    fixed: 'right',
    align: 'center',
  },
])
const handleResizeColumn = (w, col) => {
  col.width = w
}

const handleEditArticle = (id: number) => {
  go(`/article/edit/${id}`)
}
const hanldeDelArticle = () => {
  return new Promise(async (resolve, reject) => {
    try {
      //执行删除文章api
      await deleteSingleArticle(4)
      await run({
        page: current.value,
        pageSize: pageSize.value,
      })
      resolve(true)
      createMessage.success('文章已删除', 1)
    } catch (error) {
      reject(error)
    }
  })
}

const {
  data: dataSource,
  run,
  loading,
  current,
  pageSize,
  total,
} = usePagination(getArticlesByLimit, {
  pagination: {
    currentKey: 'page',
    pageSizeKey: 'pageSize',
    totalKey: 'total',
  },
})
const pagination = computed(() => ({
  total: total.value,
  current: current.value,
  pageSize: pageSize.value,
  position: ['topCenter'],
  showQuickJumper: true,
  // hideOnSinglePage: true,
  showTotal(total) {
    return `总共 ${total} 篇文章`
  },
}))

const handleTableChange: TableProps['onChange'] = (pag: { pageSize: number; current: number }) => {
  run({
    page: pag?.current,
    pageSize: pag.pageSize,
  })
}
</script>

<style lang="less" scoped>
.article-list-container {
  padding: 10px 20px;
}
.ant-table-striped :deep(.table-striped) td {
  background-color: #fafafa;
}
.table-container-operation {
  display: flex;
  justify-content: center;
}
</style>
