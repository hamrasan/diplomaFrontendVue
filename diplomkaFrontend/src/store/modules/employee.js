import axios from "axios";
import router from "../../router/router";

export default {
    namespaced: true,
    state() {
        return {
            employees: [],
            roles: [],
            employeeDetail: null
        };
    },
    mutations: {
        setEmployees(state, employees) {
            state.employees = employees;
        },
        setRoles(state, roles){
            state.roles = roles;
        },
        setEmployeeDetail(state, employeeDetail) {
            state.employeeDetail = employeeDetail;
        },
    },
    actions: {
        async fetchRoles(context) {
            const roles = await axios.get("http://localhost:8080/user/roles", {withCredentials: true}).catch( function (error){
                    router.push({name: 'login'});
                }
            );
            context.commit("setRoles", roles.data);
        },
        async fetchEmployees(context) {
            const employees = await axios.get("http://localhost:8080/user/all", {withCredentials: true});
            context.commit("setEmployees", employees.data);
        },
        async getEmployee(context, employeeId) {
            console.log(employeeId);
            const employee = await axios.get("http://localhost:8080/user/" + employeeId,{withCredentials: true});
            context.commit("setEmployeeDetail", employee.data);
            console.log(employee.data);
        },
        async importRoles(context, data){
            const header = {"Content-Type": "multipart/form-data"};
            const formData  = new FormData();
            formData.append("inputFile", data);
            await axios.post("http://localhost:8080/user/import", formData, {header});
        }
    }
}