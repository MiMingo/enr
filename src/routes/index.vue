<template>
  <div id="app">
    <b-container>
      <b-row>
        <b-col>
          <b-jumbotron>
            <template slot="header">{{msg}}</template>
            <p>{{aggregate}}</p>
            <p>{{data.bb_json[0][0].postMessage.messageText}}</p>
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
      bb_json: null
    }
  },
  methods: {
    getData: function() {
      let url = 'samples/bbjson'
      this.$http
        .get(url)
        .then(response => {
          this.data = response.body
          this.bb_json = this.data.bbjson[0]
        })
        .catch(console.error)
    },
    getTemplate: function() {
      let url = 'template/merged'
      this.$http
        .get(url)
        .then(response => {
          this.aggregate = response.body
        })
        .catch(console.error)
    }
  },
  computed: {
    aggregate: function() {
      if (this.data == null || this.template == null) 
        return

      this.bb_json.forEach(tape => {
        this.aggregate.ballots_cast += tape.ballots_cast
      })
    }
  },
  mounted() {
    this.getData()
    this.getTemplate()
  }
}
</script>

<style lang="scss">
</style>