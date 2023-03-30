<template>
    <div class="d-flex justify-content-center">
        <div class="mb-3">
            <label for="formFile" class="btn ml-2 px-3 py-2 rounded border yellowColor text-dark">
                + Import rolí <input class="form-control ml-2 px-3 py-2 rounded border yellowColor text-dark" type="file" id="formFile" @change="uploadFile" hidden>
            </label>
        </div>
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
        methods: {
            async uploadFile(e){
                try{
                    this.$store.dispatch("employee/importRoles", e.target.files[0]);
                }
                catch (e) {

                }
            }
        }
    }
</script>