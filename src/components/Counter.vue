<template lang="pug">
  .Counter
    h1 counter: {{ count }}
    button.plus(@click="increment") +
    button.minus(@click="decrement") -
</template>

<script lang="babel">
import { mapGetters, mapActions } from 'vuex';
export default {
  data: () => ({
    count: 0,
  }),
  computed: mapGetters(['count']),
  methods: mapActions(['increment', 'decrement']),
};
</script>

<style lang="stylus">
  .Counter
    color blue
</style>
