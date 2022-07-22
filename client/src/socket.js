import { io } from "socket.io-client";
import { messagesReceived, addNewMsg } from "./redux/messages/slice";

export let socket;

export const init = (store) => {
    if (!socket) {
        // only establish a socket connection once
        socket = io.connect();
        // we'll later add all sorts of sockets that we want to listen later on...
    }

    socket.on("chatMessages", (msgs) => {
        // time to dispatch an action messages/received would be a good one
        // pass to action creator the messages your server emitted
        // console.log("SOCKET: server just emitted last 10 messages", msgs);
        store.dispatch(messagesReceived(msgs));
    });

    socket.on("add-new-message", (msg) => {
        // console.log("SOCKET: server just emitted a new msg to add: ", msg);
        // time to dispatch an action message/addNew would be a good one
        store.dispatch(addNewMsg(msg));
        // pass to action the object containing the message, and the user info
        // of the author
    });
};
