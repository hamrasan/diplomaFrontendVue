<template>
    <div v-for="project in projectList">
        <div class="card" style="width: 18rem;">
            <div class="card-body">
                <h5 class="card-title">{{project.name}}</h5>
<!--                <h6 class="card-subtitle mb-2 text-muted">{{project.name}}</h6>-->
                <p class="card-text">{{project.description}}</p>
                <a href="#" class="card-link">Detail</a>
                <a href="#" class="card-link">Another link</a>
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