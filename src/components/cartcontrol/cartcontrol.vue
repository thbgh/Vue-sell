<template>
    <div class = "cartcontrol">
        <div class="cart-decrease" v-show="food.count>0" @click="decreaseCart" transition="move">
            <!-- 给 - 设置动画效果 -->
            <span class="inner icon-remove_circle_outline"></span>
        </div>
        <div class="cart-count" v-show="food.count>0">{{food.count}}</div>
        <div class="cart-add icon-add_circle" @click="addCart"></div>
    </div>
</template>

<script>
 import Vue from 'vue';
/* 导出组件 */
 export default {
    /* 该组件接收的属性 */
    props: {
        food: {
            type: Object
        }
    },
    methods: {
        addCart(event) {
            /* 这是用来消除在PC端点击一次会有点击两次的问题*/
            if (!event._constructed) {
                return;
            }
            console.log('click'); // 判断click事件是否生效*/
            if (!this.food.count) {
                Vue.set(this.food, 'count', 1);
            } else {
                this.food.count++;
            }
            this.$dispatch('cart.add', event.target);
        },
        decreaseCart(event) {
            if (!event._constructed) {
                return;
            }
            console.log('click'); // 判断click事件是否生效*/
            if (this.food.count) {
                this.food.count--;
            }
        }
    }
 };
</script>

<style lang="stylus" rel="stylesheet/stylus">
    .cartcontrol
        font-size: 0
        .cart-decrease
            display:inline-block
            padding:6px
            transition:all 0.4s linear
            &.move-transition
                opacity:1
                transform: translate3d(0,0,0) // 用这个属性可以开启硬件加速，使动画更流畅
                .inner  /* 在move-transition状态下的inner才显示这样的样式，所以移到下一级*/
                    display:inline-block
                    line-height:24px
                    font-size:24px
                    color: rgb(0,160,220)
                    transition:all 0.4s linear
                    transform:rotate(0)
            &.move-enter,&.move-leave
                opacity:0
                transform: translate3d(24px,0,0)
                .inner
                    transform:rotate(360deg)
        .cart-count
            display:inline-block
            vertical-align:top
            width:12px
            padding-top:6px
            line-height:24px
            text-align:center
            font-size:10px
            color:rgb(147,153,159)
        .cart-add
            display:inline-block
            padding:6px
            line-height:24px
            font-size:24px
            color: rgb(0,160,220)
</style>