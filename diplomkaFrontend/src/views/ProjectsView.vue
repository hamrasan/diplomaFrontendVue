<template>
    <div class="d-flex justify-content-center">
        <button class="ml-2 px-3 py-2 mb-2 rounded border yellowColor text-dark" @click="modalOpen()">+ Vytvořit</button>
    </div>
    <div class="input-group rounded">
        <input type="search" class="form-control rounded" placeholder="Hledat projekt..." aria-label="Search"
               aria-describedby="search-addon" v-model="input"/>
    </div>
    <ul class="list-group mt-3" v-for="project in filteredList()">
        <li class="list-group-item d-flex justify-content-between">
            <span>{{project.name}}</span>
            <span>{{toCzPhase(project.projectPhase)}}</span>
            <span></span>
            <router-link :to="{ name: 'detail', params: { id: project.id }, emits: {toCzStatus}}" class="nav-link">
                <button class="ml-2 rounded border yellowColor text-dark">Detail</button>
            </router-link>
        </li>
    </ul>
    <CreateProjectModal v-if="isModalOpen" :isModalOpen="isModalOpen" :user="this.user" @close="isModalOpen = false"/>
</template>

<script>
    import { ref } from "vue";
    import CreateProjectModal from "../components/CreateProjectModal.vue";

    export default {
        name: 'ProjectsView',
        components: {
            CreateProjectModal
        },
        data() {
            return {
                input: "",
                isModalOpen: false,
            }
        },
        computed: {
            projectList() {
                return this.$store.state.project.projects;
            },
            user() {
                return this.$store.state.auth.user;
            },
        },
        created() {
            this.$store.dispatch("project/fetchProjects");
        },
        watch: {
            input() {
                const a = this.filteredList();
                console.log(a);
            }
        },
        methods: {
            toCzStatus(status) {
                switch (status) {
                    case 'ESTABLISHED' : {
                        return "Rezervováno";
                    }
                    case 'ALLOCATED' : {
                        return "Alokovaná";
                    }
                    default:
                        return "chyba";
                }
            },
            toCzPhase(phase) {
                switch (phase) {
                    case 'PREPARATION' : {
                        return "Příprava";
                    }
                    case 'REALIZATION' : {
                        return "V realizaci";
                    }
                    case 'CLOSED' : {
                        return "Uzavřený";
                    }
                    default:
                        return "chyba";
                }
            },
            filteredList() {
                if(this.projectList != null){
                     return this.projectList.filter( (project) =>
                        project.name.toLowerCase().includes(this.input.toLowerCase())
                    );
                }
                else return [];
            },
            modalOpen() {
                this.isModalOpen = true;
            }
        }
    }
</script>