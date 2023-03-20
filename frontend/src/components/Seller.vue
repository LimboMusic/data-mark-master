<template>
  <div class="seller-wrapper">
    <div class="container" ref="seller_container"></div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'MySeller',
  data() {
    return {
      sellerInstance: null,
      data: null,
      currentPage: 1,
      totalPage: 0,
      timer: null
    }
  },
  computed:{
    ...mapState(['theme'])
  },
  watch:{
    theme(){
      this.sellerInstance.dispose()
      this.initCharts()
      this.updateCharts()
      this.screenAdapter()
    }
  },
  async mounted() {
    this.initCharts()
    // await this.getData()
    this.$socket.send({
      action: 'getData',
      socketType: 'sellerData',
      chartName: 'seller',
      value: ''
    })
    window.addEventListener('resize', this.screenAdapter)
    this.screenAdapter()
  },
  created() {
    this.$socket.registerCallBack('sellerData', this.getData)
  },
  destroyed() {
    // 销毁组件时 移除监听事件和interval事件
    if (this.timer) clearInterval(this.timer)
    window.removeEventListener('resize', this.screenAdapter)
    this.$socket.unregisterCallBack('sellerData')
  },
  methods: {
    initCharts() {
      this.sellerInstance = this.$echarts.init(this.$refs.seller_container, this.theme)
      // 监听鼠标事件
      this.sellerInstance.on('mouseover', () => {
        if (this.timer) clearInterval(this.timer)
      })
      this.sellerInstance.on('mouseout', () => {
        this.startInterval()
      })
      // 初始化option
      const option = {
        title: {
          text: '▍ 商家销售统计',
          left: 20,
          top: 20
        },
        grid: {
          top: '20%',
          left: '5%',
          right: '6%',
          bottom: '5%',
          containLabel: true // 距离包含坐标轴上的文字
        },
        xAxis: {
          type: 'value'
        },
        yAxis: {
          type: 'category'
        },
        tooltip: { // 背景颜色
          trigger: 'axis', // 鼠标移入坐标轴时触发tip
          axisPointer: {
            type: 'line',
            z: 0,
            lineStyle: {
              color: '#2d3443'
            }
          }
        },
        series: [
          {
            type: 'bar',
            label: {
              show: true, // 显示数值
              position: 'right',
              fontStyle: {
                color: 'white' // 数值颜色为白色
              }
            },
            itemStyle: {
              color: new this.$echarts.graphic.LinearGradient(0, 0, 1, 0, [ // 颜色渐变 方向(0,0)->(1,0)
                // 百分之0时的颜色
                {
                  offset: 0,
                  color: '#5052EE'
                },
                // 百分之100时的颜色
                {
                  offset: 1,
                  color: '#ab6ee5'
                }
              ])

            }
          }
        ]
      }
      this.sellerInstance.setOption(option)
    },
    async getData(data) {
      // const res = await this.$http.get('seller')
      // this.data = res.data
      this.data = data
      this.data.sort((a, b) => a.value - b.value)
      this.totalPage = this.data.length % 5 === 0 ? this.data.length / 5 : this.data.length / 5 + 1
      this.updateCharts()
      this.startInterval()
    },
    updateCharts() {
      const start = (this.currentPage - 1) * 5
      const end = this.currentPage * 5
      const data = this.data.slice(start, end)
      const sellerName = data.map(item => item.name)
      const sellerValue = data.map(item => item.value)
      const option = {
        yAxis: {
          data: sellerName
        },
        series: [
          {
            data: sellerValue
          }
        ]
      }
      this.sellerInstance.setOption(option)
    },
    startInterval() {
      this.timer = setInterval(() => {
        this.currentPage++
        if (this.currentPage > this.totalPage) this.currentPage = 1
        this.updateCharts()
      }, 3000)
    },
    // 当浏览器视口大小发生变化时触发的事件,完成屏幕适配
    screenAdapter() {
      // console.log(this.$refs.seller_container.offsetWidth)
      const titleFontSize = this.$refs.seller_container.offsetWidth / 100 * 3.6
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize
          }
        },
        tooltip: {
          axisPointer: {
            lineStyle: {
              width: titleFontSize
            }
          }
        },
        series: [
          {
            barWidth: titleFontSize,
            itemStyle: {
              barBorderRadius: [0, titleFontSize / 2, titleFontSize / 2, 0] // 圆角
            }
          }
        ]
      }
      this.sellerInstance.setOption(adapterOption)
      // 手动调用图标的resize方法
      this.sellerInstance.resize()
    }
  }
}
</script>

<style scoped lang="less">
.seller-wrapper {
  height: 100%;
  width: 100%;
  overflow: hidden;

  .container {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
}
</style>
