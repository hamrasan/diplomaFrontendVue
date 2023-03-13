import axios from "axios";

export default {
    state() {
        return {
            project: null
        };
    },
    mutations: {
        setProject(state, project) {
            state.project = project;
        }
    },
    getters: {

    },
    actions: {

    }
}