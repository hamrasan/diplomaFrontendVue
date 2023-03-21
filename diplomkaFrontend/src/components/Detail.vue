<template>
    <h4 v-if="this.project.projectAllocationDto == null" class="text-danger"> Rezervace nebyla vytvořena</h4>
    <div class="d-flex justify-content-center">
        <div>
            <h2 class="col">{{this.project.name}}</h2>
        </div>
    </div>
    <div class="d-flex justify-content-center">
        <div>
            <h5 class="col">{{this.project.description}}</h5>
        </div>
    </div>
    <div class="d-flex justify-content-center" v-if="this.project.projectAllocationDto">
        <div>
            <h5 class="col">{{toCzStatus(this.project.projectAllocationDto.status)}}</h5>
        </div>
    </div>
    <div class="d-flex justify-content-center" v-if="this.project.projectAllocationDto">
        <div>
            <h5 class="col">{{this.project.projectAllocationDto.reservationDate}}</h5>
        </div>
    </div>
    <div class="d-flex justify-content-center" v-if="this.project.projectAllocationDto == null ">
        <button class="mt-4 rounded border py-2 yellowColor text-dark col-1" @click="modalOpen">
            Vytvořit rezervaci
        </button>
    </div>
    <DynamicInput v-if="isModalOpen" :isModalOpen="isModalOpen" @close="isModalOpen = false"/>
</template>

<script>
    import DynamicInput from "./DynamicInput.vue";
    export default {
        name: "Detail",
        components: {DynamicInput},
        props: ['id'],
        data() {
            return{
                isModalOpen: false
            }
        },
        computed: {
            project(){
               return this.$store.state.project.projectDetail;
            }
        },
        created(){
            this.$store.dispatch("project/getProject", this.id);
        },
        methods: {
            modalOpen() {
                this.isModalOpen = true;
            },
            toCzStatus(status) {
                switch (status) {
                    case 'ESTABLISHED' : {
                        return "Rezervováno";
                    }
                    case 'ALLOCATED' : {
                        return "Alokovaná";
                    }
                    default: return "chyba";
                }
            }
        }
    }
</script>