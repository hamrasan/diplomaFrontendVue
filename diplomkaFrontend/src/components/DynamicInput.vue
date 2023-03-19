<template>
    <modal :modalOpen="isModalOpen" @close="closeModal">
        <template #header>
            <h3>Vytvoření rezervace na projekt</h3>
        </template>
        <template #body>
            <div class="dynamic-add">
                <div class="w-full mt-4 p-10">
                    <div class="me-5 d-flex justify-content-center row">
                        <button
                                type="button"
                                class="ml-2 rounded border px-3 py-2 yellowColor text-dark col-1"
                                @click="addMore()"
                        >
                            + Přidat
                        </button>
                    </div>
                    <div class="container">
                        <div v-for="(reservation, index) in reservations" :key="index">
                            <div class="ml-2 mt-4">
                                <div class="d-flex row-11 justify-content-between">
                                    <span class="col-5">Počet</span>
                                    <span class="col-7">Role</span>
                                </div>
                                <div class="row justify-content-between">
                                    <div class="col-11">
                                        <input
                                                v-model="reservation.count"
                                                placeholder="vlož počet"
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
        props: ['isModalOpen'],
        components: {
            IconTrash, Modal
        },
        data() {
            return {
                reservations: [
                    {
                        count: 1,
                        role: ""
                    },
                ],
            };
        },
        methods: {
            addMore() {
                this.reservations.push({
                    count: 1,
                    role: ""
                });
            },
            remove(index) {
                this.reservations.splice(index, 1);
            },
            async save() {
                // let validationResponse = await this.v.$validate();
                // if(!validationResponse) return ;

                this.$store.dispatch("project/saveReservation", {reservations: this.reservations, projectId: 1});
                this.closeModal();
            },
            closeModal() {
                this.$emit('close');
                this.reservations = [
                    {
                        count: 1,
                        role: ""
                    },
                ];
            }
        },
        created() {
            this.$store.dispatch("project/fetchRoles");
        },
        computed: {
            isLogged() {
                return this.$store.getters.isLogged();
            },
            roleList() {
                return this.$store.state.project.roles;
            },
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