<template>
<div>
  <h1 class='text-center'>Election Results</h1>

  <div class='text-center mb-5'>
    You can view the necessary information to proof the integrity of these results here:
    <router-link to="/proof">Proof of Results</router-link>
  </div>

  <h2 class='mb-3'>Governor</h2>
  <StatewideRaceResults class='mb-5' v-if="tables" :table="tables.Governor"></StatewideRaceResults>

  <h2 class='mb-3'>U.S. House</h2>
  <DistrictwideRaceResults class='mb-5' v-if="tables" :table="tables.House"></DistrictwideRaceResults>

  <h2 class='mb-3'>U.S. Senate</h2>
  <DistrictwideRaceResults class='mb-5' v-if="tables" :table="tables.Senate"></DistrictwideRaceResults>
</div>
</template>

<script>
import StatewideRaceResults from './statewide-race-results.vue'
import DistrictwideRaceResults from './districtwide-race-results.vue'
export default {
  components: {StatewideRaceResults, DistrictwideRaceResults},
  props: ['tables']
}
</script>

<style>

</style>
