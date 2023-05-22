<template>
    <form>
        <span class="font-weight-bold">Choroba: </span>
        <div class="form-group d-flex mt-2 justify-content-center mb-3">
            Od: &nbsp;
            <datepicker class="col"
                    v-model="this.illnessStart"
                    :lowerLimit="this.from"
            />
            &nbsp;
            Do: &nbsp;
            <datepicker class="col"
                    v-model="this.illnessEnd"
                    :lowerLimit="this.from"
            />
            &nbsp;
            <span v-if="errorIllness===true" class="text-danger">Datum začátku musí být dřív než datum konce.</span>
        </div>
        <span class="font-weight-bold">Dovolená: </span>
        <div class="form-group d-flex mt-2 justify-content-center">
            Od: &nbsp;
            <datepicker
                    v-model="this.holidayStart"
                    :lowerLimit="this.from"
            />
            &nbsp;
            Do: &nbsp;
            <datepicker class="col"
                        v-model="this.holidayEnd"
                        :lowerLimit="this.from"
            />
            &nbsp;
            <span v-if="errorHoliday===true" class="text-danger">Datum začátku musí být dřív než datum konce.</span>
        </div>
        <div class="form-group pt-2">
            <button type="button" class="btn yellowColor" @click="add()">Přidat</button>
        </div>
    </form>
</template>

<script>
    import Datepicker from 'vue3-datepicker';
    import moment from 'moment';

    export default {
        name: "AddNotAvailable",
        props: ['isModalOpen', 'user'],
        emits: ['edit'],
        components: {
            Datepicker
        },
        data() {
            return {
                from: new Date(),
                illnessStart: null,
                illnessEnd: null,
                holidayStart: null,
                holidayEnd: null,
                errorIllness: false,
                errorHoliday: false,
            };
        },
        methods: {
            async add() {
                if (this.errorHoliday === true || this.errorIllness === true) {
                    return;
                }
                this.$store.dispatch("employee/addIllnessAndHoliday", {
                    data: {
                        illnessStart: this.illnessStart,
                        illnessEnd: this.illnessEnd,
                        holidayStart: this.holidayStart,
                        holidayEnd: this.holidayEnd,
                    },
                    userId: this.user.id
                });
                this.illnessStart = null;
                this.illnessEnd = null;
                this.holidayStart = null;
                this.holidayEnd = null;
            }
        },
        computed: {
            isLogged() {
                return this.$store.getters.isLogged();
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