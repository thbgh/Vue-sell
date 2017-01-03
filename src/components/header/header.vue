<template>
  <div class = "header">
     <div class="content-wrapper">
        <div class="avatar">
            <img width="64" height="64" :src="seller.avatar">
            <!-- 此处Vue中引入路径资源需要用v-bind:src -->
        </div>
        <div class="content">
            <div class="title">
                <span class="brand"></span>
                <span class="name">{{seller.name}}</span>
            </div>
            <div class="description">
                {{seller.description}}/{{seller.deliveryTime}}分钟送达
            </div>
            <div v-if="seller.supports" class="support">
            <!-- 此处先判断是否通过异步请求拿到了这个数据，否则会报错 -->
                <span class="icon" :class="classMap[seller.supports[0].type]"></span>
                <span class="text">{{seller.supports[0].description}}</span>
            </div>
        </div>
        <div v-if="seller.supports" class="support-count" @click="showDetail">
            <span class="count">{{seller.supports.length}}个</span>
            <i class="icon-keyboard_arrow_right"></i>
        </div>
     </div>
     <div class="bulletin-wrapper"  @click="showDetail">
        <span class="bulletin-title"></span><span class="bulletin-text">{{seller.bulletin}}</span><i class="icon-keyboard_arrow_right"></i>
     </div>
     <div class="background">
        <img width="100%" height="100%" :src="seller.avatar">
        <!-- 经测试，需要将width和height在src前设置，否则不生效！！！ -->
     </div>
     <div v-show="detailShow" class="detail" transition="fade">
     <!--  1.css sticky footer 布局套路 -->
     <!--  2.运用Vue,设置渐变效果的套路 此处定义渐变形式，样式设置效果 -->
        <div class="detail-wrapper clearfix">  <!-- clearfix清除浮动 -->
            <div class="detail-main">
                <h1 class="name">{{seller.name}}</h1>
                <div class="star-wrapper"> <!-- 将star组件整体包裹到一个div中，设置属性来调整位置 -->
                    <star :size="48" :score="seller.score"></star>
                </div>
                <div class="title">
                    <div class="line"></div>
                    <div class="text">优惠信息</div>
                    <div class="line"></div>
                </div>
                <ul v-if="seller.supports" class="supports">
                    <li class="support-item" v-for="item in seller.supports">
                        <span class="icon" :class="classMap[seller.supports[$index].type]"></span>
                        <span class="text">{{seller.supports[$index].description}}</span>
                    </li>
                </ul>
                <div class="title">
                    <div class="line"></div>
                    <div class="text">商家公告</div>
                    <div class="line"></div>
                </div>
                <div class="bulletin">
                    <p class="content">{{seller.bulletin}}</p>
                </div>
            </div>

        </div>
        <div class="detail-close" @click="closeDetail">
            <i class="icon-close"></i>
        </div>
        <!--  浮层显示控制 -->
     </div>
  </div>
</template>

