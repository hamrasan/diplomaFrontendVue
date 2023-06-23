<template>
    <modal :modalOpen="isModalOpen" @close="closeModal">
        <template #header>
            <h3>Vytvoření projektu </h3>
        </template>
        <template #body>
            <span v-if="errorUser===true" class="text-danger">Přihlašený uživatel není Project Manager. Není možné projekt vytvořit.</span>
            <form class="pt-2">
                <div class="form-group">
                    <label for="name">Začátek projektu:</label>
                    <VueDatePicker v-model="this.startDate" :enable-time-picker="false"/>
                    <span v-if="errorDate===true" class="text-danger">Musíte zadat datum začátku projektu.</span>
                </div>
                <div class="form-group">
                    <label for="name">Jméno:</label>
                    <input type="text" class="form-control" id="name" aria-describedby="name"  v-model="this.name" placeholder="Vlož jméno projektu">
                    <span v-if="errorName===true" class="text-danger">Musíte zadat jméno projektu.</span>
                </div>
                <div class="form-group">
                    <label for="description">Popis:</label>
                    <input type="text" class="form-control" id="description" aria-describedby="description"  v-model="this.description" placeholder="Vlož popis projektu">
                </div>
                <div class="form-group pt-3">
                    <button type="button" class="btn yellowColor" @click="create">Vytvořit</button>
                </div>
            </form>
        </template>
        <template #footer class="pt-2">

        </template>
    </modal>
</template>

<script>
    import IconTrash from './icons/IconTrash.vue';
    import IconPlus from './icons/IconPlus.vue';
    import Modal from './Modal.vue';
    import DatePicker from 'vue3-datepicker';
    import VueDatePicker from '@vuepic/vue-datepicker';
    import '@vuepic/vue-datepicker/dist/main.css';

    export default {
        name: "CreateProjectModal",
        props: ['isModalOpen', 'user'],
        components: {
            Modal, DatePicker, VueDatePicker
        },
        data() {
            return {
                name: "",
                description: "",
                startDate: null,
                errorUser: false,
                errorDate: false,
                errorName: false,
                from: new Date(),
            };
        },
        watch: {
            // whenever question changes, this function will run
            user(newUser, oldUser) {
                this.errorUser = newUser.teamRole.name !== 'Change Coordinator - Project Manager';
            },
            startDate(newValue, oldValue) {
                if (newValue != null && this.errorDate === true) this.errorDate = false;
            },
            name(newValue, oldValue){
                if (newValue != null && newValue !== "" && this.errorName === true) this.errorName = false;
            }
        },
        methods: {
            closeModal() {
                this.$emit('close');
            },
            async create() {
                if (this.errorUser === true || this.name === "" || this.startDate === null) {
                    if (this.startDate === null) this.errorDate = true;
                    if (this.name === "") this.errorName = true;
                    return;
                }
                this.$store.dispatch("project/createProject", {
                    name: this.name,
                    description: this.description,
                    startDate: this.startDate,
                    projectManagerId: this.user.id,
                });
                this.closeModal();
            }
        },
        computed: {
            isLogged() {
                return this.$store.getters.isLogged();
            },
        },
        created() {
            this.errorUser = this.user.teamRole.name !== 'Change Coordinator - Project Manager'
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