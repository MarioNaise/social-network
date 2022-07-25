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
                                    <div
                                        key={message.id}
                                        className="message flexStart"
                                    >
                                        {(message.profile_picture && (
                                            <img
                                                src={message.profile_picture}
                                            ></img>
                                        )) || (
                                            <img src="/defaultProfilePic.jpg"></img>
                                        )}
                                        {message.first && (
                                            <p className="name">
                                                {message.first} {message.last}:
                                            </p>
                                        )}
                                        <p>{message.message}</p>
                                        <p className="time">
                                            {new Date(
                                                message.created_at
                                            ).toLocaleString()}
                                        </p>
                                    </div>
                                );
                            })}
                    </div>
                    <p>Write a chat message:</p>
                    <textarea
                        onKeyDown={keyCheck}
                        placeholder="Add message..."
                        rows="5"
                        cols="50"
                    ></textarea>
                </div>
            </div>
        </>
    );
}
