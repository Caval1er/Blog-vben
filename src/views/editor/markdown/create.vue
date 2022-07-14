<template>
  <div class="article-edit-container">
    <ArticleDetail :is-edit="false" />
  </div>
</template>

<script setup lang="ts" name="createArticle">
import ArticleDetail from './components/ArticleDetail.vue'
</script>

<style lang="less" scoped></style>
