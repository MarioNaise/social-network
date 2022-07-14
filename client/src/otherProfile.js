import { useState, useEffect } from "react";
import { useParams } from "react-router";

export default function OtherProfile() {
    const { otherUserId } = useParams();
    const [user, setUser] = useState([]);

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
                    if (!abort) {
                        setUser(data.profile);
                    } else {
                        // console.log("ignore don't run a state update");
                    }
                } catch (err) {
                    console.log("err on fetch");
                }
            })();
            // HARD CODED ASSUMPTION TO NOT USE CODE BELOW AS ACTUAL PROPER FUNCITONING LOGIC
            if (otherUserId == 1) {
                console.log(
                    "need to change UI trying to access our own profile"
                );
                history.pushState({}, "", "/");
            }
        }
        return () => {
            abort = true;
        };
    }, []);

    return (
        <div id="profile" className="flexStart">
            <h1>
                {user.first} {user.last}
            </h1>

            <img
                src={user.profile_picture || "defaultProfilePic.jpg"}
                alt={`${user.first + user.last}`}
            />
            {(user.bio && (
                <div id="bioText" className="flexStart">
                    <label>Bio:</label>
                    <p>{user.bio}</p>
                </div>
            )) || (
                <div id="bioText" className="flexStart">
                    <p>No bio yet</p>
                </div>
            )}
        </div>
    );
}
