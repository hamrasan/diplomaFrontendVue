import axios from "axios";
import router from "../../router/router";

export default {
    namespaced: true,
    state() {
        return {
            employees: [],
            roles: [],
            employeeDetail: null,
            skillsets: [],
            employments: [],
        };
    },
    mutations: {
        setEmployees(state, employees) {
            state.employees = employees;
        },
        setRoles(state, roles){
            state.roles = roles;
        },
        setEmployments(state, employments){
            state.employments = employments;
        },
        setSkillsets(state, skillsets){
            state.skillsets = skillsets;
        },
        setEmployeeDetail(state, employeeDetail) {
            state.employeeDetail = employeeDetail;
        },
    },
    actions: {
        async fetchSkillsets(context) {
            const skillsets = await axios.get("http://localhost:8080/user/skillsets", {withCredentials: true}).catch( function (error){
                    router.push({name: 'login'});
                }
            );
            context.commit("setSkillsets", skillsets.data);
        },
        async fetchEmployments(context) {
            const employments = await axios.get("http://localhost:8080/user/employments", {withCredentials: true}).catch( function (error){
                    router.push({name: 'login'});
                }
            );
            context.commit("setEmployments", employments.data);
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
        },
    }
}