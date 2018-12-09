<template>
  <div id="app">
    <b-container>
      <b-row>
        <b-col>
          <b-jumbotron>
            <template slot="header">{{msg}}</template>
            <p>{{aggregate}}</p>
            <hr/>
            <p>{{results}}</p>
            <hr/>
            <p>{{tables}}</p>
          </b-jumbotron>

          <h1 class='text-center'>Georgia Election Results</h1>
          <h2>Governor</h2>
          <GovernorResults v-if="tables" :table="tables.Governor"></GovernorResults>

          <h2>U.S. House</h2>
          <h2>U.S. Senate</h2>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import GovernorResults from '../components/governor-results.vue'
export default {
  name: 'Index',
  components: {GovernorResults},
  data: () => {
    return {
      msg: 'enr',
      data: null,
      template: null,
      refreshInterval: null,
      party: {
        "Hank Johnson": 'D',
        "Joe Profit": 'R',
        "Lucy McBath": 'D',
        "Karen Handel": 'R',
        "Rob Woodall": 'R',
        "Carolyn Bourdeaux": 'D',
        "Brian Kemp": 'R',
        "Stacey Abrams": 'D',
        "Ted Metz": 'L',
        "Melinda Harrington": 'D',
        "Doyle Yates": 'R',
        "Sanford Bishop": 'D',
        "Herman West": 'R',
        "Drew Ferguson": 'R',
        "Chuck Enderlin": 'D',
      },
      statewide: {
        'Governor': true,
      }
    }
  },
  methods: {
    getData: function() {
      let url = 'bulletin'
      this.$http
        .get(url)
        .then(response => {
          this.data = []
          let json = response.body.bb_json[0]
          for (let i in json) {
            console.log(JSON.parse(json[i].postMessage.messageText))
            this.data.push(JSON.parse(json[i].postMessage.messageText))
          }
        })
        .catch(console.error)
    },
    getTemplate: function() {
      let url = 'template/merged'
      this.$http
        .get(url)
        .then(response => {
          this.template = response.body
        })
        .catch(console.error)
    },
    getVotes: function(race, district, candidate) {
      let votes = 0
      let errors = []

      // For each precinct, get counts for the candidate.
      // Use majority vote to determine.
      // Check for discrepancies.
      for (let precinct of Object.keys(this.aggregate.races[race][district])) {
        let counts = this.aggregate.races[race][district][precinct][candidate]
        let set = new Set(counts)
        if (set.size > 1)
          errors.push(set)
        let majority = this.mode(counts)
        votes += majority
      }
      return {votes, errors}
    },
    mode: function(arr) {
      let counts = {}
      let max_count = 0
      let max_val = 0
      for (let val of arr) {
        if (!counts.hasOwnProperty(val))
          counts[val] = 0
        counts[val] += 1

        if (counts[val] > max_count) {
          max_count = counts[val]
          max_val = val
        }
      }
      return max_val
    }
  },
  computed: {
    aggregate: function() {
      if (!this.template || !this.data)
        return null

      let agg = this.template
      this.data.forEach(tape => {
        let dname = `district${tape.district}`
        let pname = `precinct${tape.precinct}`

        // add partials to the aggregate
        agg.ballots_cast += parseInt(tape.ballots_cast)
        for (let race of tape.races) {
          let rname = race.race_name
          for (let candidate of race.candidates) {
            let cname = candidate.name
            let cvotes = candidate.votes
            agg.races[rname][dname][pname][cname].push(parseInt(cvotes))
          }
        }
      })
      return agg
    },
    results: function() {
      if (!this.aggregate)
        return null
      
      let res = {}
      for (let race of Object.keys(this.aggregate.races)) {
        res[race] = {}
        if (this.statewide[race]) {
          res[race].total = 0
          for (let dist of Object.keys(this.aggregate.races[race])) {
            for (let cand of Object.keys(this.aggregate.races[race][dist].precinct1)) {
              if (!res[race].hasOwnProperty(cand))
                res[race][cand] = 0

              let cand_votes = this.getVotes(race, dist, cand).votes
              res[race][cand] += cand_votes
              res[race].total += cand_votes
            }
          }
        }
        else {
          for (let dist of Object.keys(this.aggregate.races[race])) {
            res[race][dist] = {total: 0}
            for (let cand of Object.keys(this.aggregate.races[race][dist].precinct1)) {
              if (!res[race][dist].hasOwnProperty(cand))
                res[race][dist][cand] = 0

              let cand_votes = this.getVotes(race, dist, cand).votes
              res[race][dist][cand] += cand_votes
              res[race][dist].total += cand_votes
            }
          }
        }

      }
      console.log(res)
      return res
    },
    tables: function() {
      if (!this.results)
        return null

      let tbls = {}

      for (let race of Object.keys(this.results)) {
        // For state-wide races
        if (this.statewide[race]) {
          tbls[race] = {
            'fields': [
              {key: 'candidate', label: 'Candidate'}, 
              {key: 'party', label: 'Party'}, 
              {key: 'votes', label: 'Votes', sortable: true}, 
              {key: 'pct', label: 'Pct'}
            ],
            'items': []
          }
          for (let cand of Object.keys(this.results[race])) {
            if (/total/.test(cand)) continue
            tbls[race].items.push({
              'candidate': cand,
              'votes': this.results[race][cand],
              'party': this.party[cand],
              'pct': this.results[race][cand] / this.results[race].total
            })
          }
        } // statewide
        else {
          tbls[race] = {
            'fields': ['District', 'Winning Candidate', 'Losing Candidate'],
            'items': []
          }

          for (let dist of Object.keys(this.results[race])) {
            let cands = []
            for (let cand of Object.keys(this.results[race][dist])) {
            if (/total/.test(cand)) continue
              cands.push({
                'candidate': cand,
                'votes': this.results[race][dist][cand],
                'party': this.party[cand],
                'pct': this.results[race][dist][cand] / this.results[race][dist].total
              })
              cands.sort((a, b) => -(a.votes - b.votes))
    
            }
            tbls[race].items.push({
              district: dist,
              winner: cands[0],
              loser: cands[1]
            })
          }
        }
      }

      console.log(tbls)
      return tbls
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