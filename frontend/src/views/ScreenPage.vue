<template>
  <div class="screen-container" :style="containerStyle">
    <header class="screen-header">
      <div>
        <img :src="headerSrc">
      </div>
      <span class="title">电商平台实时监控系统</span>
      <div class="title-right">
        <img :src="themeSrc" class="qiehuan" @click="handleChangeTheme">
        <span class="datetime">2049-01-01 00:00:00</span>
      </div>
    </header>
    <div class="screen-body">
      <section class="screen-left">
        <div id="left-top" :class="[fullscreenStatus.trend ? 'fullscreen' : '1']">
          <!-- 销量趋势图表 -->
          <Trend ref="trend"></Trend>
          <div class="resize">
            <!-- icon-compress-alt -->
            <span @click="changeSize('trend')" class="iconfont"
              :class="[fullscreenStatus.trend ? 'icon-compress-alt' : 'icon-expand-alt']"></span>
          </div>
        </div>
        <div id="left-bottom" :class="[fullscreenStatus.seller ? 'fullscreen' : '']">
          <!-- 商家销售金额图表 -->
          <Seller ref="seller"></Seller>
          <div class="resize">
            <!-- icon-compress-alt -->
            <span @click="changeSize('seller')" class="iconfont"
              :class="[fullscreenStatus.trend ? 'icon-compress-alt' : 'icon-expand-alt']"></span>
          </div>
        </div>
      </section>
      <section class="screen-middle" :class="[fullscreenStatus.map ? 'fullscreen' : '']">
        <div id="middle-top">
          <!-- 商家分布图表 -->
          <Map ref="map"></Map>
          <div class="resize">
            <!-- icon-compress-alt -->
            <span @click="changeSize('map')" class="iconfont"
              :class="[fullscreenStatus.map ? 'icon-compress-alt' : 'icon-expand-alt']"></span>
          </div>
        </div>
        <div id="middle-bottom" :class="[fullscreenStatus.rank ? 'fullscreen' : '']">
          <!-- 地区销量排行图表 -->
          <Rank ref="rank"></Rank>
          <div class="resize">
            <!-- icon-compress-alt -->
            <span @click="changeSize('rank')" class="iconfont"
              :class="[fullscreenStatus.rank ? 'icon-compress-alt' : 'icon-expand-alt']"></span>
          </div>
        </div>
      </section>
      <section class="screen-right" :class="[fullscreenStatus.hot ? 'fullscreen' : '']">
        <div id="right-top">
          <!-- 热销商品占比图表 -->
          <Hot ref="hot"></Hot>
          <div class="resize">
            <!-- icon-compress-alt -->
            <span @click="changeSize('hot')" class="iconfont"
              :class="[fullscreenStatus.hot ? 'icon-compress-alt' : 'icon-expand-alt']"></span>
          </div>
        </div>
        <div id="right-bottom" :class="[fullscreenStatus.stock ? 'fullscreen' : '']">
          <!-- 库存销量分析图表 -->
          <Stock ref="stock"></Stock>
          <div class="resize">
            <!-- icon-compress-alt -->
            <span @click="changeSize('stock')" class="iconfont"
              :class="[fullscreenStatus.stock ? 'icon-compress-alt' : 'icon-expand-alt']"></span>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import Hot from '@/components/Hot.vue'
