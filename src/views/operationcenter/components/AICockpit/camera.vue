<template>
  <div class="camera">
    <div class="action">
      <div class="btn active">车头</div>
      <div class="btn">驾驶室</div>
      <div class="btn">车厢</div>
      <div class="btn">车尾</div>
    </div>
    <div class="preview"/>
  </div>
</template>

<script>
export default {
  name: 'Camera',
  components: {},
  data() {
    return {}
  },
  mounted() {
    // const script = document.createElement('script')
    // script.type = 'text/javascript'
    // script.src =
    //   'http://api.map.baidu.com/library/Heatmap/2.0/src/Heatmap_min.js'
    // document.body.appendChild(script)
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.camera{
   margin-top: 80px;
   .action{
      .btn{
            color: #275E7B;
            display: inline;
            background-image:url("../../../../../static/aiCockpit/btn-bg.png");
            background-repeat: no-repeat;
            background-size: 80% 100% ;
            -moz-background-size: 80% 100%;
            background-position:center;
            text-align: center;
            font-size: 16px;
            width: 24%;
            padding: 12px 17px;
            display: inline-block;
            &.active, &:hover{
               background-image:url("../../../../../static/aiCockpit/btn-active.png");
               color: #FFFFFF;
            }
         }
   }
   .preview{
       background-image:url("../../../../../static/aiCockpit/driver.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    -moz-background-size: 100% 100%;
    height:calc(100vh - 213px);
    margin: 30px auto 0px auto;
   }

}
</style>

