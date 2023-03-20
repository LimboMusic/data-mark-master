<template>
    <div class="map-page-wrapper">
        <Map></Map>
    </div>
</template>

<script>
import Map from '@/components/Map.vue'
export default {
  components: {
    Map
  }
}
</script>

<style scoped lang="less">
.map-page-wrapper{
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: relative;
}
</style>
