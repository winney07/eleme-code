<template>
  <div id="app">
    <v-header :seller="seller"></v-header>
    <div class="tab border-1px">
        <!-- 使用 router-link 组件来导航. -->
        <!-- 通过传入 `to` 属性指定链接. -->
        <!-- <router-link> 默认会被渲染成一个 `<a>` 标签 -->
        <div class="tab-item">
          <router-link to="/goods">商品</router-link>
        </div>
        <div class="tab-item">
          <router-link to="/ratings">评价</router-link>
        </div>
        <div class="tab-item">
          <router-link to="/seller">商家</router-link>
        </div>
    </div>
    <!-- 路由出口 -->
    <!-- 路由匹配到的组件将渲染在这里 -->
    <router-view :seller="seller"></router-view>
  </div>
</template>
<script type="text/esmascript-6">
import {urlParse} from './common/js/util';
import header from './components/header/header.vue'
import star from './components/star/star.vue'

const ERR_OK = 0;
export default {
  data() {
    return{
      seller: {
        id: (() => {
          let queryParam = urlParse();
          return queryParam.id;
        })()
      }
    }
  },
  created() {
    this.$http.get('/api/seller?id=' + this.seller.id).then((response) => {
        response = response.body;
        if(response.errno === ERR_OK) {
          this.seller = response.data;
        }
    })
  },
  name: 'App',
  components: {
    'v-header': header,
  }
}
</script>
<style>
@import './common/css/icon.css';
#app{
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
.tab{
  display:flex;
  width:100%;
  height:40px;
  line-height:40px;
  /* border-bottom : 1px solid rgba(7,17,27,0.1) */
  position: relative;
    
}
.tab::after{
  display: block;
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  border-top: 1px solid rgba(7,17,27,0.1);
  content: '';
}
.tab-item{
  flex:1;
  text-align: center;
}
.tab-item > a {
  display: block;
  font-size: 14px;
  color: rgb(77, 85, 93);
}
.tab-item > a.is-active{
  color: #f01414;
}
</style>
