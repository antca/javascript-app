<template lang="pug">
  .Counter
    h1 counter: {{ counter }}
    button.plus(@click="plus") +
    button.minus(@click="minus") -
</template>

<script lang="babel">
const Counter = {
  data() {
    return {
      counter: 0,
    };
  },
  methods: {
    plus() {
      this.counter++;
    },
    minus() {
      this.counter--;
    }
  }
}
export default Counter;
</script>

<style lang="stylus">
  .Counter
    color blue
</style>
