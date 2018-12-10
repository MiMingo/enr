<template>
  <div id="app">
    <b-container class='my-5'>
      <b-row>
        <b-col>
          <CorruptionWarning v-if="corrupted" :tables="tables"></CorruptionWarning>
          <ElectionResults v-else :tables="tables"></ElectionResults>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import CorruptionWarning from '../components/corruption-warning.vue'
import ElectionResults from '../components/election-results.vue'

export default {
  name: 'Index',
  components: {CorruptionWarning, ElectionResults},
  data: () => {
    return {
      corrupted: false,
      data: null,
      template: null,
      refreshInterval: null,
      colors: {
        'D': 'primary',
        'R': 'danger',
        'L': 'success'
      },
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
    parseResponse: function(response) {
      this.data = []
      let json = response.body.bb_json[0]
      for (let i in json) {
        this.data.push(JSON.parse(json[i].postMessage.messageText))
      }
    },
    getData: function() {
      let url = 'bulletin'
      this.$http
        .get(url)
        .then(response => {
          console.log('retrieved bb.json')
          this.corrupted = false
          this.parseResponse(response)
        })
        .catch(response => {
          if (response.status == 500) {
            this.corrupted = true
            console.error(response)
            this.parseResponse(response)
          }
        })
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
          res[race].meta = {total: 0, errors: []}
          for (let dist of Object.keys(this.aggregate.races[race])) {
            for (let cand of Object.keys(this.aggregate.races[race][dist].precinct1)) {
              if (!res[race].hasOwnProperty(cand))
                res[race][cand] = 0

              let vote_resp = this.getVotes(race, dist, cand)
              let cand_votes = vote_resp.votes
              if (vote_resp.errors.length) {
                res[race].meta.errors.push(vote_resp.errors)
              }
              res[race][cand] += cand_votes
              res[race].meta.total += cand_votes
            }
          }
        }
        else {
          for (let dist of Object.keys(this.aggregate.races[race])) {
            res[race][dist] = {meta: {total: 0, errors: []}}
            for (let cand of Object.keys(this.aggregate.races[race][dist].precinct1)) {
              if (!res[race][dist].hasOwnProperty(cand))
                res[race][dist][cand] = 0

              let vote_resp = this.getVotes(race, dist, cand)
              let cand_votes = vote_resp.votes
              if (vote_resp.errors.length) {
                res[race][dist].meta.errors.push(vote_resp.errors)
              }
              res[race][dist][cand] += cand_votes
              res[race][dist].meta.total += cand_votes
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
              {key: 'votes', label: 'Votes'}, 
              {key: 'pct', label: 'Pct (%)'},
              {key: 'errors', label: ' '}
            ],
            'items': []
          }
          for (let cand of Object.keys(this.results[race])) {
            if (/meta/.test(cand)) continue
            let row = {
              'candidate': cand,
              'votes': this.results[race][cand],
              'party': this.party[cand],
              'pct': this.results[race][cand] / this.results[race].meta.total,
              'errors': this.results[race].meta.errors
            }
            if (row.pct > 0.5) {
              row._cellVariants = {candidate: this.colors[row.party]}
            }
            tbls[race].items.push(row)
          }
        } // statewide
        else {
          tbls[race] = {
            'fields': [
              {key: 'district', label: 'District'},
              {key: 'winner', label: 'Winning Candidate'},
              {key: 'loser', label: 'Losing Candidate'},
              {key: 'errors', label: ' '}
            ],
            'items': []
          }

          for (let dist of Object.keys(this.results[race])) {
            let cands = []
            let _cellVariants = {}
            for (let cand of Object.keys(this.results[race][dist])) {
              if (/meta/.test(cand)) continue
              let crow = {
                'district': dist,
                'candidate': cand,
                'votes': this.results[race][dist][cand],
                'party': this.party[cand],
                'pct': this.results[race][dist][cand] / this.results[race][dist].meta.total,
              }
              if (crow.pct > 0.5) {
                _cellVariants = {winner: this.colors[crow.party]}
              }
              cands.push(crow)
            }
            cands.sort((a, b) => -(a.votes - b.votes))
            tbls[race].items.push({
              district: dist,
              winner: cands[0],
              loser: cands[1],
              errors: this.results[race][dist].meta.errors,
              _cellVariants
            })
          }
        }
      }
      return tbls
    }
  },
  mounted() {
    this.getData()
    this.refreshInterval = setInterval(() => {
      this.getData()
    }, 10000)
    this.getTemplate()
  }
}
</script>

<style lang="scss">
</style>