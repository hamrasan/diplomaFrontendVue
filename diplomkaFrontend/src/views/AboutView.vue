<template>
  <div>
    <ProfileStyle :user="currentUser" :username="currentUserName" ></ProfileStyle>
  </div>
</template>

<script>
  import ProfileStyle from '../components/ProfileStyle.vue';

  export default {
    name: 'AboutView',
    components: {ProfileStyle},
      data() {
        return{
      }
      },
      computed: {
          currentUser() {
              return this.$store.state.auth.user;
          },
          currentUserName() {
              const user = this.$store.state.auth.user;
              if(user != null) return (user.firstName +" " +user.lastName);
          }
      }
  }
</script>


<style>
@media (min-width: 1024px) {
  /*.about {*/
  /*  min-height: 100vh;*/
  /*  display: flex;*/
  /*  align-items: center;*/
  /*}*/
}
</style>
