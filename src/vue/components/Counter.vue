<template lang="pug">
.Counter
  h2 Counter: {{ count }}
  button.plus(@click="increment") +
  button.minus(@click="decrement") -
</template>

<script lang="babel">
import { mapGetters, mapActions } from 'vuex';
export default {
  computed: mapGetters(['count']),
  methods: mapActions(['increment', 'decrement']),
};
</script>
