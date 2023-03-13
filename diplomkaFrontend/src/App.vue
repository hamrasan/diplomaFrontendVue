<template>
    <div>
        <Header/>
    </div>
    <main>
        <div class="p-5">
                <router-view :key="$route.fullPath"></router-view>
        </div>
    </main>
</template>

<script>
  import Header from './components/Header.vue';
  import router from "./router/router";

  export default {
    components: {Header},
    created() {
        if(this.$store.getters.isLogged() === false){
            this.$store.dispatch("fetchCurrentUser");
        }
    },
  }
</script>
