<template lang="pug">
.Home
  .h2 Home
</template>

<script lang="babel">
export default {
  methods: {
    fetchData() {
      return this.$store.dispatch('fetchData', 'home')
    },
  },
};
</script>

<style lang="stylus">
</style>
