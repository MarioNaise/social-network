import { combineReducers } from "redux";
import friendsWannabesReducer from "./friends/slice";

const rootReducer = combineReducers({
    friends: friendsWannabesReducer,
});

export default rootReducer;
