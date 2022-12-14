import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
    makeFriend,
    removeFriend,
    rejectFriend,
    receiveFriendsAndWannabes,
} from "./redux/friends/slice";

export default function FriendsAndWannabes() {
    const dispatch = useDispatch();
    const wannabes = useSelector((state) => {
        return state.friends.filter((friend) => !friend.accepted);
    });
    const friends = useSelector((state) => {
        return state.friends.filter((friend) => friend.accepted);
    });

    // get friends and wb when component mounts
    useEffect(() => {
        // make get request to fetch friends and wb
        // dispatch an action creator and pass to it the data you just got back
        // this will start the process of adding your friends and wb
        // big array of objects containing both

        (async () => {
            try {
                // console.log("searchInput right now", searchInput);
                const respBody = await fetch("/api/friends");
                const data = await respBody.json();
                dispatch(receiveFriendsAndWannabes(data));
            } catch (err) {
                console.log("err on fetch friendsAndWannabes: ", err);
            }
        })();
    }, []);

    const handleButton = async (action, id) => {
        try {
            const respBody = await fetch(`/friendship/${action}/${id}`, {
                method: "POST",
            });
            const data = await respBody.json();
            // console.log("data in fetch friendship: ", data);
            if (data.success) {
                if (action === "accept") {
                    dispatch(makeFriend(id));
                } else if (action == "remove") {
                    dispatch(removeFriend(id));
                } else {
                    dispatch(rejectFriend(id));
                }
            }
        } catch (err) {
            console.log("err on fetch handleButton", err);
        }
    };

    return (
        <section className="container flex">
            <div id="friendsAndWannabes" className="innerContainer">
                {(wannabes[0] && <h1>Pending Friend Requests:</h1>) || (
                    <h1>No Pending Friend Requests</h1>
                )}
                <div className="grid">
                    {wannabes &&
                        wannabes.map((wannabee) => {
                            return (
                                <div key={wannabee.id} className="flex friend">
                                    <Link to={`/user/${wannabee.id}`}>
                                        <img
                                            src={
                                                wannabee.profile_picture ||
                                                "/defaultProfilePic.jpg"
                                            }
                                        ></img>
                                        <p>{`${wannabee.first} ${wannabee.last}`}</p>
                                    </Link>
                                    <button
                                        onClick={() =>
                                            handleButton("accept", wannabee.id)
                                        }
                                    >
                                        Accept Friendrequest
                                    </button>
                                    <button
                                        onClick={() =>
                                            handleButton("cancel", wannabee.id)
                                        }
                                    >
                                        Reject Friendrequest
                                    </button>
                                </div>
                            );
                        })}
                </div>
                <h1>Current Friends:</h1>
                <div className="grid">
                    {friends &&
                        friends.map((friend) => {
                            return (
                                <div key={friend.id} className="flex friend">
                                    <Link to={`/user/${friend.id}`}>
                                        <img
                                            src={
                                                friend.profile_picture ||
                                                "/defaultProfilePic.jpg"
                                            }
                                        ></img>
                                        <p>{`${friend.first} ${friend.last}`}</p>
                                    </Link>
                                    <button
                                        onClick={() =>
                                            handleButton("remove", friend.id)
                                        }
                                    >
                                        Remove Friend
                                    </button>
                                </div>
                            );
                        })}
                </div>
            </div>
        </section>
    );
}
