<template>
  <div class="rank-page-wrapper">
    <rank></rank>
  </div>
</template>

<script>
import Rank from '@/components/Rank'
export default {
  data () {
    return {}
  },
  methods: {},
  components: {
    rank: Rank
  }
}
</script>

<style scoped lang="less">
.rank-page-wrapper{
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: relative;
}
</style>
