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
                } else if (data.accepted == true) {
                    // console.log("case 2");
                    setButtonText("Remove Friend");
                } else if (
                    data.accepted === false &&
                    data.sender_id != props.viewedUserId
                ) {
                    // console.log("case 3");
                    setButtonText("Cancel Friendrequest");
                } else if (
                    data.accepted === false &&
                    data.sender_id == props.viewedUserId
                ) {
                    // console.log("case 4");
                    setButtonText("Accept Friendrequest");
                }
            } catch (err) {
                console.log("err on fetch relation: ", err);
            }
        })();
    }, []);

    const submitFriendRequest = async (oldButtonText) => {
        const action =
            (oldButtonText === "Add Friend" && "add") ||
            (oldButtonText === "Remove Friend" && "remove") ||
            (oldButtonText === "Cancel Friendrequest" && "cancel") ||
            (oldButtonText === "Accept Friendrequest" && "accept");
        const newButtonText =
            (oldButtonText === "Add Friend" && "Cancel Friendrequest") ||
            (oldButtonText === "Remove Friend" && "Add Friend") ||
            (oldButtonText === "Cancel Friendrequest" && "Add Friend") ||
            (oldButtonText === "Accept Friendrequest" && "Remove Friend");

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
    };

    return (
        <div id="FriendButton">
            <button onClick={() => submitFriendRequest(buttonText)}>
                {buttonText}
            </button>
        </div>
    );
}
