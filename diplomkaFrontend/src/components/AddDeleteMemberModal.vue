<template>
    <modal :modalOpen="isModalOpen" @close="closeModal">
        <template #header>
            <h3 v-if="this.action === 'add'">Přidání zaměstnance do týmu {{this.team.name}}</h3>
            <h3 v-if="this.action === 'delete'">Odebrání zaměstnance z týmu {{this.team.name}}</h3>
        </template>
        <template #body>
            <form>
                <div v-if="this.action === 'add'" class="form-group">
                    <label for="employee">Zaměstnanec:</label>
                    <select class="form-control" id="employee" v-model="employee">
                        <option v-for="employee in this.usersList" :value="employee.id" :key="employee.id">
                            {{employee.firstName + " " + employee.lastName  + " (" + employee.email + ")"}}
                        </option>
                    </select>
                </div>
                <div v-if="this.action === 'delete'" class="form-group">
                    <label for="employeeDelete">Zaměstnanec:</label>
                    <select class="form-control" id="employeeDelete" v-model="employee">
                        <option v-for="employee in this.team.users" :value="employee.id" :key="employee.id">
                            {{employee.firstName + " " + employee.lastName  + " (" + employee.email + ")"}}
                        </option>
                    </select>
                </div>

                <div class="form-group pt-2">
                    <button v-if="this.action === 'add'" type="button" class="btn yellowColor" @click="add">Přidat</button>
                    <button v-if="this.action === 'delete'" type="button" class="btn yellowColor" @click="del">Odebrat</button>
                </div>
            </form>
        </template>
        <template #footer>

        </template>
    </modal>
</template>

<script>
    import Modal from './Modal.vue';

    export default {
        name: "AddDeleteMemberModal",
        props: ['isModalOpen', 'team', 'action'],
        components: {
            Modal
        },
        data() {
            return {
                employee: null,
            };
        },
        methods: {
            closeModal() {
                this.employee = null;
                this.$emit('close');
            },
            async add() {
                this.$store.dispatch("team/addEmployee", {
                    employeeId: this.employee,
                    teamId: this.team.id
                });
                this.closeModal();
            },
            async del() {
                this.$store.dispatch("team/deleteEmployee", {
                    employeeId: this.employee,
                    teamId: this.team.id
                });
                this.closeModal();
            }
        },
        created(){
            this.$store.dispatch("team/fetchUsersWithoutTeam", this.team.id);
        },
        computed: {
            isLogged() {
                return this.$store.getters.isLogged();
            },
            usersList() {
                return this.$store.state.team.usersModal;
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