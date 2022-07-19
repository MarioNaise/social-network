import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
    makeFriend,
    removeFriend,
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

    const handleRemove = (id) => {
        // make a post request to update db
        // dispatch an action to update global state
        (async () => {
            try {
                const respBody = await fetch(`/friendship/remove/${id}`, {
                    method: "POST",
                });
                const data = await respBody.json();
                // console.log("data in fetch friendship: ", data);
                if (data.success) {
                    return;
                }
            } catch (err) {
                console.log("err on fetch friendship", err);
            }
        })();
        dispatch(removeFriend(id));
    };

    const handleAccept = (id) => {
        (async () => {
            try {
                const respBody = await fetch(`/friendship/accept/${id}`, {
                    method: "POST",
                });
                const data = await respBody.json();
                // console.log("data in fetch friendship: ", data);
                if (data.success) {
                    return;
                }
            } catch (err) {
                console.log("err on fetch friendship", err);
            }
        })();
        dispatch(makeFriend(id));
    };

    return (
        <section className="container flex">
            <div id="friendsAndWannabes" className="innerContainer">
                <h1>Current Friends:</h1>
                {friends &&
                    friends.map((friend) => {
                        return (
                            <div key={friend.id} className="flex">
                                <Link to={`/user/${friend.id}`}>
                                    <img
                                        src={
                                            friend.profile_picture ||
                                            "/defaultProfilePic.jpg"
                                        }
                                    ></img>
                                    <p>{`${friend.first} ${friend.last}`}</p>
                                </Link>
                                <button onClick={() => handleRemove(friend.id)}>
                                    Remove Friend
                                </button>
                            </div>
                        );
                    })}
                <h1>Pending Friend Requests:</h1>
                {wannabes &&
                    wannabes.map((wannabee) => {
                        return (
                            <div key={wannabee.id} className="flex">
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
                                    onClick={() => handleAccept(wannabee.id)}
                                >
                                    Accept Friendrequest
                                </button>
                            </div>
                        );
                    })}
            </div>
        </section>
    );
}
