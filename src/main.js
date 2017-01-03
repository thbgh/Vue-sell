import Vue from 'vue';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
import App from './App';
import goods from './components/goods/goods'; /* vue扩展名由Webpack自动配置，可不加 */
/* ./表示在当前目录下,也可以不要./ */
import ratings from './components/ratings/ratings';
import seller from './components/seller/seller';
import './common/stylus/icon.styl';

// import './common/stylus/index.styl';
// 我在引入index.styl后一直报错，找不到原因，所以暂时不引入1像素border

Vue.use(VueRouter);
Vue.use(VueResource);

let app = Vue.extend(App);
/* eslint-disable no-new */
/* new Vue({     // 实例化
  el: 'body',
  components: { App }
}); */
let router = new VueRouter({
    linkActiveClass: 'active'
});
router.map({
    '/goods': {
        component: goods
    },
    '/ratings': {
        component: ratings
    },
    '/seller': {
        component: seller
    }
});

router.start(app, '#app'); /* 挂载点 */
router.go('/goods');  /* 打开网页自动跳到指定组件，这里跳到goods */
