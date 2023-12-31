import { combineReducers } from "redux";
import storage from 'redux-persist/lib/storage';
import appReducer from './slices/app';
import authReducer from "./slices/auth";
import conversationReducer from "./slices/conversation";
//slices


//How our data will be stored and read out of the redux store
const rootPersistConfig = {
    key: 'root',
    storage,
    keyPrefix: 'redux-',
    //Whitelist [],
    //blacklist [],
    //but we want to persist everything so we wont use it
}

//All reducers
const rootReducer = combineReducers({
    app: appReducer,
    auth: authReducer,
    conversation:conversationReducer,
});

export { rootPersistConfig, rootReducer };
