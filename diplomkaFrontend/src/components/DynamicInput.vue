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
                <div class="accordion pt-2" id="accordionPanelsStayOpen">
                    <div class="accordion-item">
                        <h2 class="accordion-header" id="panelsStayOpen-headingOne">
                            <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseOne" aria-expanded="true" aria-controls="panelsStayOpen-collapseOne">
                                Rezervováno
                            </button>
                        </h2>
                        <div id="panelsStayOpen-collapseOne" class="accordion-collapse collapse show" aria-labelledby="panelsStayOpen-headingOne">
                            <div class="accordion-body">
                                    <div v-for="requirement in this.requirements">
                                        <span class="text-danger">{{requirement.md}} MD</span>
                                        <span> -> {{requirement.teamRole.name}} </span>
                                        <span> ( {{usedManDays(requirement.teamRole.name)}} ze {{requirement.md}} )</span>
                                    </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="container">
                    <div class="mt-4">
                        <div class="d-flex justify-content-between row-12 text-center yellowColor pt-1 font-weight-bold">
                            <span class="col-2">Man-days</span>
                            <span class="col-2">Max man-days v alokaci (na člověka)</span>
                            <span class="col-3">Role</span>
                            <span class="col-3">Kandidát</span>
                            <span class="col-2">Max kandidátových man-days</span>
                        </div>
                        <div v-for="(allocation, index) in this.allocations" :key="index">
                            <div class="d-flex row-12 justify-content-between text-center mb-2">
                                <input
                                        v-model="allocation.md"
                                        placeholder="počet man-days"
                                        class="w-full py-2 border rounded dynamic-input col-2"
                                        type="number"
                                />
                                <span class="col-2 p-1">
                                     {{allocation.maxMd}}
                                </span>
                                <span class="col-3">
                                    {{allocation.teamRole.name}}
                                </span>
                                <select v-model="allocation.user"
                                        class="w-full py-2 border rounded dynamic-input col-3">
                                    <option v-for="candidate in allocation.candidatesMd" :value="candidate.valueUser.id"
                                            :key="candidate.valueUser.id">
                                        {{candidate.valueUser.firstName + " " +candidate.valueUser.lastName}}
                                    </option>
                                </select>
                                <span class="col-2">
                                    {{candidateMd(allocation.candidatesMd, allocation.user)}}
                                </span>
                                <IconPlus type="button" class="ml-2 col-1" @click="add(index)"/>
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
    import IconPlus from './icons/IconPlus.vue';
    import Modal from './Modal.vue';

    export default {
        name: "DynamicInput",
        props: ['isModalOpen', 'name', 'project'],
        components: {
            IconTrash, Modal, IconPlus
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
            add(index) {
                // var allocation = this.allocations[index];
                var allocation = JSON.parse( JSON.stringify(this.allocations[index]));
                this.allocations.splice(index+1, 0, allocation);
            },
            async save() {
                // let validationResponse = await this.v.$validate();
                // if(!validationResponse) return ;

                this.$store.dispatch("project/saveReservation", {
                    reservations: this.reservations,
                    projectId: this.project.id
                });
                this.$store.dispatch("project/fetchProjects");
                this.closeModal();
            },
            async allocation() {
                // let validationResponse = await this.v.$validate();
                // if(!validationResponse) return ;

                this.$store.dispatch("project/saveAllocation", { sourceAllocations: this.allocations, projectId: this.project.id});
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
            },
            candidateMd(candidatesMd, userId) {
                if (userId === undefined) return "";
                else {
                    let candidates = candidatesMd.filter(canidate => canidate.valueUser.id === userId);
                    if (candidates !== null || candidates.length > 0) {
                        return candidates[0].keyMd;
                    }
                }
            },
            usedManDays(teamRoleName){
                let value = 0;
                const allocations = this.allocations.filter(a => a.teamRole.name === teamRoleName).map(a => a.md).forEach(a => value+=a);
                return value;
            }
        },
        created() {
            this.$store.dispatch("project/fetchRoles");
            if (this.project.allocationDto != null) {
                for (let i = 0; i < this.project.allocationDto.requirements.length; i++) {
                    this.requirements.push(JSON.parse(JSON.stringify(this.project.allocationDto.requirements[i])));
                }
                for (let i = 0; i < this.project.allocationDto.sourceAllocations.length; i++) {
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
            project: {
                handler(newValue, oldValue) {
                    if (this.project.allocationDto != null) {
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