import {createLogger, createStore} from 'vuex';
import auth from "./modules/auth";
import project from "./modules/project";

const debug = process.env.NODE_ENV !== 'production';

export default createStore({
    modules: {
        auth,
        project,
    },
    strict: debug,
    plugins: debug ? [createLogger()]: []
});