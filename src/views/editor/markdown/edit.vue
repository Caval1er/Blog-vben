<template>
  <div class="article-edit-container">
    <ArticleDetail :is-edit="true" />
  </div>
</template>

<script setup lang="ts" name="editArticle">
import ArticleDetail from './components/ArticleDetail.vue'
</script>

<style lang="less" scoped></style>
