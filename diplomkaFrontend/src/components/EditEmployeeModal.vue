<template>
    <modal :modalOpen="isModalOpen" @close="closeModal">
        <template #header>
            <h3>Úprava zaměstance {{this.user.firstName + " " + this.user.lastName}}</h3>
        </template>
        <template #body>
            <form>
                <div class="form-group">
                    <label for="exampleInputEmail1">Man-day rate:</label>
                    <input type="number" class="form-control" id="exampleInputEmail1" aria-describedby="mandaRate"  v-model="mdRateModel" placeholder="Vlož man-day rate">
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
            </form>
        </template>
            <button type="submit" class="btn btn-primary">Submit</button>
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
        components: {
            Modal
        },
        data() {
            return {
                roleModel: this.user?.teamRole.name,
                employmentModel: this.user?.employment,
                skillsetModel: this.user?.skillset,
                mdRateModel: this.user?.mdRate,
            };
        },
        methods: {
            async save() {
            },

            closeModal() {
                this.$emit('close');
            },
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