<template>
  <div class="food" v-show="showFlag">
      fdffdfd
  </div>
</template>

<script type="text/esmascript-6">
export default {
  name: 'food',
  props: {
      food:{
          type: Object
      }
  },
  data() { 
    return {
        showFlag:false
    }
  },
  methods: {
      show() {
          this.showFlag = true;
      }
  }
 }
</script>

<style>
/* .food{
    position: fixed;
    left: 0;
    top: 0;
    bottom: 48px;
    z-index: 30;
    width: 100%;
    background: #fff;
} */
</style>