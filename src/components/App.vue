<template lang="pug">
#app App root
  Counter
</template>

<script lang="babel">
import Counter from './Counter';
import createStore from '../vuex';

export default {
  components: {
    Counter,
  },
  store: createStore(),
}
</script>

<style lang="stylus">
#app
  color red
</style>
