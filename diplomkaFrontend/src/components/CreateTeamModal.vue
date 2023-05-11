<template>
    <modal :modalOpen="isModalOpen" @close="closeModal">
        <template #header>
            <h3>Vytvoření týmu </h3>
        </template>
        <template #body>
            <form class="pt-2">
                <span v-if="errorUser===true" class="text-danger">Přihlašený uživatel není Team Leader. Není možné tým vytvořit.</span>
                <div class="form-group">
                    <label for="name">Jméno:</label>
                    <input type="text" class="form-control" id="name" aria-describedby="name"  v-model="name" placeholder="Vlož jméno týmu">
                </div>
                <div class="form-group pt-3">
                    <button type="button" class="btn yellowColor" @click="create">Vytvořit</button>
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
        name: "CreateTeamModal",
        props: ['isModalOpen', 'user'],
        components: {
            Modal
        },
        data() {
            return {
                name: "",
                errorUser: false,
            };
        },
        watch: {
            // whenever question changes, this function will run
            user(newUser, oldUser) {
                this.errorUser = newUser.teamRole.name !== 'Team Leader';
            }
        },
        methods: {
            closeModal() {
                this.$emit('close');
            },
            async create() {
                if (this.errorUser === true || this.name === "") {
                    return;
                }
                this.$store.dispatch("team/create", {
                    name: this.name,
                    teamLeaderId: this.user.id,
                });
                this.closeModal();
            }
        },
        computed: {
            isLogged() {
                return this.$store.getters.isLogged();
            },
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