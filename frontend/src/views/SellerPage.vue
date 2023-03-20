<template>
    <div class="seller-page-wrapper">
        <Seller></Seller>
    </div>
</template>

<script>
import Seller from '@/components/Seller.vue'
export default {
  components: {
    Seller
  }
}
</script>

<style scoped lang="less">
.seller-page-wrapper{
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: relative;
}
</style>
