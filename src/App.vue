<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
/*解决jsonlint的tips语法提示被dialog遮罩层挡住的问题，需要将样式写在全局style中，在scope中不生效（tips的div是body的子盒子，鼠标移动到错误位置才会出现）*/
/*该css样式在node_modules/codemirror/addon/lint/lint.css中*/
.el-popup-parent--hidden .CodeMirror-lint-tooltip {
  z-index: 9999;
}

/* 解决codemirror鼠标匹配内容没有高亮显示的问题*/
.cm-matchhighlight {
  background-color: yellow;
}

.CodeMirror-selection-highlight-scrollbar {
  background-color: green;
}

#app {
  overflow-y: hidden;
}

</style>
