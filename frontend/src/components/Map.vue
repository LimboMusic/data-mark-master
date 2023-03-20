<!-- 商家分布图表 -->
<template>
  <div class='map-wrapper' @dblclick="revertMap">
    <div class='container' ref='map_ref'></div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import axios from 'axios'
import { getProvinceMapInfo } from '@/utils/map_utils'
export default {
  data() {
    return {
      chartInstance: null,
      allData: null,
      mapData: {}, // 所获取的省份的地图矢量数据
      fontSize: 0,
      provinceData: {}
    }
  },
  computed: {
    ...mapState(['theme'])
  },
  watch: {
    theme() {
      this.chartInstance.dispose()
      this.initChart()
      this.updateChart()
      this.screenAdapter()
    }
  },
  created() {
    this.$socket.registerCallBack('mapData', this.getData)
  },
  mounted() {
    this.initChart()
    // this.getData()
    this.$socket.send({
      action: 'getData',
      socketType: 'mapData',
      chartName: 'map',
      value: ''
    })
    window.addEventListener('resize', this.screenAdapter)
    this.screenAdapter()
  },
  destroyed() {
    window.removeEventListener('resize', this.screenAdapter)
    this.$socket.unregisterCallBack('mapData')
  },
  methods: {
    async initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.map_ref, this.theme)
      // 获取中国地图的矢量数据
      const ret = await axios.get('http://localhost:8999/static/map/china.json')
      this.$echarts.registerMap('china', ret.data)
      const initOption = {
        title: {
          text: '▍ 商家分布',
          top: 20,
          left: 20,
        },
        geo: { // 地图配置
          type: 'map',
          map: 'china',
          top: '5%',
          bottom: '5%',
          itemStyle: {
            areaColor: '#2e72bf',
            borderColor: '#333'
          }
        },
        legend: { // 图例的样式
          left: '5%',
          bottom: '5%',
          orient: 'vertical' // 排列方向
        }
      }
      this.chartInstance.setOption(initOption)

      this.chartInstance.on('click', async (arg) => { // 点击地图跳转省份
        const provinceInfo = getProvinceMapInfo(arg.name)
        // 获取省份的地图数据
        // 先判断是否已经获取过了地图的数据
        if (!this.provinceData[provinceInfo.key]) {
          const resp = await axios.get('http://localhost:8999' + provinceInfo.path)
          this.provinceData[provinceInfo.key] = resp.data
        }
        this.$echarts.registerMap(provinceInfo.key, this.provinceData[provinceInfo.key])
        const changeOption = {
          geo: {
            map: provinceInfo.key
          }
        }
        this.chartInstance.setOption(changeOption)
      })
    },
    async getData(data) {
      // 获取服务器的数据, 对this.allData进行赋值之后, 调用updateChart方法更新图表
      // const { data: ret } = await this.$http.get('map')
      // this.allData = ret
      this.allData = data
      this.updateChart()
    },
    updateChart() {
      const legendArr = this.allData.map(item => item.name)
      // 散点的数据
      const seriesArr = this.allData.map(item => ({
        type: 'effectScatter',
        rippleEffect: {
          scale: 5, // 涟漪效果
          brushType: 'stroke', // 空心效果
        },
        name: item.name,
        data: item.children,
        coordinateSystem: 'geo'
      }))
      const dataOption = {
        series: seriesArr,
        legend: {
          data: legendArr
        }
      }
      this.chartInstance.setOption(dataOption)
    },
    screenAdapter() {
      this.fontSize = this.$refs.map_ref.offsetWidth / 100 * 3.6
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: this.fontSize
          }
        },
        legend: {
          itemWidth: this.fontSize,
          itemHeight: this.fontSize / 2,
          itemGap: this.fontSize / 2, // 图例之间的间隔
          textStyle: {
            fontSize: this.fontSize / 2
          }
        }
      }
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize()
    },
    // 回到中国地图
    revertMap() {
      const revertOption = {
        geo: {
          map: 'china'
        }
      }
      this.chartInstance.setOption(revertOption)
    }
  }
}
</script>

<style scoped lang="less">
.map-wrapper {
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
