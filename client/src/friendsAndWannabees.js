import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
    makeFriend,
    removeFriend,
    receiveFriendsAndWannabees,
} from "./redux/friends/slice";

export default function FriendsAndWannabes() {
    const dispatch = useDispatch();
    const wannabees = useSelector((state) => {
        return state.friends.filter((friend) => !friend.accepted);
    });
    console.log("wannabees: ", wannabees);
    const friends = useSelector((state) => {
        return state.friends.filter((friend) => friend.accepted);
    });
    console.log("friends: ", friends);

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
                dispatch(receiveFriendsAndWannabees(data));
            } catch (err) {
                console.log("err on fetch friendsAndWannabees: ", err);
            }
        })();
    }, []);

    const handleAccept = (id) => {
        // make a post request to update db
        // dispatch an action to update global state
        dispatch(makeFriend(id));
    };
    const handleRemove = (id) => {
        // make a post request to update db
        // dispatch an action to update global state
        dispatch(removeFriend(id));
    };

    return (
        <section className="container flex">
            <div id="friendsAndWannabees" className="innerContainer">
                <h1>Current Friends</h1>
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
                                <button onClick={() => handleAccept(friend.id)}>
                                    Remove Friend
                                </button>
                            </div>
                        );
                    })}
                <h1>Pending Friend Requests</h1>
                {wannabees &&
                    wannabees.map((wannabee) => {
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
                                    onClick={() => handleRemove(wannabee.id)}
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
