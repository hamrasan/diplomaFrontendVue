<template>
    <div v-for="project in projectList">
        <div class="card" style="width: 18rem;">
            <img class="card-img-top" src="src/assets/project.png" alt="Project image">
            <div class="card-body">
                <h5 class="card-title">{{project.name}}</h5>
                <p class="card-text">{{project.description}}</p>
                <a href="#" class="btn btn-primary">Detail</a>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'ProjectsView',
        data() {
            return{

            }
        },
        computed:{
            projectList() {
                return this.$store.state.project.projects;
            },
        },
        created() {
            this.$store.dispatch("project/fetchProjects");
        }
    }
</script>