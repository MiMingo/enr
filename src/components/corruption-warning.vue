<template>
<div>
  <b-jumbotron class='my-5' bg-variant="danger" text-variant="white" border-variant="danger">
    <template slot="header">
      <i class='icon ion-ios-nuclear'></i>
      Warning
    </template>
    <p class="lead">
      The election results displayed below have been tampered with and should not be taken as truth.
      In the off-chance that this message is being displayed by mistake, you can choose to view the current results below.
    </p>
    <b-btn 
      variant='danger'
      v-b-toggle.results
      class='mt-5'
    >
      Show results anyway
    </b-btn>
  </b-jumbotron>
  <b-collapse id="results">
    <ElectionResults :tables="tables"></ElectionResults>
  </b-collapse>
</div>
</template>

<script>
import ElectionResults from '../components/election-results.vue'
export default {
  components: {ElectionResults},
  props: ['tables']
}
</script>

<style>

</style>
