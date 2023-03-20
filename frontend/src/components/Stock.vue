<template>
  <div class="stock-wrapper">
    <div class="container" ref="stock_container"></div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'myStock',
  computed: {
    ...mapState(['theme'])
  },
  watch: {
    theme() {
      this.chartInstance.dispose()
      this.initCharts()
      this.updateCharts()
      this.screenAdapter()
    }
  },
  data() {
    return {
      chartInstance: null,
      data: null,
      currentIndex: 0,
      timer: null,
      fontSize: 0,
    }
  },
  methods: {
    initCharts() {
      this.chartInstance = this.$echarts.init(this.$refs.stock_container, this.theme)
      const initOption = {
        title: {
          text: '▍ 库存和销量分析',
          left: 20,
          top: 20
        }
      }
      this.chartInstance.setOption(initOption)
      this.chartInstance.on('mouseover', () => {
        clearInterval(this.timer)
      })
      this.chartInstance.on('mouseout', () => {
        this.startInterval()
      })
    },
    async getData(data) {
      // const res = await this.$http.get('stock')
      // console.log(res)
      // this.data = res.data
      this.data = data
      this.updateCharts()
    },
    updateCharts() {
      const centerArr = [
        ['18%', '40%'],
        ['50%', '40%'],
        ['82%', '40%'],
        ['34%', '75%'],
        ['66%', '75%']
      ]
      const colorArr = [
        ['#4FF778', '#0BA82C'],
        ['#E5DD45', '#E8B11C'],
        ['#E8821C', '#E55445'],
        ['#5052EE', '#AB6EE5'],
        ['#23E5E5', '#2E72BF']
      ]
      const start = this.currentIndex * 5
      const seriesArr = this.data.slice(start, start + 5).map((item, index) => ({
        type: 'pie',
        // radius: [110, 100], // 圆环形状的设置
        center: centerArr[index], // 设置位置
        hoverAnimation: false, // 关闭鼠标移入饼图时的动画
        labelLine: {
          show: false // 隐藏指示线
        },
        label: {
          position: 'center',
          color: colorArr[index][0]
        },
        data: [
          {
            name: item.name + '\n\n' + item.sales,
            value: item.sales,
            itemStyle: {
              color: new this.$echarts.graphic.LinearGradient(0, 1, 0, 0, [
                {
                  offset: 0,
                  color: colorArr[index][0]
                },
                {
                  offset: 1,
                  color: colorArr[index][1]
                }
              ])
            }
          },
          {
            value: item.stock,
            itemStyle: {
              color: '#333843'
            }
          }
        ]
      }))
      const updateOption = {
        series: seriesArr,
      }
      this.chartInstance.setOption(updateOption)
    },
    screenAdapter() {
      this.fontSize = this.$refs.stock_container.offsetWidth / 100 * 3.6
      const innerRadius = this.fontSize * 2.8
      const outterRadius = innerRadius * 1.25
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: this.fontSize,
          }
        },
        series: [
          {
            type: 'pie',
            radius: [innerRadius, outterRadius],
            label: {
              fontSize: this.fontSize / 2
            }
          },
          {
            type: 'pie',
            radius: [innerRadius, outterRadius],
            label: {
              fontSize: this.fontSize / 2
            }
          },
          {
            type: 'pie',
            radius: [innerRadius, outterRadius],
            label: {
              fontSize: this.fontSize / 2
            }
          },
          {
            type: 'pie',
            radius: [innerRadius, outterRadius],
            label: {
              fontSize: this.fontSize / 2
            }
          },
          {
            type: 'pie',
            radius: [innerRadius, outterRadius],
            label: {
              fontSize: this.fontSize / 2
            }
          }
        ]
      }
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize()
    },
    startInterval() {
      if (this.timer) clearInterval(this.timer)
      this.timer = setInterval(() => {
        this.currentIndex++
        if (this.currentIndex > 1) this.currentIndex = 0
        this.updateCharts()
      }, 2000)

    }
  },
  created() {
    this.$socket.registerCallBack('stockData', this.getData)
  },
  mounted() {
    this.initCharts()
    // this.getData()
    this.$socket.send({
      action: 'getData',
      socketType: 'stockData',
      chartName: 'stock',
      value: ''
    })
    this.screenAdapter()
    window.addEventListener('resize', this.screenAdapter)
    this.startInterval()
  },
  destroyed() {
    window.removeEventListener('resize', this.screenAdapter)
    if (this.timer) clearInterval(this.timer)
    this.$socket.unregisterCallBack('stockData')
  }
}
</script>

<style scoped lang="less">
.stock-wrapper {
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
