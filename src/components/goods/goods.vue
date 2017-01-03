<template>
  <div class = "goods">
    <div class="menu-wrapper" v-el:menu-wrapper>
        <ul>
            <li v-for="item in goods" class="menu-item">
                <span class="text  border-1px">
                    <span v-show="item.type>0" class="icon" :class="classMap[item.type]"></span>
                    {{item.name}}
                </span>
            </li>
        </ul>
    </div>
    <div class="foods-wrapper" v-el:foods-wrapper>
         <ul>
             <li v-for="item in goods" class="food-list">
                <h1 class="title">{{item.name}}</h1>
                <ul>
                    <li v-for="food in item.foods" class="food-item">
                        <div class="icon">
                            <img width="57px" height="57px" :src="food.image" >
                        </div>
                        <div class="content">
                            <h2 class="name">{{food.name}}</h2>
                            <p class="desc">{{food.description}}</p>
                            <div class="extra">
                                <span class="count">月售{{food.sellCount}}份</span>
                                <span>好评率{{food.rating}}%</span>
                            </div>
                            <div class="price">
                                <span class="now">¥{{food.price}}</span>
                                <span class="old" v-show="food.oldPrice">¥{{food.oldPrice}}</span>
                            </div>
                            <div class="cartcontrol-wrapper">
                                <cartcontrol :food="food"></cartcontrol> <!-- 接收food对象 -->
                            </div>
                        </div>
                    </li>
                </ul>
             </li>
         </ul>
    </div>
    <shopcart v-ref:shopcart :select-foods="selectFoods" :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice"></shopcart>
          <!--  shopcart组件引用时传入参数数据，然后在shopcart组件中用props接收数据 -->
          <!--  :select-foods方法使得点击 加减 时，与购物车数据产生联动 -->
          <!--  v-ref接口是用来：父组件访问子组件的 -->
  </div>
</template>

<script>
 import BScroll from 'better-scroll'; /* 使用插件实现滚动效果*/
 import shopcart from 'components/shopcart/shopcart';
 import cartcontrol from 'components/cartcontrol/cartcontrol';

 const ERR_OK = 0;

 export default {
    props: {
        seller: {
            type: Object
        }
     },
     /* 下面的 data()、 created() 是Vue-resource技术的使用套路，用来从后端拿到数据*/
    data() {
      return {
        goods: []
      };
    },
    created() {
      this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
      /* 设置数组来取得相应的类名，然后由类名取得对应的icon。此方法很妙！！！使用见class="icon"*/
      this.$http.get('api/goods').then((response) => {
        response = response.body;
        if (response.errno === ERR_OK) {
          this.goods = response.data;
          /* console.log(this.goods);*/

          /* 使用插件实现滚动效果的套路*/
          this.$nextTick(() => {   /* 这是Vue的一个接口*/
            this._initScroll();
          });
        }
      });
    },
    methods: {
        _drop(target) {
          this.$nextTick(() => {
             /* this.$refs.shopcart 访问到子组件。前面调用shopcart子组件时使用了refs接口 */
          this.$refs.shopcart.drop(target);
        });
        },
         _initScroll() {
            this.menuScroll = new BScroll(this.$els.menuWrapper, {
                click: true
            });
            this.foodsScroll = new BScroll(this.$els.foodsWrapper, {
                click: true,
                probeType: 3
            });
            /* 此处menuWrapper、foodsWrapper需要使用驼峰法，而上面的div中不能用驼峰法*/
        }
    },
    computed: {
        selectFoods() {
            let foods = [];
            this.goods.forEach((good) => {
                good.foods.forEach((food) => {
                    if (food.count) {
                        foods.push(food);
                    }
                });
            });
            return foods;
        }
    },

    components: {
        shopcart,
        cartcontrol
    },
    events: {
        'cart.add'(target) {
            this._drop(target);
        }
    }

 };
</script>

<style lang="stylus" rel="stylesheet/stylus">
 @import "../../common/stylus/mixin.styl"
  .goods
      display: flex
      position: absolute
      top:174px
      bottom:46px
      width: 100%
      overflow:hidden
      /* menu固定宽度 foods自适应，所以采用flex布局*/
      .menu-wrapper
          flex: 0 0 80px
          width:80px
          background: #f3f5f7
          .menu-item
              display:table /* table布局很适合用于一行或多行文本居中效果*/
              height:54px
              width:56px
              padding:0 12px
              line-height:14px
              .icon
                  display:inline-block
                  width:12px
                  height:12px
                  vertical-align: top
                  margin-right:2px
                  background-size:12px 12px
                  background-repeat:no-repeat
                  &.decrease
                      bg-image('decrease_3')
                  &.discount
                      bg-image('discount_3')
                  &.guarantee
                      bg-image('guarantee_3')
                  &.invoice
                      bg-image('invoice_3')
                  &.special
                      bg-image('special_3')
              .text
                  display:table-cell
                  width:56px
                  vertical-align:middle
                  border-1px(rgba(7,17,27,0.1))
                  font-size:12px

      .foods-wrapper
          flex: 1
          .title
              padding-left:14px
              height:26px
              line-height:26px
              border-left:2px solid #d9dde1
              font-size:12px
              color:rgb(147,153,159)
              background:#f3f5f7
          .food-item
              display:flex
              margin:18px   // 上面的下外边距与下面的上外边距会重合，所以不会变成36px的外边距！！
              padding-bottom:18px
              border-1px(rgba(7,17,27,0.1))
              &:last-child
                  border-1px-none()
                  margin-bottom:0
              .icon
                  flex:0 0 57px
                  margin-right:10px
              .content
                  flex:1
                  .name
                      margin:2px 0 8px 0
                      height:14px
                      line-height:14px
                      font-size:14px
                      color:rgb(7,17,27)
                  .desc, .extra
                      line-height:10px
                      font-size:10px
                      color:rgb(147,153,159)
                  .desc
                      line-height:12px
                      margin-bottom:8px
                  .extra
                      .count
                          margin-right:12px
                  .price
                      font-weight:700
                      line-height:24px
                      .now
                          margin-right:8px
                          font-size:14px
                          color:rgb(240,20,20)
                      .old
                          text-decoration:line-through
                          font-size:10px
                          color:rgb(147,153,159)
                  .cartcontrol-wrapper
                      position:absolute
                      right:0
                      bottom:12px


</style>