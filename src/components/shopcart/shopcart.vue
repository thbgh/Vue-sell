<template>
   <div class = "shopcart">
       <div class="content"> <!-- 右边固定宽度，左边自适应 -->
            <div class="content-left" @click="toggleList">
                <div class="logo-wrapper">
                    <div class="logo" :class="{'highlight':totalCount>0}">
                         <!-- 绑定在条件下高亮的属性 -->
                        <i class="icon-shopping_cart" :class="{'highlight':totalCount>0}"></i>
                    </div>
                    <div class="num" v-show="totalCount>0">{{totalCount}}</div>
                </div>
                <div class="price" :class="{'highlight':totalCount>0}">¥{{totalPrice}}</div>
                <div class="desc">另需配送费¥{{deliveryPrice}}元</div>
            </div>
            <div class="content-right" @click="pay">
             <!--  content-right叠加了2个点击事件，会产生点击事件冒泡的bug,Vue提供了事件修饰符，很容易处理这种问题！！！ -->
                <div class="pay" :class="{'enough':totalPrice >= minPrice}">
                    {{payDesc}}
                </div>
            </div>
       </div>
       <div class="ball-container">
            <div transition="drop"  class="ball" v-for="ball in balls" v-show="ball.show">
                <div class="inner inner-hook"></div>
                <!-- ...-hook表示被JS选择的，而没有真实的样式含义 -->
            </div>
       </div>
       <div class="shopcart-list" v-show="listShow" transition="fold">
          <!-- fold 列表有一个展开 收起的缓动  设置效果见属性-->
           <div class="list-header">
               <h1 class="title">购物车</h1>
               <h1 class="empty" @click="empty">清空</h1>
           </div>
           <div class="list-content" v-el:list-content>
                    <!-- v-el:用来取得这个DOM的 -->
               <ul>
                   <li class="food" v-for="food in selectFoods">
                       <span class="name">{{food.name}}</span>
                       <div class="price">
                           <span>¥{{food.price*food.count}}</span>
                       </div>
                       <div class="cartcontrol-wrapper">
                           <cartcontrol :food="food"></cartcontrol>
                       </div>
                   </li>
               </ul>
           </div>
       </div>
   </div>
   <div class="list-mask" @click="hideList" v-show="listShow" transition="fade">
   </div>
</template>

