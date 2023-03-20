<template>
  <div class="trend-wrapper">
    <div class="title" :style="comStyle">
      <span>{{ title }}</span>
      <span class="iconfont" :style='comStyle' @click="showSelect = !showSelect">&#xe6eb;</span>
      <div class="select-list" v-show="showSelect">
        <div class="select-item" v-for="item in selectTypes" :key="item.key" @click="handleSelect(item)">{{ item.text }}
        </div>
      </div>
    </div>
    <div class="container" ref="trend_container"></div>
  </div>
</template>

<script>
import { getThemeValue } from '@/utils/theme_util'
import { mapState } from 'vuex'
export default {
  name: 'myTrend',
  data() {
    return {
      trendInstance: null,
      data: null,
      showSelect: false,
      selectType: 'map', // 显示数据的类型
      width: 0
    }
  },
  computed: {
    selectTypes() {
      if (!this.data) return []
      return this.data.type.filter(item => item.key !== this.selectType)
    },
    title() {
      if (!this.data) return ''
      return this.data[this.selectType].title
    },
    comStyle() {
      if (!this.width) return {}
      return {
        fontSize: this.width / 100 * 3.6 + 'px',
        color: getThemeValue(this.theme).titleColor
      }
    },
    ...mapState(['theme'])
  },
  watch: {
    theme() {
      this.trendInstance.dispose()
      this.initCharts()
      this.updateCharts()
      this.screenAdapter()
    }
  },
  methods: {
    initCharts() {
      this.trendInstance = this.$echarts.init(this.$refs.trend_container, this.theme)
      const initOption = {
        xAxis: {
          type: 'category',
          boundaryGap: false // 取消x轴坐标的间隙
        },
        tooltip: {
          trigger: 'axis' // 鼠标移入坐标轴时提示数值
        },
        yAxis: {
          type: 'value'
        },
        grid: {
          top: '35%',
          left: '3%',
          bottom: '1%',
          right: '4%',
          containLabel: true
        },
        legend: {
          left: 20,
          top: '15%',
          icon: 'circle'
        }
      }
      this.trendInstance.setOption(initOption)
    },
    async getData(data) {
      // const res = await this.$http.get('trend')
      this.data = data
      this.updateCharts()
    },
    updateCharts() {
      // 半透明的颜色值
      const colorArr1 = [
        'rgba(11, 168, 44, 0.5)',
        'rgba(44, 110, 255, 0.5)',
        'rgba(22, 242, 217, 0.5)',
        'rgba(254, 33, 30, 0.5)',
        'rgba(250, 105, 0, 0.5)'
      ]
      // 全透明的颜色值
      const colorArr2 = [
        'rgba(11, 168, 44, 0)',
        'rgba(44, 110, 255, 0)',
        'rgba(22, 242, 217, 0)',
        'rgba(254, 33, 30, 0)',
        'rgba(250, 105, 0, 0)'
      ]
      // x轴的数据
      const monthArr = this.data.common.month
      // y轴的数据
      const valueArr = this.data[this.selectType].data
      const seriesArr = valueArr.map((item, index) => ({
        name: item.name,
        type: 'line',
        data: item.data,
        stack: this.selectType, // 以堆叠图模式展示
        areaStyle: {
          color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: colorArr1[index]
            },
            {
              offset: 1,
              color: colorArr2[index]
            }
          ])
        }
      }))
      // 图例的数据
      const legendArr = valueArr.map(item => item.name)
      const updateOption = {
        xAxis: {
          data: monthArr // 月份
        },
        series: seriesArr, // 销量
        legend: {
          data: legendArr
        }
      }
      this.trendInstance.setOption(updateOption)
    },
    screenAdapter() {
      this.width = this.$refs.trend_container.offsetWidth
      const fontSize = this.width / 100 * 3.6
      const adapterOption = {
        legend: {
          itemWidth: fontSize,
          itemHight: fontSize,
          itemGap: fontSize,
          textStyle: {
            fontSize: fontSize / 2
          }
        }
      }
      this.trendInstance.setOption(adapterOption)
      this.trendInstance.resize()
    },
    handleSelect(item) {
      this.selectType = item.key
      this.updateCharts()
      this.showSelect = false
    }
  },
  mounted() {
    this.initCharts()
    // this.getData()
    // 发送数据给服务器
    this.$socket.send({
      action: 'getData',
      socketType: 'trendData',
      chartName: 'trend',
      value: ''
    })
    this.screenAdapter()
    window.addEventListener('resize', this.screenAdapter)
  },
  created() {
    // 组件创建之后 注册回调函数
    this.$socket.registerCallBack('trendData', this.getData)
  },
  destroyed() {
    window.removeEventListener('resize', this.screenAdapter)
    this.$socket.unregisterCallBack('trendData')
  }
}
</script>

<style scoped lang="less">
.trend-wrapper {
  height: 100%;
  width: 100%;
  overflow: hidden;
  position: relative;

  .container {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  .title {
    position: absolute;
    z-index: 10;
    color: white;
    top: 20px;
    left: 40px;

    .iconfont {
      margin-left: 10px;
      cursor: pointer;
    }

    .select-list {
      background-color: #222733;
    }
  }
}
</style>
