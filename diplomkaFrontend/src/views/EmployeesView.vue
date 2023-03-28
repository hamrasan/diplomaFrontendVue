<template>
    <div class="d-flex justify-content-center">
        <button class="ml-2 px-3 py-2 rounded border yellowColor text-dark">+ Import zaměstanců</button>
    </div>
    <ul class="list-group mt-3" v-for="employee in employeeList">
        <li class="list-group-item d-flex justify-content-between">
            <span>{{employee.firstName + " " + employee.lastName}}</span>
            <span >{{}}</span>
            <span></span>
            <router-link :to="{ name: 'employeeDetail', params: { id: employee.id }}" class="nav-link"><button class="ml-2 rounded border yellowColor text-dark">Detail</button></router-link>
        </li>
    </ul>
</template>

<script>
    export default {
        name: 'EmployeesView',
        computed:{
            employeeList() {
                return this.$store.state.employee.employees;
            },
        },
        created() {
            this.$store.dispatch("employee/fetchEmployees");
        },
    }
</script>