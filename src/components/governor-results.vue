<template>
<div>
  {{table}}
  <b-table hover :items="table.items" :fields="table.fields">
  </b-table>
</div>
</template>

<script>
export default {
  name: 'GovernorResults',
  props: ['table']
}
</script>

<style>

</style>
