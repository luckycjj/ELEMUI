<template>
  <div :style="{height:height,width:width}" class="panel">
    <p class="predict">预计3小时后到达卸货点</p>
    <p class="driver">
      <span><i class="fa fa-map-marker"/>南京长深高速</span>
      <span><i class="fa fa-user"/>张三三</span>
      <span><i class="fa fa-phone"/>18712345678</span>
    </p>
    <div class="other">
      <div class="other-bg">
        <img src="../../../../../static/aiCockpit/icon_pic.png" width="100px">
        <p>其他监控信息</p>
      </div>
      <div class="other-info">
        <p style="margin-top: 0px;"> <span><i class="fa fa-truck"/>总里程数：280km</span></p>
        <p> <span><i class="fa fa-info"/>途径收费站：5个</span></p>
        <p> <span><i class="fa fa-cny "/>路桥费：108元</span></p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Panel',
  components: {},
  data() {
    return {
      width: '100%'
    }
  },
  computed: {
    height() {
      return (document.body.clientHeight * 0.4 - 50) + 'px'
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.panel{
      color: #D7DFE5;
      padding: 0px 20px;
      zoom: 1;
      &:after{
        clear:both;
        content:'';
        display:block;
        visibility:hidden;
      }
  .predict{
    color: #BBC00F;
    font-size: 18px;
    margin-bottom: 25px;
   }
   .driver{
    font-size: 16px;
    span{
        margin-right: 6px;
    }
    i{
        margin-right: 5px;
    }
   }
   .other{
        font-size: 16px;
       padding-top: 20px;
       .other-bg{
           text-align: center;
           &:after{
                display: block;
               background: linear-gradient(360deg,rgba(16,29,42,1) 0%,rgba(37,66,88,1) 48%,rgba(15,29,42,1) 100%);
               padding: 2px;
           }
       }
    .other-bg,.other-info{
        width: 50%;
        float: left;
        i{
            width: 15px;
            text-align: center;
            margin-right: 8px;
        }
        p{
            margin-bottom: 20px;
        }
    }
   }
}
</style>

