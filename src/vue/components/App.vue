<template lang="pug">
.App#app
  h1 A simple app
  ul
    li
      router-link(to='/home') To home
    li
      router-link(to='/counter') To counter
  router-view
</template>

<script lang="babel">
export default {
}
</script>

<style lang="stylus">
.App
  font-family sans-serif
</style>
