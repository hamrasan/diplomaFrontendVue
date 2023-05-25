<template>
    <form>
        <span class="font-weight-bold">Choroba: </span>
        <div class="form-group d-flex mt-2 justify-content-center mb-3">&nbsp;
            <VueDatePicker v-model="this.illness" range :enable-time-picker="false"/>
            <span v-if="errorIllness===true" class="text-danger">Datum začátku musí být dřív než datum konce.</span>
        </div>
        <span class="font-weight-bold">Dovolená: </span>
        <div class="form-group d-flex mt-2 justify-content-center">
            <VueDatePicker v-model="this.holiday" range :enable-time-picker="false"/>
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
    import VueDatePicker from '@vuepic/vue-datepicker';
    import '@vuepic/vue-datepicker/dist/main.css';

    export default {
        name: "AddNotAvailable",
        props: ['isModalOpen', 'user'],
        emits: ['edit'],
        components: {
            Datepicker, VueDatePicker
        },
        data() {
            return {
                from: new Date(),
                illness: [],
                holiday: [],
                errorIllness: false,
                errorHoliday: false,
            };
        },
        methods: {
            async add() {
                if (this.errorHoliday === true || this.errorIllness === true || (this.illness.length === 0 && this.holiday.length === 0) ) {
                    return;
                }
                if(this.illness.length !== 0 && this.holiday.length !== 0){
                    this.$store.dispatch("employee/addIllnessAndHoliday", {
                        data: {
                            illnessStart: this.illness[0],
                            illnessEnd: this.illness[1],
                            holidayStart: this.holiday[0],
                            holidayEnd: this.holiday[1],
                        },
                        userId: this.user.id
                    });
                }
                else if(this.illness.length !== 0){
                    this.$store.dispatch("employee/addIllnessAndHoliday", {
                        data: {
                            illnessStart: this.illness[0],
                            illnessEnd: this.illness[1],
                            holidayStart: null,
                            holidayEnd: null,
                        },
                        userId: this.user.id
                    });
                }
                else if(this.holiday.length !== 0){
                    this.$store.dispatch("employee/addIllnessAndHoliday", {
                        data: {
                            illnessStart: null,
                            illnessEnd: null,
                            holidayStart: this.holiday[0],
                            holidayEnd: this.holiday[1],
                        },
                        userId: this.user.id
                    });
                }

                this.illness = [];
                this.holiday = [];
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