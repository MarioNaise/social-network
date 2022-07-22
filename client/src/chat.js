import { useSelector } from "react-redux";
import { socket } from "./socket";
import { useEffect, useRef } from "react";

export default function Chat() {
    const elemRef = useRef();
    const messages = useSelector((state) => state.messages);

    useEffect(async () => {
        elemRef.current.scrollTop =
            elemRef.current.scrollHeight - elemRef.current.clientHeight;
    }, [messages]);

    const keyCheck = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            // let the sever know that there is a new msg
            socket.emit("new-message", e.target.value);
            // clear textarea
            e.target.value = "";
        }
    };

    return (
        <>
            <div className="container flex">
                <div className="innerContainer">
                    <h1>Chat</h1>
                    <div id="chatMessages" ref={elemRef} className="flexStart">
                        {messages &&
                            messages.map((message) => {
                                return (
                                    <div key={message.id}>
                                        <p>{message.message}</p>
                                        <p className="time">
                                            {message.created_at.slice(11, 16) +
                                                " / "}
                                            {message.created_at.slice(0, 10)}
                                        </p>
                                    </div>
                                );
                            })}
                    </div>
                    <textarea
                        onKeyDown={keyCheck}
                        placeholder="Add message..."
                    ></textarea>
                </div>
            </div>
        </>
    );
}
