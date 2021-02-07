<template>
  <div class="goods">
      <div class="menu-wrapper" ref="menuWrapper">
        <ul>
          <li v-for="(item,index) in goods" class="menu-item border-1px" :class="{'current':currentIndex===index}" @click="selectMenu(index, $event)">
              <span class="text">
                <span class="icon" v-show="item.type >0" :class="classMap[item.type]"></span>{{item.name}}
              </span>
          </li>
        </ul>
      </div>
      <div class="foods-wrapper" ref="foodsWrapper">
        <ul>
          <li v-for="item in goods" class="food-list food-list-hook">
            <h1 class="title">{{item.name}}</h1>
            <ul>
              <li v-for="food in item.foods" class="food-item border-1px" @click="selectFood(food,$event)">
                <div class="icon">
                  <img :src="food.icon" width="57" height="57">
                </div>
                <div class="content">
                  <h2 class="name">{{food.name}}</h2>
                  <p class="desc">{{food.description}}</p>
                  <div class="extra">
                    <span class="count">月售{{food.sellCount}}份</span>
                    <span>好评率{{food.rating}}%</span>
                  </div>
                  <div class="price">
                    <span class="now">￥{{food.price}}</span>
                    <span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                  </div>
                  <div class="cartcontrol-wrapper">
                    <cartcontrol :food="food" v-on:cart-add="cartAdd"></cartcontrol>
                  </div>
                </div>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <food :food="selectedFood" ref="food"></food>
      <shopcart ref="shopcart" :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice" :select-foods="selectFoods"></shopcart>
  </div>
</template>

<script type="text/esmascript-6">
import BScroll from 'better-scroll'
import shopcart from '../shopcart/shopcart'
import cartcontrol from '../cartcontrol/cartcontrol'
import food from '../food/food'

const ERR_OK = 0;

export default {
  name: '',
  // 要返回过去的数据seller
  props:{
    seller: {
      type: Object
    }
  },
  components: {
    food,shopcart,cartcontrol
  },
  data() { 
    return {
      goods: [],
      selectedFood: {},
      listHeight: [],
      scrollY: 0
    }
  },
  computed: {
    currentIndex() {
      for (let i = 0; i< this.listHeight.length; i++){
        let height1 = this.listHeight[i];
        let height2 = this.listHeight[i+1];
        if(!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
          return i;
        }
      }
      return 0;
    },
    //加上这个，让shopcart组件跟cartcontrol组件连接在一起
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
    },
  },
  created() {
    this.classMap = ['decrease','discount','guarantee','invoice','special'],
    this.$http.get('/api/goods').then((response) => {
      response = response.body;
      if(response.errno === ERR_OK){
        this.goods = response.data;
        this.$nextTick(() => {
          this._initScroll();
          this._calculateHeight();
        });
      }
    })
  },
  methods: {
    cartAdd(el){
      this.$nextTick(() => {
        this.$refs['shopcart'].drop(el);
      });
    },
    _drop(target) {
      // 体验优化,异步执行下落动画
        this.$nextTick(() => {
          this.$refs.shopcart.drop(target);
        });
    },
    _initScroll() {
      this.menuScroll = new BScroll(this.$refs.menuWrapper,{
        click:true
      });
      this.foodsScroll = new BScroll(this.$refs.foodsWrapper,{
        click:true,
        probeType: 3
      });

      this.foodsScroll.on('scroll', (pos) => {
        this.scrollY = Math.abs(Math.round(pos.y));
      });
    },
    _calculateHeight(){
      let foodlist =  this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
      let height = 0;
      this.listHeight.push(height);
      for (let i = 0; i < foodlist.length; i++) {
        let item  = foodlist[i];
        height += item.clientHeight;
        this.listHeight.push(height);
      }
    },
    selectFood(food, event) {
      if (!event._constructed) {
        return;
      }
      this.selectedFood = food;
      this.$refs.food.show();
    },
    selectMenu(index, event) {
      if(!event._constructed) {
        return;
      }
      let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
      let el = foodList[index];
      this.foodsScroll.scrollToElement(el, 300);
    }
  },
  // events: {
  //   //点击的时候，拿到组件的元素
  //   'cart.add'(target) {
  //     this._drop(target);
  //   }
  // }
  
 }
