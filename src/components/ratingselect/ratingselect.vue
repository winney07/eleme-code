<template>
  <div class="ratingselect">
        <div class="rating-type">
            <span class="block positive" :class="{'active':sType===2}" @click="select(2,$event)">{{desc.all}}<span class="count">{{ratings.length}}</span></span>
            <span class="block positive" :class="{'active':sType===0}" @click="select(0,$event)">{{desc.positive}}<span class="count" >{{positives.length}}</span></span>
            <span class="block negative" :class="{'active':sType===1}" @click="select(1,$event)">{{desc.negative}}<span class="count">{{negatives.length}}</span></span>
        </div>
        <div @click="toggleContent($event)" class="switch" :class="{'on':oContent}">
            <span class="icon-check_circle"></span>
            <span class="text">只看有内容的评价</span>
        </div>
  </div>
</template>

<script type="text/esmascript-6">
const POSITIVE = 0;
const NEGATIVE = 1;
const ALL = 2;

export default {
  name: 'ratingselect',
  props:{
      ratings: {
          type: Array,
          default() {
              return [];
          }
      },
      selectType: {
          type: Number,
          default: ALL
      },
      onlyContent: {
          type: Boolean,
          default: false
      },
      desc: {
          type: Object,
          default() {
              return {
                  all: '全部',
                  positive: '满意',
                  negative: '不满意'
              };
          }
      }
  },
  data() { 
    return {
        sType: this.selectType,
        oContent:this.onlyContent
    }
  },
  computed: {
      positives() {
          return this.ratings.filter((rating) => {
              return rating.rateType ===  POSITIVE;
          })
      },
      negatives() {
          return this.ratings.filter((rating) => {
              return rating.rateType ===  NEGATIVE;
          })
      },
  },
  methods: {
      select(type, event) {
          if (!event._constructed) {
              return;
          }
          this.sType = type;
          console.log('ratingselect.vue' + type);

          this.$emit('increment','selectType', this.sType);
      },
      toggleContent (event) {
          if (!event._constructed) {
              return;
          }
          this.oContent = !this.oContent;
          console.log('ratingselect.vue' + this.oContent);
          
          this.$emit('increment','onlyContent', this.oContent);
      }
  }
 }
</script>

<style>
.ratingselect .rating-type{
    padding: 18px 0;
    margin: 0 18px;
    border-bottom:1px solid rgba(7, 17, 27, 0.1);
    font-size: 0;
}
.ratingselect .rating-type .block{
    display: inline-block;
    padding: 8px 12px;
    margin-right: 8px;
    line-height: 16px;
    border-radius: 1px;
    font-size: 12px;
    color: rgb(77, 85, 93);
}
.ratingselect .rating-type .block.active{
    color: #fff;
}
.ratingselect .rating-type .block .count{
    margin-left: 2px;
    font-size: 8px;
}
.ratingselect .rating-type .block.positive{
    background: rgba(0, 160, 220, 0.2);
}
.ratingselect .rating-type .block.positive.active{
    background: rgb(0, 160, 220);
}
.ratingselect .rating-type .block.negative{
    background: rgba(77, 85, 93, 0.2);
}
.ratingselect .rating-type .block.negative.active{
    background: rgb(77, 85, 93);
}
.ratingselect .switch{
    padding: 12px 18px;
    line-height: 24px;
    border-bottom: 1px solid rgba(7, 17, 27, 0.1);
    color: rgb(147, 153, 159);
    font-size: 0;
}
.ratingselect .switch.on .icon-check_circle{
    color: #00c850;
}
.ratingselect .switch .icon-check_circle{
    display: inline-block;
    vertical-align: top;
    margin-right: 4px;
    font-size: 24px;
}
.ratingselect .switch .text{
    display: inline-block;
    vertical-align: top;
    font-size: 12px;
}
</style>