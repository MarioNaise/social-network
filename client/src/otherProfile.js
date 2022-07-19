import { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router";
import FriendButton from "./friendButton";

export default function OtherProfile() {
    const { viewedUserId } = useParams();
    const [user, setUser] = useState(null);
    const history = useHistory();

    // console.log("viewedUserId:", viewedUserId);
    useEffect(() => {
        let abort = false;
        if (!abort) {
            (async () => {
                try {
                    // console.log("searchInput right now", searchInput);
                    const respBody = await fetch(
                        "/user/profile/" + viewedUserId
                    );
                    const data = await respBody.json();
                    // console.log("data: ", data);
                    if (data.ownProfile) {
                        // console.log("own profile");
                        history.push("/");
                    } else if (!abort) {
                        setUser(data.profile);
                    } else {
                        // console.log("ignore: don't run a state update");
                    }
                } catch (err) {
                    console.log("err on fetch");
                }
            })();
        }
        return () => {
            abort = true;
        };
    }, []);

    return (
        <section className="container flex">
            <div id="profile" className="flexStart innerContainer">
                {(user && (
                    <h1>
                        {user.first} {user.last}
                    </h1>
                )) || <h1>User not found!</h1>}

                {user && (
                    <img
                        src={user.profile_picture || "/defaultProfilePic.jpg"}
                        alt={`${user.first + user.last}`}
                    />
                )}
                {(user && user.bio && (
                    <div id="bioText">
                        <div className="flexStart">
                            <label>Bio:</label>
                            <p>{user.bio}</p>
                        </div>
                    </div>
                )) ||
                    (user && (
                        <div id="bioText">
                            <div className="flexStart">
                                <p>No bio yet</p>
                            </div>
                        </div>
                    ))}
                {user && <FriendButton viewedUserId={viewedUserId} />}
            </div>
        </section>
    );
}
