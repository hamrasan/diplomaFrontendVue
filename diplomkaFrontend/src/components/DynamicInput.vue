<template>
    <modal :modalOpen="isModalOpen" @close="closeModal">
        <template #header>
            <h3 v-if="this.name === 'rezervace'">Vytvoření rezervace zdrojů</h3>
            <h3 v-else="this.name === 'alokace'">Vytvoření alokace zdrojů</h3>
        </template>
        <template #body>
            <div class="dynamic-add" v-if="this.name === 'rezervace'">
                <div class="w-full mt-4 p-10">
                    <div class="me-5 d-flex justify-content-center row">
                        <button
                                type="button"
                                class="ml-2 rounded border py-2 yellowColor text-dark col-1"
                                @click="addMore()"
                        >
                            + Přidat
                        </button>
                    </div>
                    <div class="container">
                        <div v-for="(reservation, index) in reservations" :key="index">
                            <div class="ml-2 mt-4">
                                <div class="d-flex row-12 justify-content-between">
                                    <span class="col-5">Man-days</span>
                                    <span class="col-7">Role</span>
                                </div>
                                <div class="row justify-content-between">
                                    <div class="col-11">
                                        <input
                                                v-model="reservation.md"
                                                placeholder="vlož počet man-days"
                                                class="w-full py-2 border rounded dynamic-input col-6"
                                                type="number"
                                        />
                                        <select v-model="reservation.role"
                                                class="w-full py-2 border rounded dynamic-input col-6">
                                            <option v-for="role in this.roleList" :value="role.name" :key="role.id">
                                                {{role.name}}
                                            </option>
                                        </select>
                                    </div>
                                    <IconTrash type="button" class="ml-2 col-1" @click="remove(index)"
                                               v-show="index != 0"/>
                                </div>
                            </div>
                        </div>
                        <div class="me-5 d-flex justify-content-center row">
                            <button
                                    type="button"
                                    class="ml-2 rounded border px-3 py-2 blackColor text-white col-1 mt-3"
                                    @click="save"
                            >
                                Uložit
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div v-if="this.name === 'alokace'">
                <div class="container">
                    <div v-for="(allocation, index) in this.allocations" :key="index">
                        <div class="ml-2 mt-4">
                            <div class="d-flex row-12 justify-content-between">
                                <span class="col-3">Man-days</span>
                                <span class="col-4">Role</span>
                                <span class="col-4">Kandidát</span>
                            </div>
                            <div class="d-flex row-12 justify-content-between">
                                <input
                                        v-model="allocation.md"
                                        placeholder="počet man-days"
                                        class="w-full py-2 border rounded dynamic-input col-3"
                                        type="number"
                                />
                                <span class="col-4">
                                    {{allocation.teamRole.name}}
                                </span>
                                <select v-model="allocations[index].user"
                                           class="w-full py-2 border rounded dynamic-input col-4">
                                            <option v-for="candidate in allocation.candidates" :value="candidate.id" :key="candidate.id">
                                                {{candidate.firstName + " " +candidate.lastName}}
                                            </option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="me-5 d-flex justify-content-center row">
                        <button
                                type="button"
                                class="ml-2 rounded border px-3 py-2 blackColor text-white col-1 mt-3"
                                @click="allocation"
                        >
                            Uložit
                        </button>
                    </div>
                </div>
            </div>
        </template>
        <template #footer>

        </template>
    </modal>
</template>

<script>
    import IconTrash from './icons/IconTrash.vue';
    import Modal from './Modal.vue';

    export default {
        name: "DynamicInput",
        props: ['isModalOpen', 'name', 'project'],
        components: {
            IconTrash, Modal
        },
        data() {
            return {
                reservations: [
                    {
                        md: 1,
                        role: ""
                    },
                ],
                allocations: [],
                requirements: []
            };
        },
        methods: {
            addMore() {
                this.reservations.push({
                    md: 1,
                    role: ""
                });
            },
            remove(index) {
                this.reservations.splice(index, 1);
            },
            async save() {
                // let validationResponse = await this.v.$validate();
                // if(!validationResponse) return ;

                this.$store.dispatch("project/saveReservation", {reservations: this.reservations, projectId: this.project.id});
                this.$store.dispatch("project/fetchProjects");
                this.closeModal();
            },
            async allocation() {
                // let validationResponse = await this.v.$validate();
                // if(!validationResponse) return ;

                //this.$store.dispatch("project/saveAllocation", {projectId: this.projectId});
                this.closeModal();
            },
            closeModal() {
                this.$emit('close');
                this.reservations = [
                    {
                        md: 1,
                        role: ""
                    },
                ];
            }
        },
        created() {
            this.$store.dispatch("project/fetchRoles");
            if(this.project.allocationDto != null){
                //this.requirements = this.project.allocationDto.requirements;
                for (let i = 0; i <  this.project.allocationDto.requirements.length; i++) {
                    this.requirements.push(JSON.parse(JSON.stringify(this.project.allocationDto.requirements[i])));
                }
                for (let i = 0; i <  this.project.allocationDto.sourceAllocations.length; i++) {
                    this.allocations.push(JSON.parse(JSON.stringify(this.project.allocationDto.sourceAllocations[i])));
                }
            }
        },
        computed: {
            isLogged() {
                return this.$store.getters.isLogged();
            },
            roleList() {
                return this.$store.state.project.roles;
            }
        },
        watch: {
            project:{
                handler(newValue, oldValue){
                    if(this.project.allocationDto != null){
                        this.requirements = this.project.allocationDto.requirements;
                        this.allocations = this.project.allocationDto.sourceAllocations;
                    }
                }
            }
        }
    };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    h3 {
        margin: 40px 0 0;
    }

    ul {
        list-style-type: none;
        padding: 0;
    }

    li {
        display: inline-block;
        margin: 0 10px;
    }

    a {
        color: #42b983;
    }
</style>