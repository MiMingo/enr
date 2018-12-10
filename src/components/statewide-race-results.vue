<template>
<div>
  <b-table 
    hover 
    :items="table.items" 
    :fields="table.fields"
    sort-by="votes"
    :sort-desc="true"
  >
    <template slot="candidate" slot-scope="data">
      {{data.item.candidate}}
      <small class='text-secondary ml-1'>
        ({{data.item.party}})
      </small>
    </template>

    <template slot="pct" slot-scope="data">
      {{(data.item.pct*100 || 0).toFixed(2)}}
    </template>

    <template slot='errors' slot-scope='data'>
      <i 
        v-if='data.item.errors.length' 
        class='icon ion-ios-warning text-warning'
        v-b-tooltip.hover
        title='There are discrepancies in the posted ballots for this race.'
      ></i>
    </template>
  </b-table>
</div>
</template>

<script>
export default {
  name: 'StatewideRaceResults',
  props: ['table']
}
</script>

<style>

</style>
