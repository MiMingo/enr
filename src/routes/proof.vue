<template>
  <div>
    <!-- PASS THE LIST OF BB-POSTS --> 
    <!-- {{bbPosts}} -->

    <!-- VERIFY IF MORE IS NEEDED TO BE PASSED TO PROPS-->
    <BlockChain v-bind:blocks="bbPosts['bb_json'][0]">

    </BlockChain>
    <!-- {{bbPosts}} -->
  </div>
</template>
8
<script>
// import Block from '../components/block.vue'
import BlockChain from '../components/block-chain.vue'
export default {
  
  name: 'Proof',
  data: () => {
    return {
      bbPosts: null,
    }
  },
  methods: {
    // Acquire Data from Bulletin Board
    getBBPosts: function () {
      // TODO: REPLACE THIS WITH 'bulletin' ENDPOINT AFTER TESTING
      let url = 'bulletin';

      // UPDATED: Using Vue-Resource Library 
      this.$http.get(url).then(response => {
        this.bbPosts = response.body;
        console.log(response.body);
      }).catch(console.error)
    }
  },
  mounted() {
    this.getBBPosts();
  },
  components: {
    BlockChain
  }
}
</script>

<style lang='scss'>

</style>
