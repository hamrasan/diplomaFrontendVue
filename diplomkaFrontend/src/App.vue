<template>
  <Header/>
  <div class="p-4">
    <router-view :key="$route.fullPath"></router-view>
  </div>
</template>

<script>
  import Header from './components/Header.vue';

  export default {
    components: {Header},
    created() {
      this.$store.dispatch("fetchCurrentUser");
    },
  }
</script>