import Map from '@/components/Map.vue'
import Rank from '@/components/Rank.vue'
import Seller from '@/components/Seller.vue'
import Stock from '@/components/Stock.vue'
import Trend from '@/components/Trend.vue'
import { mapState } from 'vuex'
import { getThemeValue } from '@/utils/theme_util'
export default {
  components: {
    Hot,
    Map,
    Seller,
    Rank,
    Trend,
    Stock,
  },
  computed: {
    ...mapState(['theme']),
    comStyle() {
      return {
        color: getThemeValue(this.theme).titleColor
      }
    },
    containerStyle() {
      return {
        backgroundColor: getThemeValue(this.theme).backgroundColor,
        color: getThemeValue(this.theme).titleColor
      }
    },
    headerSrc() {
      return '/static/img/' + getThemeValue(this.theme).headerBorderSrc
    },
    themeSrc() {
      return '/static/img/' + getThemeValue(this.theme).themeSrc
    }
  },
  data() {
    return {
      fullscreenStatus: {
        trend: false,
        hot: false,
        seller: false,
        rank: false,
        map: false,
        stock: false,
      }
    }
  },
  methods: {
    changeSize(chartName) {
      // 不能在更新完状态后立即调用 screenAdapter 函数
      // this.fullscreenStatus[chartName] = !this.fullscreenStatus[chartName]
      // this.$nextTick(()=>{
      //   this.$refs[chartName].screenAdapter()
      // })

      this.$socket.send({
        action: 'fullscreen',
        socketType: 'fullscreen',
        chartName,
        value: !this.fullscreenStatus[chartName]
      })
    },
    changeData(data) {
      // 获得需要改变的图表名称
      const chartName = data.chartName
      // 获得需要改变成的状态
      const value = data.value
      console.log('value ===>', value)
      this.fullscreenStatus[chartName] = value
      this.$nextTick(() => {
        this.$refs[chartName].screenAdapter()
      })
    },
    handleChangeTheme() {
      this.$socket.send({
        action:'themeChange',
        socketType:'themeChange',
        chartName:'',
        value:''
      })
    },
    changeTheme(){
      this.$store.commit('changeTheme')
    }
  },
  created() {
    this.$socket.registerCallBack('fullscreen', this.changeData)
    this.$socket.registerCallBack('themeChange', this.changeTheme)
  },
  destroyed() {
    this.$socket.unregisterCallBack('fullscreen')
    this.$socket.unregisterCallBack('themeChange')
  }
}
</script>
<style lang="less" scoped>
// 全屏样式的定义
.fullscreen {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  width: 100% !important;
  height: 100% !important;
  margin: 0 !important;
  z-index: 100;
}

.screen-container {
  width: 100%;
  height: 100%;
  padding: 0 20px;
  background-color: #161522;
  color: #fff;
  box-sizing: border-box;
}

.screen-header {
  width: 100%;
  height: 64px;
  font-size: 20px;
  position: relative;

  >div {
    img {
      width: 100%;
    }
  }

  .title {
    position: absolute;
    left: 50%;
    top: 50%;
    font-size: 20px;
    transform: translate(-50%, -50%);
  }

  .title-right {
    display: flex;
    align-items: center;
    position: absolute;
    right: 0px;
    top: 50%;
    transform: translateY(-80%);
  }

  .qiehuan {
    width: 28px;
    height: 21px;
    cursor: pointer;
  }

  .datetime {
    font-size: 15px;
    margin-left: 10px;
  }

  .logo {
    position: absolute;
    left: 0px;
    top: 50%;
    transform: translateY(-80%);

    img {
      height: 35px;
      width: 128px;
    }
  }
}

.screen-body {
  width: 100%;
  height: 100%;
  display: flex;
  margin-top: 10px;

  .screen-left {
    height: 100%;
    width: 27.6%;

    #left-top {
      height: 53%;
      position: relative;
    }

    #left-bottom {
      height: 31%;
      margin-top: 25px;
      position: relative;
    }
  }

  .screen-middle {
    height: 100%;
    width: 41.5%;
    margin-left: 1.6%;
    margin-right: 1.6%;

    #middle-top {
      width: 100%;
      height: 56%;
      position: relative;
    }

    #middle-bottom {
      margin-top: 25px;
      width: 100%;
      height: 28%;
      position: relative;
    }
  }

  .screen-right {
    height: 100%;
    width: 27.6%;

    #right-top {
      height: 46%;
      position: relative;
    }

    #right-bottom {
      height: 38%;
      margin-top: 25px;
      position: relative;
    }
  }
}

.resize {
  position: absolute;
  right: 20px;
  top: 20px;
  cursor: pointer;
}
</style>
