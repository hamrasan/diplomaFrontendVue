import {createLogger, createStore} from 'vuex';
import auth from "./modules/auth";
import project from "./modules/project";
import employee from "./modules/employee";

const debug = process.env.NODE_ENV !== 'production';

export default createStore({
    modules: {
        auth,
        project,
        employee,
    },
    strict: debug,
    plugins: debug ? [createLogger()]: []
});