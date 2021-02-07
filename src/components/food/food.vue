<template>
<div>
    <transition name="move">
    <div class="food" v-show="showFlag" key="foodDetail" ref="food">
        <div class="food-content">
            <div class="image-header">
                <img :src="food.image">
                <div class="back" @click="hide">
                    <i class="icon-arrow_lift"></i>
                </div>
            </div>
            <div class="content">
                <h1 class="title">{{food.name}}</h1>
                <div class="detail">
                    <span class="sell-count">月售{{food.sellCount}}}份</span>
                    <span class="rating">好评率{{food.rating}}}%</span>
                </div>
                <div class="price">
                    <span class="now">￥{{food.price}}</span><span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                </div>
                <div class="cartcontrol-wrapper">
                    <cartcontrol :food="food"></cartcontrol>
                </div>
                <transition>
                    <div class="buy" v-show="!food.count || food.count ===0" @click.stop.prevent="addFirst">
                        加入购物车
                    </div>
                </transition>
            </div>
            <split v-show="food.info"></split>
            <div class="info" v-show="food.info">
                <h1 class="info">商品信息</h1>
                <p class="text">{{food.info}}</p>
            </div>
            <split></split>
            <div class="rating">
                <h1 class="title">商品评价</h1>
                <ratingselect @increment="incrementTotal" :select-type="selectType" :only-content="onlyContent" :desc="desc" :ratings="food.ratings"></ratingselect>
                <div class="rating-wrapper">
                    <ul v-show="food.ratings && food.ratings.length">
                        <li v-show="needShow(rating.rateType, rating.text)"  class="rating-item border-1px" v-for="(rating,index) in food.ratings">
                            <div class="user">
                                <span class="name">{{rating.username}}</span>
                                <img :src="rating.avator" class="avator" width="12" height="12" alt="">
                            </div>
                            <div class="time">{{formatDate(rating.rateTime)}}</div>
                            <p class="text">
                                <span :class="{'icon-thumb_up':rating.rateType === 0, 'icon-thumb_down':rating.rateType ===1}"></span>{{rating.text}}
                            </p>
                        </li>
                    </ul>
                    <div class="no-ratings" v-show="!food.ratings || !food.ratings.length">暂无评价</div>
                </div>
            </div>
        </div>
    </div>
    </transition>
</div>
</template>

<script type="text/esmascript-6">
import BScroll from 'better-scroll'
import Vue from 'vue';
import cartcontrol from '../cartcontrol/cartcontrol'
import split from '../split/split'
import ratingselect from '../ratingselect/ratingselect'

const ALL = 2;
export default {
  name: 'food',
  props: {
      food:{
          type: Object
      }
  },
  data() { 
    return {
        showFlag:false,
        selectType: ALL,
        onlyContent:  true,
        desc: {
            all: '全部',
            positive: '推荐',
            negative: '吐槽'
        },
    };
  },
  components: {
      cartcontrol,
      split,
      ratingselect
  },
  methods: {
      show() {
          this.showFlag = true;
          this.selectType = ALL;
          this.onlyContent = true;
          this.$nextTick(() => {
              if (!this.scroll) {
                  this.scroll = new BScroll (this.$refs.food, {
                      click:true
                  });
              }else{
                  this.scroll.refresh();
              }
          });
      },
      hide() {
          this.showFlag = false;
      },
      addFirst(event) {
        if(!event._constructed) {
            return;
        }
         this.$emit('cart.add', event.target);
        Vue.set(this.food, 'count', 1);
      },
      incrementTotal(type, data) {
          this[type] = data;
          this.$nextTick(() => {
              this.scroll.refresh();
          })
      },
      needShow(type, text) {
          if(this.onlyContent && !text) {
              return false;
          }
          if(this.selectType === ALL) {
              return true;
          } else {
              return type === this.selectType;
          }
      },
      formatDate(time) {
            // 时间格式
            var fmt = 'yyyy-MM-dd hh:mm'
            // 转为Date对象
            var date = new Date(time);
        
            // 正则匹配，并替换
            if(/(y+)/.test(fmt)) { // 年
                // RegExp.$1获取到正则对应的第一个元素yyyy
                var year = date.getFullYear() + '';
                fmt = fmt.replace(RegExp.$1, year);
            }
            if(/(M+)/.test(fmt)) { // 月
                var month = date.getMonth() + 1;
                if(month < 10) {
                    month = '0' + month;
                }
                fmt = fmt.replace(RegExp.$1, month);
            }
            if(/(d+)/.test(fmt)) { // 日
                var mydate = date.getDate() + '';
                if(mydate < 10) {
                    mydate = '0' + mydate;
                }
                fmt = fmt.replace(RegExp.$1, mydate);
            }
            if(/(h+)/.test(fmt)) { // 时
                var hours = date.getHours() + '';
                if(hours < 10) {
                    hours = '0' + hours;
                }
                fmt = fmt.replace(RegExp.$1, hours);
            }
            if(/(m+)/.test(fmt)) { // 分
                var minu = date.getMinutes() + '';
                if(minu < 10) {
                    minu = '0' + minu;
                }
                fmt = fmt.replace(RegExp.$1, minu);
            }
        
            return fmt;
        },
  },
 }