<script>
 import cartcontrol from 'components/cartcontrol/cartcontrol';
 import BScroll from 'better-scroll'; /* 使用插件实现滚动效果*/
 export default {
    props: {
        selectFoods: {
            type: Array,
            default() {
                return [
                 /* {
                    price: 10,
                    count: 10
                }
                调试的数据*/
                ];
            }
        },
        deliveryPrice: {
            type: Number,
            default: 0
        },
        minPrice: {
            type: Number,
            default: 0
        }
    },
    data() {
        return {
            balls: [
            {
                show: false
            },
            {
                show: false
            },
            {
                show: false
            },
            {
                show: false
            },
            {
                show: false
            }
            ],
            /* balls[]放入5个球是为了在连续快速点击+时，空中同时出现多个小球的效果，如果只放一个小球，那么同一时间空中只能有一个小球，体验不太友好*/
            dropBalls: [],
            fold: true
        };
    },
    computed: {
        totalPrice() {
            let total = 0;
            this.selectFoods.forEach((food) => {
                total += food.price * food.count;
            });
            return total;
        },
        totalCount() {
            let count = 0;
            this.selectFoods.forEach((food) => {
                count += food.count;
            });
            return count;
        },
        payDesc() {
            if (this.totalPrice === 0) {
                return `￥${this.minPrice}元起送`;  /* ！！！注意：这里用单大括号，下同 */
                /* 这是ES6的一个语法，比用在拼接字符串了*/
            } else if (this.totalPrice < this.minPrice) {
                let diff = this.minPrice - this.totalPrice;
                return `还差￥${diff}元起送`;
            } else {
                return '去结算';
            }
        },
        listShow() {
            if (!this.totalCount) {
                this.fold = true;
                return false;
            }
            let show = !this.fold;
            if (show) {
                this.$nextTick(() => {
                    if (!this.scroll) {
                    this.scroll = new BScroll(this.$els.listContent, {
                        click: true
                      });
                    } else {
                        this.scroll.refresh();
                    }
                });
            }
            return show;
        }
    },
    methods: {
        drop(el) {
           /* console.log(el); 测试是否拿到了组件元素*/
           for (let i = 0; i < this.balls.length; i++) {
            let ball = this.balls[i];
            if (!ball.show) {
                ball.show = true;  /* 可用来触发动画缓动*/
                ball.el = el;
                this.dropBalls.push(ball);
                return;
                }
            }
        },
        toggleList() {
            if (!this.totalCount) {
                return;
            }
            this.fold = !this.fold;
        },
        empty() {
            this.selectFoods.forEach((food) => {
                food.count = 0;
            });
        },
        hideList() {
            this.fold = true;
        },
        pay() {
            if (this.totalPrice < this.minPrice) {
                return;
            }
            this.fold = true;
            window.alert(`亲，请支付${this.totalPrice}元哦！`);
        }
    },
    transitions: {
        drop: {
            beforeEnter(el) {
                let count = this.balls.length;
                while (count--) {
                    let ball = this.balls[count];
                    if (ball.show) {
                        let rect = ball.el.getBoundingClientRect();
                        /* 此方法可以获得元素相当于视口的位置 */
                        let x = rect.left - 32;
                        let y = -(window.innerHeight - rect.top - 22);
                        /* 获取元素运动将要进行的偏移值*/
                        el.style.display = '';  /* display置为空，让它显示*/
                        el.style.webkitTransform = `translate3d(0,${y}px,0)`;
                        el.style.transform = `translate3d(0,${y}px,0)`;
                        let inner = el.getElementsByClassName('inner-hook')[0];
                        inner.style.webkitTransform = `translate3d(${x}px,0,0)`;
                        inner.style.transform = `translate3d(${x}px,0,0)`;
                        /* translate3d 的d是小写的哦！ */
                    }
                }
            },
            enter(el) {
                /* 下面这一句注释用来避免对定义了却没有使用的变量报错*/
                /* eslint-disable no-unused-vars */
                let rf = el.offsetHeight;  /* 触发重绘*/
                /* enter之后把样式重置回来*/
                this.$nextTick(() => {
                    el.style.webkitTransform = 'translate3d(0,0,0)';
                    el.style.transform = 'translate3d(0,0,0)';
                    let inner = el.getElementsByClassName('inner-hook')[0];
                    inner.style.webkitTransform = 'translate3d(0,0,0)';
                    inner.style.transform = 'translate3d(0,0,0)';
                });
            },
            afterEnter(el) {
                let ball = this.dropBalls.shift();
                if (ball) {
                    ball.show = false;
                    el.style.display = 'none';
                }
            }
        }
    },
    components: {
        cartcontrol
    }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
 @import "../../common/stylus/mixin.styl"
    .shopcart
        position:fixed /* 在显示goods组件时，相对于整个屏幕固定，而不是goods区域*/
        left:0
        bottom:0
        z-index:50
        width:100%
        height:48px
        background:#000
        .content
            display:flex
            background:#141d27
            font-size:0  /* 当子元素为inline-block布局时，为消除间隙*/
            .content-left
                flex:1
                .logo-wrapper
                    display: inline-block
                    position:relative
                    top:-10px
                    vertical-align:top   //注意 不是verticle
                    padding:6px
                    margin:0 12px
                    width:56px
                    height:56px
                    box-sizing:border-box   // 此处采用的是IE盒子模型*/
                    border-radius:50%
                    background: rgb(20,29,39)
                    .logo
                        width:100%
                        height:100%
                        border-radius:50%
                        text-align:center
                        background:#2b343c
                        &.highlight
                            background:rgb(0,160,220)
                        .icon-shopping_cart
                            line-height:44px
                            font-size:24px
                            color:#80858a
                            &.highlight
                                color: #fff
                    .num
                        position:absolute
                        top:0
                        right:0
                        width:24px
                        height:16px
                        line-height:16px
                        text-align:center
                        border-radius:16px
                        font-size:9px
                        font-weight:700
                        color: #fff
                        background:rgb(240,20,20)
                        box-shadow: 0 4px 8px 0 rgba(0,0,0,0.4)
                .price
                    display:inline-block
                    vertical-align: top
                    margin-top:12px
                    line-height:24px
                    padding-right:12px
                    box-sizing:border-box
                    border-right:1px solid rgba(255,255,255,0.1)
                    font-size:16px
                    font-weight:700
                    color:rgba(255,255,255,0.4)
                    &.highlight
                        color:#fff
                .desc
                    display: inline-block
                    vertical-align:top
                    margin:12px 0 0 10px
                    line-height:24px
                    color: rgba(255,255,255,0.4)
                    font-size: 12px
            .content-right
                flex:0 0 105px
                width:105px
                .pay
                    height:48px
                    line-height:48px
                    text-align:center
                    font-size:12px
                    font-weight:700
                    color:rgba(255,255,255,0.4)
                    background:#2b333b
                    &.enough
                        background:#00b43c
                        color:#fff
        .ball-container
            .ball
                position:fixed
                left:32px
                bottom:22px
                z-index:200
                &.drop-transition
                    transition:all 0.4s cubic-bezier(.98,-0.36,1,1)
                    /* 给小球的缓动添加贝塞尔曲线 */
                    .inner
                        width:16px
                        height:16px
                        border-radius:50%
                        background:rgb(0,160,220)
                        transition:all 0.4s linear  /* X轴不需要缓动，就设置成线性的 */
        .shopcart-list
            position:absolute
            left:0
            top:0
            z-index:-1
            width:100%
            &.fold-transition
                transition:all 0.5s
                transform:translate3d(0,-100%,0)
            &.fold-enter, &.fold-leave
                transform: translate3d(0,0,0)
            .list-header
                height: 40px
                line-height: 40px
                padding: 0 18px
                background: #f3f5f7
                border-bottom: 1px solid rgba(7,17,27,0.1)
                .title
                    float:left
                    font-size: 14px
                    color:rgb(7,17,27)
                .empty
                    float:right
                    font-size:12px
                    color: rgb(0,160,220)
            .list-content
                padding: 0 18px
                max-height: 217px
                overflow: hidden
                background:#fff
                .food
                    position: relative
                    padding: 12px 0
                    box-sizing:border-box
                    border-1px(rgba(7,17,27,0.1))
                    .name
                        line-height:24px
                        font-size:14px
                        color: rgb(7,17,27)
                    .price
                        position: absolute
                        right:90px
                        bottom: 12px
                        line-height: 24px
                        font-size: 14px
                        font-weight:700
                        color:rgb(240,20,20)
                    .cartcontrol-wrapper
                        position:absolute
                        right: 0
                        bottom: 6px
    .list-mask
        position:fixed
        top:0
        left:0
        width:100%
        height:100%
        z-index:40
        background-filter:blur(10px)
        /* ！！!importantVue中定义动画非常简单，定义名称，再来写样式就可以实现*/
        &.fade-transition   /* 动画最终状态*/
            transition:all 0.5s
            opacity:1
            background:rgba(7,17,27,0.7)
        &.fade-enter, &.fade-leave /* 动画刚开始和结束时的状态*/
            opacity: 0
            background:rgba(7,17,27,0)

</style>