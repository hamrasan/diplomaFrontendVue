<template>
  <div>
      <ProjectsView/>
<!--      <DynamicInput/>-->
  </div>
</template>

<script>
    import DynamicInput from '../components/DynamicInput.vue';
    import ProjectsView from "./ProjectsView.vue";
  export default {
    name: "HomeView",
      components: {ProjectsView, DynamicInput},
  }
</script>

