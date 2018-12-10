<template>
    <div>
        <!--test of rendering multiple child components using v-for with range-->
        
        <Block v-for="(block, index) in blocks"
        v-bind:blockMessage="block"
        v-bind:blockIndex="index">

        </Block>
    </div>
    
</template>

<script>
// Displays the verifiable block chain from t=0 to t=now()
import Block from './block.vue'
export default {

    name: 'BlockChain',
    data: () => {
        return {
            // THIS IS ONLY A PLACE-HOLDER
        }
    },
    methods: {
        // THIS IS ONLY A PLACE-HOLDER
    },
    components: {
        Block
    },
    props: ['blocks'],
}
</script>

<style>

</style>
