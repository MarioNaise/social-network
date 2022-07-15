import { useState, useEffect } from "react";

export default function FriendButton(props) {
    const [buttonText, setButtonText] = useState("");

    // check friendship status between users
    useEffect(() => {
        (async () => {
            try {
                const respBody = await fetch("/relation/" + props.viewedUserId);
                const data = await respBody.json();
                // console.log("data in fetch friend Button: ", data);
                if (data.noRelation === true) {
                    // console.log("case 1");
                    setButtonText("Add Friend");
                } else if (data.status.accepted == true) {
                    // console.log("case 2");
                    setButtonText("Remove Friend");
                } else if (
                    data.status.accepted === false &&
                    data.sender === true
                ) {
                    // console.log("case 3");
                    setButtonText("Cancel Friendrequest");
                } else if (
                    data.status.accepted === false &&
                    data.sender === false
                ) {
                    // console.log("case 4");
                    setButtonText("Accept Friendrequest");
                }
            } catch (err) {
                console.log("err on fetch relation: ", err);
            }
        })();
    }, []);

    const submitFriendRequest = (text) => {
        const action =
            (text === "Add Friend" && "add") ||
            (text === "Remove Friend" && "remove") ||
            (text === "Cancel Friendrequest" && "cancel") ||
            (text === "Accept Friendrequest" && "accept");
        const newButtonText =
            (text === "Add Friend" && "Cancel Friendrequest") ||
            (text === "Remove Friend" && "Add Friend") ||
            (text === "Cancel Friendrequest" && "Add Friend") ||
            (text === "Accept Friendrequest" && "Remove Friend");
        (async () => {
            try {
                const respBody = await fetch(
                    `/friendship/${action}/${props.viewedUserId}`
                );
                const data = await respBody.json();
                // console.log("data in fetch friendship: ", data);
                if (data.success) {
                    setButtonText(newButtonText);
                }
            } catch (err) {
                console.log("err on fetch friendship", err);
            }
        })();
    };

    return (
        <div id="FriendButton">
            <button onClick={() => submitFriendRequest(buttonText)}>
                {buttonText}
            </button>
        </div>
    );
}
