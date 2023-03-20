
<template>
  <div class="hot-page-wrapper">
    <hot></hot>
  </div>
</template>

<script>

import Hot from '@/components/Hot'
export default {
  data() {
    return {}
  },
  methods: {},
  components: {
    hot: Hot
  }
}
</script>

<style lang="less" scoped>
.hot-page-wrapper {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
}
</style>
