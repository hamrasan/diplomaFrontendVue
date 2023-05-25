<template>
    <div class="d-flex justify-content-center">
        <div class="mb-3">
            <label for="formFile" class="btn ml-2 px-3 py-2 rounded border yellowColor text-dark">
                + Import rolí <input class="form-control ml-2 px-3 py-2 rounded border yellowColor text-dark" type="file" id="formFile" @change="uploadFile" hidden>
            </label>
        </div>
        <div class="mb-3 mx-2">
            <label for="formFileEmp" class="btn ml-2 px-3 py-2 rounded border yellowColor text-dark">
                + Import zaměstnanů <input class="form-control ml-2 px-3 py-2 rounded border yellowColor text-dark" type="file" id="formFileEmp" @change="uploadFileEmpl" hidden>
            </label>
        </div>
    </div>

    <div class="input-group rounded">
        <input type="search" class="form-control rounded" placeholder="Hledat..." aria-label="Search"
               aria-describedby="search-addon" v-model="input"/>
    </div>
    <ul class="list-group mt-3" v-for="employee in filteredList()">
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
        data() {
          return{
              input: "",
          }
        },
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
            },
            async uploadFileEmpl(e){
                try{
                    this.$store.dispatch("employee/importEmployees", e.target.files[0]);
                }
                catch (e) {

                }
            },
            filteredList() {
                if(this.employeeList != null){
                    return this.employeeList.filter( (employee) =>
                        employee.firstName.toLowerCase().includes(this.input.toLowerCase()) || employee.lastName.toLowerCase().includes(this.input.toLowerCase())
                    );
                }
                else return [];
            }
        }
    }
</script>