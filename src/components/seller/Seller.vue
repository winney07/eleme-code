<template>
  <!-- seller视口高度  当内容的高度超过视口的高度就滚动--> 
  <div class="seller" ref="seller">
      <div class="seller-content">
        <div class="overview">
          <h1 class="title">{{seller.name}}</h1>
          <div class="desc border-1px">
            <star :size="36" :score="seller.score"></star>
            <span class="text">({{seller.ratingCount}})</span>
            <span class="text">月售{{seller.sellCount}}单</span>
          </div>
          <ul class="remark">
            <li class="block">
              <h2>起送价</h2>
              <div class="content">
                <span class="stress">{{seller.minPrice}}</span>元
              </div>
            </li>
            <li class="block">
              <h2>商家配送</h2>
              <div class="content">
                <span class="stress">{{seller.deliveryPrice}}</span>元
              </div>
            </li>
            <li class="block">
              <h2>平均配送时间</h2>
              <div class="content">
                <span class="stress">{{seller.deliveryTime}}</span>
              </div>
            </li>
          </ul>
          <div class="favorite" @click="toggleFavorite">
            <span class="icon-favorite" :class="{'active':favorite}"></span>
            <span class="text">{{favoriteText}}</span>
          </div>
        </div>
        <split></split>
        <div class="bulletin">
          <h1 class="title">公告与活动</h1>
          <div class="content-wrapper border-1px">
            <p class="content">{{seller.bulletin}}</p>
          </div>
          <ul class="supports" v-if="seller.supports">
            <li class="support-item border-1px" v-for="(item, index) in seller.supports">
              <span class="icon" :class="classMap[seller.supports[index].type]"></span>
              <span class="text">{{seller.supports[index].description}}</span>
            </li>
          </ul>
        </div>
        <split></split>
        <div class="pics">
          <h1 class="title">商家实景</h1>
          <div class="pic-wrapper" ref="picWrapper">
            <ul class="pic-list" ref="picList">
              <li class="pic-item" v-for="pic in seller.pics">
                <img :src="pic" width="120" height="90" alt="">
              </li>
            </ul>
          </div>
        </div>
        <split></split>
        <div class="info">
          <h1 class="title border-1px">商家信息</h1>
          <ul>
            <li class="info-item" v-for="info in seller.infos">{{info}}</li>
          </ul>
        </div>
      </div>
  </div>
</template>

<script type="text/esmascript-6">
import BScroll from "better-scroll";
import { saveToLocal, loadFromLocal } from "../../common/js/store";
import star from "../star/star";
import split from "../split/split";
export default {
  name: "",
  props: {
    seller: {
      type: Object
    }
  },
  components: {
    star,
    split
  },
  data() {
    return {
      favorite: (() => {
          return loadFromLocal(this.seller.id, 'favorite', false);
      })(),
      sellerId: this.seller.id
    };
  },
  created() {
    this.classMap = ["decrease", "discount", "special", "invoice", "guarantee"];
  },
  computed: {
    favoriteText() {
      return this.favorite ? "已收藏" : "收藏";
    }
  },
  watch: {
    seller() {
      this._initScroll();
      this._initPics();
    }
  },
  //当dom准备好之后
  mounted() {
    // console.log(this.seller);滑动不了 没有值，因为seller是异步拿到的数据，所以要用watch来watch这个seller的变化
  //  点击了商品、评价页面，再回来点击商家页面，拖动不了，因为页面重绘了，所以需要在mounted中加this._initScroll();给这个方法加上this.scroll.refresh();
   this._initScroll();
   this._initPics();
  },
  methods: {
    toggleFavorite(event) {
      if(!event._constructed) {
        return;
      }
      
      this.favorite = !this.favorite;
      saveToLocal(this.sellerId, 'favorite', this.favorite);
    },
    _initScroll() {
      if (!this.scroll) {
        this.scroll = new BScroll(this.$refs.seller, {
          click: true
        });
      } else {
        this.scroll.refresh();
      }
    },
    _initPics() {
      if(this.seller.pics) {
        let picWidth = 120;
        let margin = 6;
        let width = (picWidth + margin) * this.seller.pics.length - margin;
        this.$refs.picList .style.width = width + 'px';
        this.$nextTick(() => {
          if(!this.picScroll) {
            this.picScroll = new BScroll(this.$refs.picWrapper, {
              scrollX: true,
              eventPassthrough: 'vertical'
            });
          } else  {
            this.picScroll.refresh();
          }
        });
      }
    }
  }
};
</script>

