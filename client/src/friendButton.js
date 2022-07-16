import { useState, useEffect } from "react";

export default function FriendButton(props) {
    const [buttonText, setButtonText] = useState("");
    const [action, setAction] = useState("");

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
                    setAction("add");
                } else if (data.accepted == true) {
                    // console.log("case 2");
                    setButtonText("Remove Friend");
                    setAction("remove");
                } else if (
                    data.accepted === false &&
                    data.sender_id != props.viewedUserId
                ) {
                    // console.log("case 3");
                    setButtonText("Cancel Friendrequest");
                    setAction("cancel");
                } else if (
                    data.accepted === false &&
                    data.sender_id == props.viewedUserId
                ) {
                    // console.log("case 4");
                    setButtonText("Accept Friendrequest");
                    setAction("accept");
                }
            } catch (err) {
                console.log("err on fetch relation: ", err);
            }
        })();
    }, []);

    const submitFriendRequest = (oldButtonText) => {
        const newButtonText =
            (oldButtonText === "Add Friend" && "Cancel Friendrequest") ||
            (oldButtonText === "Remove Friend" && "Add Friend") ||
            (oldButtonText === "Cancel Friendrequest" && "Add Friend") ||
            (oldButtonText === "Accept Friendrequest" && "Remove Friend");
        (async () => {
            try {
                const respBody = await fetch(
                    `/friendship/${action}/${props.viewedUserId}`,
                    {
                        method: "POST",
                    }
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
