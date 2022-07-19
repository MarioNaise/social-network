import { combineReducers } from "redux";
import friendsWannabeesReducer from "./friends/slice";

const rootReducer = combineReducers({
    friends: friendsWannabeesReducer,
});

export default rootReducer;
