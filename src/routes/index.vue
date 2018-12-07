<template>
  <div id="app">
    <b-container>
      <b-row>
        <b-col>
          <b-jumbotron>
            <template slot="header">{{msg}}</template>
            <p>{{aggregate}}</p>
            <p>{{data}}</p>
          </b-jumbotron>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
export default {
  name: 'Index',
  data: () => {
    return {
      msg: 'enr',
      data: null,
      aggregate: null
    }
  },
  methods: {
    bbjson: function() {
      let url = 'samples/bbjson'
      this.$http
        .get(url)
        .then(response => {
          this.data = response.body
        })
        .catch(console.error)
    },
    template: function() {
      let url = 'template/merged'
      this.$http
        .get(url)
        .then(response => {
          this.aggregate = response.body
        })
        .catch(console.error)
    }
  },
  mounted() {
    this.bbjson()
    this.template()
  }
}
</script>

<style lang="scss">
</style>