</script>

<style>
  .goods{
    display: flex;
    position:absolute;
    width:100%;
    top:174px;
    bottom: 46px;
    overflow: hidden;
  }
  .menu-wrapper{
    flex:0 0 80px;  /*左侧宽度和位置是固定的，右侧随着屏幕的变化而变化*/
    width: 80px; /*写上这个是因为在有些安卓手机上会出问题，所以需要设置80px */
    background: #f3f5f7;
  }
  
  /* display:table 不管是一行还是两行，都可以垂直居中 */
.menu-item{
  display:table;
  height: 54px;
  width: 56px;
  padding: 0 12px;
  line-height: 14px;
}

  .menu-item .icon{
  display: inline-block;
  width: 12px;
  height: 12px;
  vertical-align: top;
  margin-right: 6px;
  background-size: 12px 12px;
  background-repeat: no-repeat;
}
.menu-item .icon.decrease{
  background-image: url(decrease_3@2x.png)
}
.menu-item .icon.discount{
  background-image: url(discount_3@2x.png)
}
.menu-item .icon.guarantee{
  background-image: url(guarantee_3@2x.png)
}
.menu-item .icon.invoice{
  background-image: url(invoice_3@2x.png)
}
.menu-item .icon.special{
  background-image: url(special_3@2x.png)
}
.menu-item .text{
  display: table-cell;
  width:56px;
  vertical-align: middle;
  font-size: 12px;
  font-weight: 700;
}
.current{
  position: relative;
  z-index: 10;
  margin-top: -1px;
  background: #fff;
  font-weight: 700;
}
.current .text{
  border-bottom:0;
}
.border-1px{
  position: relative
}
.border-1px:after{
  display: block;
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    border-top: 1px solid rgba(7, 17, 27, 0.1);
    content: ' ';
}
.foods-wrapper{
  flex:1;
}
.foods-wrapper .title{
  padding-left: 14px;
  height: 26px;
  line-height: 26px;
  border-left: 2px solid #d9dde1;
  font-size: 12px;
  color: rgb(147, 153, 159);
  background: #f3f5f7;
}
.foods-wrapper .food-item{
  display: flex;
  margin: 18px;
  padding-bottom: 18px;
}
.foods-wrapper .food-item:last-child::after{
  display: none;
  margin-bottom: 0;
}
.foods-wrapper .food-item .icon{
  flex:0 0 57px;
  margin-right: 10px;
}
.foods-wrapper .food-item .content{
  flex:1;
}
.food-item .content .name{
  margin: 2px 0 8px 0;
  height: 14px;
  line-height: 14px;
  font-size: 14px;
  color: rgb(7, 17, 27);
}
.food-item .content .desc, .food-item .content .extra{
  line-height: 10px;
  font-size: 10px;
  color: rgb(147, 153, 159);
}
.food-item .content .desc{
  line-height: 12px;
  margin-bottom: 8px;
}
.food-item .content .extra .count{
  margin-right: 12px;
}
.food-item .content .price{
  font-weight: 700;
  line-height: 24px;
}
.food-item .content .price .now{
  margin-right: 8px;
  font-size: 14px;
  color: rgb(240, 20, 20);
}
.food-item .content .price .old{
  text-decoration: line-through;
  font-size: 10px;
  color: rgb(147, 153, 159);
}
.food-item .content .cartcontrol-wrapper{
  position: absolute;
  right: 0;
  bottom: 12px;
}
.bulletin{
  width: 80%;
  margin: 0 auto;
}
.bulletin .content{
  font-size: 12px;
  line-height: 1.8;
  text-indent: 2em;
  text-align: justify;
}
</style>