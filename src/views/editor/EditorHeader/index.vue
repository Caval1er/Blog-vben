<template>
  <div class="editor-header">
    <div class="editor-header-fixed">
      <a-row :gutter="16" type="flex" align="middle" class="editor-header-row">
        <a-col :span="12">
          <slot name="tags">tags</slot>
        </a-col>
        <a-col :span="12">
          <div class="actions-container">
            <slot name="actions">actions</slot>
          </div>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="less" scoped>
html[data-theme='dark'] {
  .editor-header {
    background-color: #151515;
  }
}
.editor-header {
  height: 35px;
  position: relative;
  z-index: 1000;
  .editor-header-fixed {
    position: absolute;
    z-index: 1000;
    width: 100%;
    height: 35px;
    .editor-header-row {
      height: 35px;
      margin: 0 !important;
      .actions-container {
        display: flex;
        justify-content: flex-end;
      }
    }
  }
}
</style>
