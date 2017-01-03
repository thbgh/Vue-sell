<template>
  <div>
     <v-header :seller="seller"></v-header>
     <div class = "tab border-1px">
       <!-- 使用 router-link 组件来导航. -->
       <!-- 通过传入 `to` 属性指定链接. -->
       <!-- <router-link> 默认会被渲染成一个 `<a>` 标签 -->
       <div class="tab-item">
           <a v-link ="{path: '/goods'}">商品</a>
       </div>
       <div class="tab-item">
            <a v-link ="{path: '/ratings'}">评论</a>
       </div>
       <div class="tab-item">
            <a v-link ="{path: '/seller'}">商家</a>
       </div>
     </div>
      <!-- 路由出口 -->
      <!-- 路由匹配到的组件将渲染在这里 -->
      <router-view :seller="seller"></router-view>
          <!-- 传入seller数据 然后组件中用props接收数据 -->
  </div>
</template>

<script>  /* 逻辑 */
  /* 引入组件*/
  import header from './components/header/header.vue';
  /* 导出组件*/
  const ERR_OK = 0;
  export default {
     /* 下面的 data()、 created() 是Vue-resource技术的使用套路，用来从后端拿到数据*/
    data() {
      return {
        seller: {}
      };
    },
    created() {
      this.$http.get('api/seller').then((response) => {
        response = response.body;
        if (response.errno === ERR_OK) {
          this.seller = response.data;
        }
      });
    },
    components: {
      'v-header': header
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "./common/stylus/mixin.styl"
  .tab
    display:flex
    width:100%
    height:40px
    line-height:40px
    //border-bottom:1px solid rgba(7,17,27,0.1) 为适应不同dpi手机，使用1像素border技巧
    border-1px(rgba(7,17,27,0.1))
    .tab-item
      flex:1
      text-align:center
      & > a
        display:block
        font-size: 14px
        color: rgb(77,85,93)
        &.active
          color: rgb(240,20,20)
</style>
