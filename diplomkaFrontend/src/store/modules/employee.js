import axios from "axios";
import router from "../../router/router";
import auth from "./auth";

export default {
    namespaced: true,
    state() {
        return {
            employees: [],
            roles: [],
            employeeDetail: null,
            skillsets: [],
            employments: [],
            loading: false,
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
        setLoading(state, loading) {
            state.loading = loading;
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
            const employee = await axios.get("http://localhost:8080/user/" + employeeId,{withCredentials: true});
            context.commit("setEmployeeDetail", employee.data);
        },
        async importRoles(context, data){
            const header = {"Content-Type": "multipart/form-data"};
            const formData  = new FormData();
            formData.append("inputFile", data);
            await axios.post("http://localhost:8080/user/import/roles", formData, {header});
        },
        async importEmployees(context, data){
            const header = {"Content-Type": "multipart/form-data"};
            const formData  = new FormData();
            formData.append("inputFile", data);
            const employees =await axios.post("http://localhost:8080/user/import/employees", formData, {header});
            context.commit("setEmployees", employees.data );
        },
        async editEmployee(context, {data, userId}) {
            const employee = await axios.post("http://localhost:8080/user/edit/" + userId, {
                role: data.role,
                employment: data.employment,
                skillset: data.skillset,
                mdRate: data.mdRate,
                availability: data.availability,
            },{withCredentials: true});
            context.commit("setEmployeeDetail", employee.data);
        },
        async addIllnessAndHoliday(context, {data, userId}){
            context.commit("setLoading", true);
             await axios.post("http://localhost:8080/user/addIllness/" + userId, {
                illnessStart: data.illnessStart,
                illnessEnd: data.illnessEnd,
                holidayStart: data.holidayStart,
                holidayEnd: data.holidayEnd,
            },{withCredentials: true});
            context.commit("setLoading", false);
        }
    }
}