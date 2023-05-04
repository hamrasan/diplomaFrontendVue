<template>
    <ProfileStyle :user="employee" :username="userName" :currentUser="currentUser"></ProfileStyle>
</template>

<script>
    import ProfileStyle from "./ProfileStyle.vue";
    export default {
        name: 'EmployeeDetail',
        components: {ProfileStyle},
        props: ['id'],
        computed: {
            employee() {
                return this.$store.state.employee.employeeDetail;
            },
            userName() {
                const user = this.$store.state.employee.employeeDetail;
                if(user != null) return (user.firstName + " " + user.lastName);
            },
            currentUser() {
                return this.$store.state.auth.user;
            },
        },
        created(){
            this.$store.dispatch("employee/getEmployee", this.id);
        }
    }
</script>