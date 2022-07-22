import { combineReducers } from "redux";
import friendsWannabesReducer from "./friends/slice";
import messagesReducer from "./messages/slice";

const rootReducer = combineReducers({
    friends: friendsWannabesReducer,
    messages: messagesReducer,
});

export default rootReducer;
