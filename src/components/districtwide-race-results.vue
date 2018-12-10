<template>
<div>
  <b-table 
    hover
    small
    :items="table.items" 
    :fields="table.fields"
    sort-by="district"
  >
    <template slot="district" slot-scope="data">
      {{data.item.district.replace('district', '')}}
    </template>

    <template slot='winner' slot-scope='data'>
      <span class='mx-2'>
        {{(100*data.item.winner.pct || 0).toFixed(0)}}%
      </span>
      {{data.item.winner.candidate}}
      <small class='text-secondary'>
        ({{data.item.winner.party}})
      </small>
    </template>

    <template slot='loser' slot-scope='data'>
      <span class='mx-2'>
        {{(100*data.item.loser.pct || 0).toFixed(0)}}%
      </span>
      {{data.item.loser.candidate}}
      <small class='text-secondary'>
        ({{data.item.loser.party}})
      </small>
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
  name: 'DistrictwideRaceResults',
  props: ['table']
}
</script>

<style>

</style>
