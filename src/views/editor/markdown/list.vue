<template>
  <div class="article-list-container">
    <a-table :columns="columns" :data-source="data">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'title'">
          <span>
            {{ record.title }}
          </span>
          <router-link :to="'/markdown/edit/' + record.id">进入</router-link>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
const columns = reactive([
  {
    title: 'Title',
    dataIndex: 'title',
    key: 'title',
  },
])

const data = reactive([
  {
    id: 1,
    title: '我的第一篇文章',
  },
])
</script>

<style lang="less" scoped></style>
