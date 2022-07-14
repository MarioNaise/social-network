import { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router";

export default function OtherProfile() {
    const { otherUserId } = useParams();
    const [user, setUser] = useState([]);
    const history = useHistory();

    // 1st figure out what userId we want to fetch information for
    // console.log("otherUserId:", otherUserId);
    useEffect(() => {
        let abort = false;
        if (!abort) {
            (async () => {
                try {
                    // console.log("searchInput right now", searchInput);
                    const respBody = await fetch(
                        "/user/profile/" + otherUserId
                    );
                    const data = await respBody.json();
                    // console.log("data: ", data);
                    if (data.ownProfile) {
                        // console.log("own profile");
                        history.push("/");
                    } else if (!abort) {
                        setUser(data.profile);
                    } else {
                        // console.log("ignore don't run a state update");
                    }
                } catch (err) {
                    console.log("err on fetch");
                }
            })();
            // HARD CODED ASSUMPTION TO NOT USE CODE BELOW AS ACTUAL PROPER FUNCITONING LOGIC
            // if (ownProfile) {
            //     console.log("own profile");
            //     history.pushState({}, "", "/");
            // }
        }
        return () => {
            abort = true;
        };
    }, []);

    return (
        <div id="profile" className="flexStart">
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
        </div>
    );
}