</script>

<style>
.food{
    position: fixed;
    left: 0;
    top: 0;
    bottom: 48px;
    z-index: 30;
    width: 100%;
    background: #fff;
}
.move-enter-active, .move-leave-active{
    transition: all 0.2s linear;
    transform: translate3d(0, 0, 0);
}
.move-enter,.move-leave-to{
    transform: translate3d(100%, 0, 0);
}
/* 给图片固定宽高 */
.image-header{
    position: relative;
    width: 100%;
    height: 0;
    padding-top: 100%;
}
.image-header img{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}
.back{
    position: absolute;
    top: 10px;
    left: 0;
}
.back  .icon-arrow_lift{
    display: block;
    padding: 10px;
    font-size: 20px;
    color: #fff;
}
.food-content .content{
    position: relative;
    padding: 18px;
}
.food-content .content .title{
    line-height: 14px;
    margin-bottom:8px;
    font-size: 14px;
    font-weight: 700;
    color: rgb(7, 17, 27);
}
.food-content .content .detail{
    margin-bottom: 18px;
    line-height: 10px;
    height: 10px;
    font-size: 0;
}
.food-content .content .detail .sell-count,.food-content .content .detail .rating{
    font-size: 10px;
    color: rgb(147, 153, 159);
}
.food-content .content .detail .sell-count{
    margin-right: 12px;
}
.food-content .content .price{
    font-weight: 700;
    line-height: 24px;
}
.food-content .content .price .now{
    margin-right: 8px;
    font-size: 14px;
    color: rgb(240, 20, 20);
}
.food-content .content .price .old{
    text-decoration: line-through;
    font-size: 10px;
    color: rgb(147, 153, 159);
}
.cartcontrol-wrapper{
    position: absolute;
    right: 12px;
    bottom:12px;
}
.buy{
    position: absolute;
    right: 18px;
    bottom: 18px;
    z-index: 10;
    height: 24px;
    line-height: 24px;
    padding: 0 12px;
    box-sizing: border-box;
    border-radius: 12px;
    font-size: 10px;
    color: #fff;
    background: rgb(0, 160, 220);
}
 .buy .fade-enter-active, .buy .fade-leave{
    transition: all 0.2s;
    opacity: 1;
}
.buy .fade-enter,.buy .fade-leave-to{
    opacity: 0;
}
.info {
    padding:18px;
}
.info .title{
    line-height: 14px;
    margin-bottom: 6px;
    font-size: 14px;
    color: rgb(7, 17, 27);
}
.info .text{
    line-height: 24px;
    padding: 0 8px;
    font-size: 12px;
    color: rgb(77, 85, 93);
}
.rating{
    padding-top: 18px;
}
.rating .title{
    line-height: 14px;
    margin-left: 18px;
    font-size: 14px;
    color: rgb(7, 17, 27);
}
.rating-wrapper{
    padding: 0 18px
}
.rating-wrapper .rating-item{
    position: relative;
    padding: 16px 0;
    border-bottom:1px solid rgba(7, 17, 27, 0.1);
}
.rating-wrapper .rating-item .user {
    position: absolute;
    right: 0;
    top: 16px;
    line-height: 12px;
    font-size: 0;
}
.rating-wrapper .rating-item .user .name{
    display: inline-block;
    margin-right: 6px;
    vertical-align: top;
    font-size: 10px;
    color: rgb(147, 153, 159);
}
.rating-wrapper .rating-item .user .avatar{
    border-radius: 50%;
}
.rating-wrapper .rating-item .time{
    margin-bottom: 6px;
    line-height: 12px;
    font-size: 10px;
    color: rgb(147, 153, 159);
}
.rating-wrapper .rating-item .text{
    line-height: 16px;
    font-size: 12px;
    color: rgb(7, 17, 27);
}
.rating-wrapper .rating-item .text .icon-thumb_up,
.rating-wrapper .rating-item .text .icon-thumb_down{
    margin-right: 4px;
    line-height: 16px;
    font-size: 12px;
}
.rating-wrapper .rating-item .text .icon-thumb_up{
    color: rgb(0, 160, 220);
}
.rating-wrapper .rating-item .text .icon-thumb_down{
    color: rgb(147, 153, 159)
}
.no-ratings{
    padding: 16px 0;
    font-size: 12px;
    color: rgb(147, 153, 159);
}
</style>