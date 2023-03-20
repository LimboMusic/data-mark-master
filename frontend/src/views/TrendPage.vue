<template>
    <div class="trend-page-wrapper">
        <Trend></Trend>
    </div>
</template>

<script>
import Trend from '@/components/Trend.vue'
export default {
  components: {
    Trend
  },
  data () {
    return {

    }
  }
}
</script>

<style scoped lang="less">
.trend-page-wrapper{
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: relative;
}
</style>
