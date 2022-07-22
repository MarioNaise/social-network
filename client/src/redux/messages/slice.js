export default function messagesReducer(messages = [], action) {
    if (action.type === "messages/received") {
        messages = action.payload.messages;
    }
    if (action.type === "messages/add") {
        messages = [...action.payload.message, ...messages];
    }

    return messages;
}

export function messagesReceived(messages) {
    return {
        type: "messages/received",
        payload: { messages },
    };
}

export function addNewMsg(message) {
    return {
        type: "messages/add",
        payload: { message },
    };
}
