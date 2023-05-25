<template>
    <div class="container mt-3 my-3 raiffeseisenComponentYellow">
        <div class="row d-flex justify-content-center">
            <div class="col col-sm-2 col-2 mt-3"></div>
            <div class="col col-sm-8 col-8 mt-3">
                <h3>{{username}}</h3>
            </div>
            <div class="col col-sm-2 col-2 mt-3">
                <button v-if="isMemberOfMyTeam()" class="ml-2 rounded border greyColor text-light p-2" @click="edit()">Upravit</button>
            </div>
        </div>
        <div class="row d-flex justify-content-center">
            <div class="col">
                <img :src="getUserGenderImage()" class="d-block mx-auto about rounded-circle" alt="profilepicture"/>
            </div>
        </div>
        <div class="row d-flex container">
            <div class="col"></div>
            <div class="col bg-light round">
                <div class="row d-flex">
                    <div class="col form-title">
                        <p class="form-title">Email:</p>
                    </div>
                    <div class="col form-title-text">
                        <p>{{user.email}}</p>
                    </div>
                </div>
                <div class="row d-flex">
                    <div class="col form-title">
                        <p class="form-title">Man-day rate:</p>
                    </div>
                    <div class="col form-title-text">
                        <p>{{user.mdRate}} Kč</p>
                    </div>
                </div>
                <div class="row d-flex">
                    <div class="col form-title">
                        <p class="form-title">Dostupnost:</p>
                    </div>
                    <div class="col form-title-text">
                        <p>{{user.availability}}%</p>
                    </div>
                </div>
                <div class="row d-flex">
                    <div class="col form-title">
                        <p class="form-title">Role:</p>
                    </div>
                    <div class="col form-title-text">
                        <p>{{user.teamRole.name}}</p>
                    </div>
                </div>
                <div class="row d-flex">
                    <div class="col form-title">
                        <p class="form-title">Skillset:</p>
                    </div>
                    <div class="col form-title-text">
                        <p>{{user.skillset}}</p>
                    </div>
                </div>
                <div class="row d-flex">
                    <div class="col form-title">
                        <p class="form-title">Úvazek:</p>
                    </div>
                    <div class="col form-title-text">
                        <p>{{user.employment}}</p>
                    </div>
                </div>
            </div>
            <div class="col"></div>
        </div>
        <div class="container mt-2">
            <div class="col bg-light round">
                <div class="justify-content-center mb-2">
                    <span class="yellowColor rounded p-1 ">Nedostupnosti zaměstnance:</span>
                    <div>
                        Nemoc:
                    </div>
                    <ul v-for="illness in formatAfterToday(this.user.userIllness)">
                        <li>{{format_date(illness.from)}}-{{format_date(illness.to)}}</li>
                    </ul>
                    <div>
                        Dovolená:
                    </div>
                    <ul v-for="holiday in formatAfterToday(this.user.userHoliday)">
                        <li>{{format_date(holiday.from)}}-{{format_date(holiday.to)}}</li>
                    </ul>
                </div>
            </div>
        </div>

        <div class="d-flex container mt-2">
            <div class="col bg-light round" v-if="!this.currentUser">
                <div class="d-flex justify-content-center font-weight-bold mb-2">
                    <span class="yellowColor rounded p-1 ">Zadat nedostupnost zaměstnance:</span>
                </div>
                <AddNotAvailaible :user="this.user" />
            </div>
        </div>
    </div>
    <EditEmployeeModal v-if="isModalOpen" :isModalOpen="isModalOpen" :user="this.user" @close="isModalOpen = false" @edit="$emit('editUser')"/>
</template>

<script>
    import EditEmployeeModal from "./EditEmployeeModal.vue";
    import AddNotAvailaible from "./AddNotAvailaible.vue";
    import moment from 'moment';
    export default {
        name: 'ProfileStyle',
        components: {EditEmployeeModal, AddNotAvailaible},
        props: ['user', 'username','id', 'currentUser'],
        emits: ['editUser'],
        data() {
            return {
                isModalOpen: false,
                isModalOpenAvailability: false,
            }
        },
        methods: {
            getUserGenderImage() {
                if (this.user.gender === "WOMAN") {
                    return "/src/assets/woman.png";
                } else return "/src/assets/man23.png";
            },
            isMemberOfMyTeam() {
                var returnString = false;
                if(this.currentUser?.teamRole.name === 'Team Leader'){
                    this.currentUser.teamLeaderTeamIds.forEach(id => {
                        if(this.user?.teamMembersIds.includes(id)){
                            returnString = true;
                        }
                    })
                }
                return returnString;
            },
            edit() {
                this.isModalOpen = true;
            },
            format_date(value){
                if (value) {
                    return moment(String(value)).format('DD.MM.YYYY');
                }
            },
            compare_date(value1, value2){
                if (value1 && value2) {
                    return moment(String(value1)).isAfter(String(value2));
                }
            },
            formatAfterToday(list) {
                return list.filter(date => this.compare_date(date.to, new Date()));
            }
        },
        watch: {
            loading(newL, oldL) {
                if (newL === false && oldL === true){
                    return this.$store.dispatch("fetchCurrentUser");
                }
            }
        },
        computed: {
            loading() {
                return this.$store.state.employee.loading;
            }
        }
    }
</script>

<style>
    img.about {
        height: auto;
        max-width: 150px;
        background-color: white;
    }

    .form-title {
        text-align: right;
    }

    .form-title-text {
        text-align: left;
    }
    div.round {
        border-radius: 25px;
        border: 2px solid #4d4f53;;
        padding: 20px;
    }
    p.form-title {
        font-size: 18px;
        line-height: 26px;
        font-style: normal;
        font-family: 'Navigo-Bold', Arial, sans-serif;
    }
</style>