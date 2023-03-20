<template>
  <div class="stock-page-wrapper">
    <stock></stock>
  </div>
</template>

<script>
import Stock from '@/components/Stock'
export default {
  data () {
    return {}
  },
  methods: {},
  components: {
    stock: Stock
  }
}
</script>

<style lang="less" scoped>
.stock-page-wrapper{
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: relative;
}
</style>
