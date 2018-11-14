<template>
  <div id="app">
    <b-container>
      <b-row>
        <b-col>
          <b-jumbotron>
            <template slot="header">{{msg}}</template>
          </b-jumbotron>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
export default {
  name: 'NotFound',
  data: function () {
    return {
      msg: '404'
    }
  }
}
</script>

<style lang="scss">
</style>