<style>
.border-1px {
  border-bottom: 1px solid rgba(7, 17, 27, 0.1);
}
.seller {
  position: absolute;
  top: 174px;
  bottom: 0;
  left: 0;
  width: 100%;
  overflow: hidden;
}
.overview {
  position: relative;
  padding: 18px;
}
.overview .title {
  margin-bottom: 8px;
  line-height: 14px;
  color: rgb(7, 17, 27);
  font-size: 14px;
}
.overview .desc {
  padding-bottom: 18px;
  border-bottom: 1px solid rgba(7, 17, 27, 0.1);
  font-size: 0;
}
.overview .desc .star {
  display: inline-block;
  margin-right: 8px;
  vertical-align: top;
}
.overview .desc .text {
  display: inline-block;
  margin-right: 12px;
  line-height: 18px;
  vertical-align: top;
  font-size: 10px;
  color: rgb(77, 85, 93);
}
.overview .remark {
  display: flex;
  padding-top: 18px;
}
.overview .remark .block {
  flex: 1;
  text-align: center;
  border-right: 1px solid rgba(7, 17, 27, 0.1);
}
.overview .remark .block:last-child {
  border: none;
}
.overview .remark .block h2 {
  margin-bottom: 4px;
  line-height: 10px;
  font-size: 10px;
  color: rgb(147, 153, 159);
}
.overview .remark .block .content {
  line-height: 24px;
  font-size: 10px;
  color: rgb(7, 17, 27);
}
.remark .block .content .stress {
  font-size: 24px;
}
.favorite {
  position: absolute;
  width: 50px;
  right: 11px;
  top: 18px;
  text-align: center;
}
.favorite .icon-favorite {
  display: block;
  margin-bottom: 4px;
  line-height: 24px;
  font-size: 24px;
  color: #d4d6d9;
}
.favorite .icon-favorite.active {
  color: rgb(240, 20, 20);
}
.favorite .text {
  line-height: 10px;
  font-size: 10px;
  color: rgb(77, 85, 93);
}

.bulletin {
  padding: 18px 18px 0 18px;
}
.bulletin .title {
  margin-bottom: 8px;
  line-height: 14px;
  color: rgb(7, 17, 27);
  font-size: 14px;
}
.bulletin .content-wrapper {
  padding: 0 12px 16px 12px;
  border-bottom: 1px solid rgba(7, 17, 27, 0.1);
}
.bulletin .content-wrapper .content {
  line-height: 24px;
  font-size: 12px;
  color: rgb(240, 20, 20);
}
.bulletin .supports .support-item {
  padding: 16px 12px;
  border-bottom: 1px solid rgba(7, 17, 27, 0.1);
  font-size: 0;
}
.bulletin .supports .support-item:last-child:after {
  border-bottom: 0;
}
.bulletin .supports .icon {
  display: inline-block;
  width: 16px;
  height: 16px;
  vertical-align: top;
  margin-right: 6px;
  background-size: 16px 16px;
  background-repeat: no-repeat;
}
.bulletin .supports .icon.decrease {
  background-image: url("decrease_4@2x.png");
}
.bulletin .supports .icon.discount {
  background-image: url("discount_4@2x.png");
}
.bulletin .supports .icon.guarantee {
  background-image: url("guarantee_4@2x.png");
}
.bulletin .supports .icon.invoice {
  background-image: url("invoice_4@2x.png");
}
.bulletin .supports .icon.special {
  background-image: url("special_4@2x.png");
}
.bulletin .supports .text {
  line-height: 16px;
  font-size: 12px;
  color: rgb(7, 17, 27);
}
.pics {
  padding: 18px;
}
.pics .title {
  margin-bottom: 12px;
  line-height: 14px;
  color: rgb(7, 17, 27);
  font-size: 14px;
}
.pics .pic-wrapper {
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
}
.pics .pic-wrapper .pic-list {
  font-size: 0;
}
.pics .pic-wrapper .pic-list .pic-item {
  display: inline-block;
  margin-right: 6px;
  width: 120px;
  height: 90px;
}
.pics .pic-wrapper .pic-list .pic-item:last-child {
  margin: 0;
}
.info{
  padding: 18px 18px 0 18px;
  color: rgb(7,17,27);
}
.info .title{
  padding-bottom: 12px;
  line-height: 14px;
  border-bottom: 1px solid rgba(7,17,27,0.1);
}
.info .info-item{
  padding: 16px 12px;
  line-height: 16px;
  border-bottom:1px solid rgba(7,17,27,0.1);
  font-size: 12px;
}
.info .info-item:last-child:after{
  display: none;
}
</style> 