<script>
 import star from 'components/star/star'; /* 引入star*/

 export default {
    props: {
        seller: {
            type: Object
        }
     },
    created() {
        this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
        /* 设置数组来取得相应的类名，然后由类名取得对应的icon。此方法很妙！！！使用见class="icon"*/
     },
    data() {
        return {
             detailShow: false  /* 开始时浮层不显示*/
        };
     },
    methods: {
        showDetail() {
            this.detailShow = true; /* 点击触发时通过修改data中datailShowde的值使浮层显示*/
        },
        closeDetail() {
             this.detailShow = false;
        }
      },
    components: {
        star     /* 注册star*/
    }

 };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin"
  @import "../../common/stylus/base"
     .header
        position:relative
        color:#fff
        background:rgba(7,17,27,0.5)
        overflow:hidden  /* 消除背景图片模糊效果在header下面有影响的问题 */
        .content-wrapper
            position:relative
            padding:24px 12px 18px 24px
            font-size:0   //解决.avatar和 .content之间的间隙问题；子元素重新设置字体大小
            .avatar
                display:inline-block
                vertical-align:top
                img
                    border-radius:2px
            .content
                display:inline-block
                margin-left:16px
                /*font-size:12px*/
                .title
                    margin:2px 0 8px 0
                    .brand
                        display:inline-block
                        vertical-align:top
                        width:30px
                        height:18px
                        background-size:30px 18px
                        bg-image('brand')
                        background-repeat:no-repeat
                    .name
                        margin-left:6px
                        font-size:16px
                        line-height:18px
                        font-weight: bold
                .description
                    margin-bottom:10px
                    line-height:12px
                    font-size:12px
                .support
                    .icon
                        display:inline-block
                        vertical-align:top
                        width:12px
                        height:12px
                        margin-right:4px
                        background-size:12px 12px
                        background-repeat:no-repeat
                        &.decrease
                            bg-image('decrease_1')
                        &.discount
                            bg-image('discount_1')
                        &.guarantee
                            bg-image('guarantee_1')
                        &.invoice
                            bg-image('invoice_1')
                        &.special
                            bg-image('special_1')
                    .text
                        line-height:12px
                        font-size:12px
            .support-count
                position:absolute
                right:12px
                bottom:14px
                padding:0 8px
                height:24px
                line-height:24px
                border-radius:14px
                background:rgba(0,0,0,0.2)
                text-align:center
                .count
                    vertical-align:top
                    font-size:12px
                .icon-keyboard_arrow_right
                    margin-left:2px
                    line-height:24px //此处重新设置是因为 图标字体默认设置了line-height:1
                    font-size:12px
        .bulletin-wrapper
            position:relative
            height:28px
            line-height:28px
            padding:0 22px 0 12px
            /*font-size:0  //此处用来消除标签之间的间隙,但是文本就不会有...的效果了
                所以换一种方法：写结构template时让两个span标签紧挨着，不留空隙 */
            /*以下三个属性设置文本超出部分...效果*/
            white-space:nowrap
            overflow:hidden
            text-overflow:ellipsis
            background:rgba(7,17,27,0.2)
            .bulletin-title
                display:inline-block
                vertical-align:top
                margin:8px 0
                width:22px
                height:12px
                background-size:22px 12px
                bg-image('bulletin')
                background-repeat:no-repeat
                font-size:12px
            .bulletin-text
                margin:0 4px
                vertical-align:top
                /*line-height:10px*/  //此处不能再设置行高，否则出现错位。因为已经设置了垂直对齐
                font-size:12px
                font-weight:200
                color:rgb(255,255,255)
            .icon-keyboard_arrow_right
                position:absolute
                font-size:15px
                right:12px
                top:8px
        .background
            position:absolute
            left:0
            top:0
            width: 100%
            height: 100%
            z-index:-10
            filter:blur(10px) /*背景图片模糊效果*/
        .detail
            position:fixed
            z-index:100
            top:0
            left:0
            width:100%
            height:100%
            overflow:auto
            transition: all 0.5s  /* 运用Vue,设置渐变效果的套路*/
            &.fade-transition  /* 最终状态 */
                opacity:1
                background: rgba(7,17,27,0.8)
            &.fade-enter, &.fade-leave  /* 进入、离开的状态*/
                opacity:0
                background: rgba(7,17,27,0)
            /*以下两个属性设置是一个套路写法*/
            .detail-wrapper
                min-height:100%
                width:100%
                .detail-main
                    margin-top:64px
                    padding-bottom:64px  /*为下面的icon-close留下空间，然后icon-close上边距为-64。当内容不多时，icon-close也能出现在底部*/
                    .name
                        line-height:16px
                        text-align: center
                        font-size:16px
                        font-weight:700
                    .star-wrapper
                        margin-top:16px
                        padding:2px 0
                        text-align:center
                    .title
                        display:flex  //flex布局
                        width:80%
                        margin:28px auto 24px auto
                        .line
                            flex:1
                            position:relative
                            top:-7px
                            border-bottom:1px solid rgba(255,255,255,0.2)
                        .text   // 随内容自动占据空间，所以不同flex:1
                            padding:0 12px
                            font-size:15px
                            font-weight:700
                    .supports
                        width:80%
                        margin:0 auto
                        .support-item
                            padding:0 12px
                            margin-bottom:12px
                            font-size:0
                            &:last-child
                                margin-bottom:0
                            .icon
                                display:inline-block
                                width:16px
                                height:16px
                                vertical-align: top
                                margin-right:6px
                                background-size:16px 16px
                                background-repeat:no-repeat
                                &.decrease
                                    bg-image('decrease_2')
                                &.discount
                                    bg-image('discount_2')
                                &.guarantee
                                    bg-image('guarantee_2')
                                &.invoice
                                    bg-image('invoice_2')
                                &.special
                                    bg-image('special_2')
                            .text
                                line-height:16px
                                font-size:12px
                    .bulletin
                        width:80%
                        margin: 0 auto
                        .content  /* p是块级元素 */
                            padding:0 12px
                            line-height:24px
                            font-size:12px


            .detail-close
                position:relative
                width:32px
                height:32px
                margin:-64px auto 0 auto
                clear:both
                font-size:32px
</style>
