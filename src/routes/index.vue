<template>
  <div id="app">
    <b-container>
      <b-row>
        <b-col>
          <b-jumbotron>
            <template slot="header">{{msg}}</template>
            <p>{{msg}}</p>
          </b-jumbotron>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
export default {
  name: 'Index',
  data: function () {
    return {
      msg: 'Election Night Reporting'
    }
  }
}
</script>

<style lang="scss">
</style>
