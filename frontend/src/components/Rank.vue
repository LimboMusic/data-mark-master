<!-- 地区销售排行 -->
<template>
  <div class='rank-wrapper'>
    <div class='container' ref='rank_ref'></div>
  </div>
</template>

<script>
import {mapState} from 'vuex'
export default {
  name: 'myRank',
  data() {
    return {
      chartInstance: null,
      data: null,
      startValue: 0, // 区域缩放的起点值
      endValue: 9, // 区域缩放的重点值
      timer: null,
      fontSize: 0,
    }
  },
  methods: {
    initCharts() {
      this.chartInstance = this.$echarts.init(this.$refs.rank_ref, this.theme)
      const initOption = {
        title: {
          text: '▍ 地区销售排行',
          left: 20,
          top: 20,
        },
        tooltip: {
          show: true,
        },
        grid: {
          top: '40%',
          left: '10%',
          right: '5%',
          bottom: '10%',
          containLable: true,
        },
        xAxis: {
          type: 'category'
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            type: 'bar'
          }
        ]
      }
      this.chartInstance.setOption(initOption)
      // 鼠标移入时停止动画
      this.chartInstance.on('mouseover', () => {
        clearInterval(this.timer)
      })
      // 鼠标移出时开始动画
      this.chartInstance.on('mouseout', () => {
        this.startInterval()
      })
    },
    async getData(data) {
      // const res = await this.$http.get('rank')
      // console.log(res)
      // this.data = res.data
      this.data = data
      this.data.sort((a, b) => b.value - a.value)
      this.updateCharts()
    },
    updateCharts() {
      const colorArr = [
        ['#0ba82c', '#4ff778'],
        ['#2e72bf', '#23e5e5'],
        ['#5052ee', '#ab6ee5']
      ]
      // 所有省份的名字
      const provinceArr = this.data.map(item => item.name)
      // 所有省份的数据
      const valueArr = this.data.map(item => item.value)
      const updateOption = {
        xAxis: {
          data: provinceArr
        },
        series: {
          data: valueArr,
          itemStyle: {
            color: (arg) => {
              let targetArr = null
              if (arg.value > 200) {
                targetArr = colorArr[0]
              } else if (arg.value > 150) {
                targetArr = colorArr[1]
              } else {
                targetArr = colorArr[2]
              }
              return new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: targetArr[0]
                },
                {
                  offset: 1,
                  color: targetArr[1]
                }
              ])
            }
          }
        },
        dataZoom: {
          show: false,
          startValue: this.startValue,
          endValue: this.endValue,
        }
      }
      this.chartInstance.setOption(updateOption)
    },
    screenAdapter() {
      this.fontSize = this.$refs.rank_ref.offsetWidth / 100 * 3.6
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: this.fontSize
          }
        },
        series: [
          {
            barWidth: this.fontSize,
            itemStyle: {
              barBorderRadius: [this.fontSize / 2, this.fontSize / 2, 0, 0]
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
        this.startValue++
        this.endValue++
        if (this.endValue >= this.data.length) {
          this.endValue = 9
          this.startValue = 0
        }
        this.updateCharts()
      }, 2000)
    },
    stopInterval() {

    }
  },
  computed:{
    ...mapState(['theme'])
  },
  watch:{
    theme() {
      this.chartInstance.dispose()
      this.initCharts()
      this.updateCharts()
      this.screenAdapter()
    }
  }, 
  created() {
    this.$socket.registerCallBack('rankData',this.getData)
  },
  mounted() {
    this.initCharts()
    // this.getData()
    this.$socket.send({
      action: 'getData',
      socketType: 'rankData',
      chartName: 'rank',
      value: ''
    })
    this.screenAdapter()
    this.startInterval()
    window.addEventListener('resize', this.screenAdapter)
  },
  destroyed() {
    window.removeEventListener('resize', this.screenAdapter)
    clearInterval(this.timer)
    this.$socket.unregisterCallBack('rankData')
  }
}
</script>

<style scoped lang="less">
.rank-wrapper {
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
