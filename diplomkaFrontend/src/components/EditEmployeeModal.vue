<template>
    <modal :modalOpen="isModalOpen" @close="closeModal">
        <template #header>
            <h3>Úprava zaměstance {{this.user.firstName + " " + this.user.lastName}}</h3>
        </template>
        <template #body>
            <form>
                <div class="form-group">
                    <label for="mdRate">Man-day rate:</label>
                    <input type="number" class="form-control" id="mdRate" aria-describedby="mandayRate"  v-model="mdRateModel" placeholder="Vlož man-day rate">
                    <span v-if="errorManDayRate===true" class="text-danger">Částka man-day rate musí být větší nebo rovno 0.</span>
                </div>
                <div class="form-group">
                    <label for="role">Role:</label>
                    <select class="form-control" id="role" v-model="roleModel">
                        <option v-for="role in this.roleList" :value="role.name" :key="role.id">
                            {{role.name}}
                        </option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="skillset">Skillset:</label>
                    <select class="form-control" id="skillset" v-model="skillsetModel">
                        <option v-for="skillset in this.skillsetList" :value="skillset" :key="skillset">
                            {{skillset}}
                        </option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="employment">Úvazek:</label>
                    <select class="form-control" id="employment" v-model="employmentModel">
                        <option v-for="employment in this.employmentList" :value="employment" :key="employment">
                            {{employment}}
                        </option>
                    </select>
                </div>

                <div class="form-group">
                    <label for="employment">Dostupnost:</label>
                    <input type="number" class="form-control" id="availability" aria-describedby="availability"  v-model="availabilityModel" placeholder="Vlož dostupnost uživatele v procentách">
                    <span v-if="errorAvailability===true" class="text-danger">Dostupnost musí být v rozmezí 0 až 100.</span>
                </div>
                <div class="form-group pt-2">
                    <button type="button" class="btn yellowColor" @click="edit">Upravit</button>
                </div>
            </form>
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
        name: "EditEmployeeModal",
        props: ['isModalOpen', 'user'],
        emits: ['edit'],
        components: {
            Modal
        },
        data() {
            return {
                roleModel: this.user?.teamRole.name,
                employmentModel: this.user?.employment,
                skillsetModel: this.user?.skillset,
                mdRateModel: this.user?.mdRate,
                availabilityModel: this.user?.availability,
                errorAvailability: false,
                errorManDayRate: false,
            };
        },
        watch: {
            // whenever question changes, this function will run
            availabilityModel(newAvailability, oldAvailability) {
                this.errorAvailability = newAvailability < 0 || newAvailability > 100;
            },
            mdRateModel(newRate, oldRate) {
                this.errorManDayRate = newRate < 0;
            },
        },
        methods: {
            closeModal() {
                this.$emit('close');
            },
            async edit() {
                if (this.errorAvailability === true || this.errorManDayRate === true){
                    return;
                }
                this.$store.dispatch("employee/editEmployee", {
                    data: {
                        role: this.roleModel,
                        employment: this.employmentModel,
                        skillset: this.skillsetModel,
                        mdRate: this.mdRateModel,
                        availability: this.availabilityModel,
                    },
                    userId: this.user.id
                });
                this.$store.dispatch("project/fetchRoles");
                this.$store.dispatch("employee/fetchEmployments");
                this.$store.dispatch("employee/fetchSkillsets");
                // this.$emit('edit');
                this.closeModal();
            }
        },
        created(){
            this.$store.dispatch("project/fetchRoles");
            this.$store.dispatch("employee/fetchEmployments");
            this.$store.dispatch("employee/fetchSkillsets");
        },
        computed: {
            isLogged() {
                return this.$store.getters.isLogged();
            },
            roleList() {
                return this.$store.state.project.roles;
            },
            skillsetList() {
                return this.$store.state.employee.skillsets;
            },
            employmentList() {
                return this.$store.state.employee.employments;
            }
        },
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