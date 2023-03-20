<template>
    <div class="trend-wrapper">
        <div class="container" ref="trend_container"></div>
    </div>
</template>

<script>
export default {
  name: 'myNormal',
  data () {
    return {
      trendInstance: null,
      data: null
    }
  },
  methods: {
    initCharts () {
      this.trendInstance = this.$echarts.init(this.$refs.trend_container)
      const initOption = {}
      this.trendInstance.setOption(initOption)
    },
    async getData () {
      const res = await this.$http.get('/api/trend')
      this.data = res.data
      this.updateCharts()
    },
    updateCharts () {
      const updateOption = {}
      this.trendInstance.setOption(updateOption)
    },
    screenAdapter () {
      const adapterOption = {}
      this.trendInstance.setOption(adapterOption)
      this.trendInstance.resize()
    }
  },
  mounted () {
    this.initCharts()
    this.getData()
    this.screenAdapter()
    window.addEventListener('resize', this.screenAdapter)
  },
  destroyed () {
    window.removeEventListener('resize', this.screenAdapter)
  }
}
</script>

<style scoped lang="less">
.trend-wrapper{
    height: 100%;
    width: 100%;
    overflow: hidden;

    .container{
        width: 100%;
        height: 100%;
        overflow: hidden;
    }
}
</style>
