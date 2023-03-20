<template>
  <div class="hot-wrapper">
    <div class="iconfont left" @click="toLeft" :style="comStyle">&#xe6ef;</div>
    <div class="container" ref="hot_container"></div>
    <div class="iconfont right" @click="toRight" :style="comStyle">&#xe6ed;</div>
    <div class="title" :style="comStyle">{{ title }}</div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getThemeValue } from '@/utils/theme_util'
export default {
  name: 'myHot',
  data() {
    return {
      trendInstance: null,
      data: null,
      selectIndex: 0,
      fontSize: 0,
    }
  },
  computed: {
    title() {
      if (!this.data) return ''
      return this.data[this.selectIndex].name
    },
    comStyle() {
      if (!this.fontSize) return ''
      return {
        fontSize: this.fontSize + 'px',
        color: getThemeValue(this.theme).titleColor
      }
    },
    ...mapState(['theme'])
  },
  watch: {
    theme() {
      // 销毁当前表
      this.trendInstance.dispose()
      this.initCharts()
      this.updateCharts()
      this.screenAdapter()
    }
  },
  methods: {
    initCharts() {
      this.trendInstance = this.$echarts.init(this.$refs.hot_container, this.theme)
      const initOption = {
        legend: {
          top: '13%',
          icon: 'circle'
        },
        tooltip: {
          show: true,
          formatter: (arg) => {
            // 获得三级分类的数据
            const thirdCatgory = arg.data.children
            const res = thirdCatgory.reduce((value, item) => {
              return value + item.value
            }, 0)
            let str = ''
            thirdCatgory.forEach(item => {
              str += `${item.name}:${parseInt(item.value / res * 100)}% 
              <br/>
              `
            })
            return str
          }
        },
        series: [
          {
            type: 'pie',
            label: { // 数值默认不显示
              show: false
            },
            emphasis: { // 高亮时显示
              label: {
                show: true
              },
              labelLine: {
                show: false
              }
            },
          },
        ],
        title: {
          text: '▍ 热销商品占比',
          left: 20,
          top: 20
        }
      }
      this.trendInstance.setOption(initOption)
    },
    async getData(data) {
      // const res = await this.$http.get('hotproduct')
      // console.log(res)
      // this.data = res.data
      this.data = data
      this.updateCharts()
    },
    updateCharts() {
      const seriesArr = this.data[this.selectIndex].children.map(item => ({
        name: item.name,
        value: item.value,
        children: item.children
      }))
      const legendArr = this.data[this.selectIndex].children.map(item => item.name)
      const updateOption = {
        series: [
          {
            data: seriesArr
          }
        ],
        legend: { // 图例
          data: legendArr
        }
      }
      this.trendInstance.setOption(updateOption)
    },
    screenAdapter() {
      this.fontSize = this.$refs.hot_container.offsetWidth / 100 * 3.6
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: this.fontSize
          }
        },
        series: [
          {
            radius: this.fontSize * 4.5,
            center: ['50%', '55%']
          }
        ],
        legend: { // 图例样式
          itemWidth: this.fontSize,
          itemHeight: this.fontSize,
          itemGap: this.fontSize,
          textStyle: {
            fontSize: this.fontSize / 2
          }
        }
      }
      this.trendInstance.setOption(adapterOption)
      this.trendInstance.resize()
    },
    toLeft() {
      this.selectIndex--
      if (this.selectIndex < 0) {
        this.selectIndex = this.data.length - 1
      }
      this.updateCharts()
    },
    toRight() {
      this.selectIndex++
      if (this.selectIndex >= this.data.length) {
        this.selectIndex = 0
      }
      this.updateCharts()
    }
  },
  created() {
    this.$socket.registerCallBack('hotData', this.getData)
  },
  mounted() {
    this.initCharts()
    // this.getData()
    this.screenAdapter()
    this.$socket.send({
      action: 'getData',
      socketType: 'hotData',
      chartName: 'hotproduct',
      value: ''
    })
    window.addEventListener('resize', this.screenAdapter)
  },
  destroyed() {
    window.removeEventListener('resize', this.screenAdapter)
    this.$socket.unregisterCallBack('hotData')
  }
}
</script>

<style scoped lang="less">
.hot-wrapper {
  height: 100%;
  width: 100%;
  overflow: hidden;
  position: relative;

  .container {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  .left {
    position: absolute;
    top: 50%;
    left: 10%;
    z-index: 10;
    color: white;
    transform: translateY(-50%);
    cursor: pointer;
  }

  .right {
    position: absolute;
    top: 50%;
    right: 10%;
    z-index: 10;
    color: white;
    transform: translateY(-50%);
    cursor: pointer;
  }

  .title {
    z-index: 10;
    color: white;
    position: absolute;
    right: 15%;
    bottom: 20px;
  }
}
</style>
