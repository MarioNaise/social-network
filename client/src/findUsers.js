import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function FindUsers() {
    const [users, setUsers] = useState([]);
    const [searchInput, setSearchInput] = useState("");

    useEffect(() => {
        let abort = false;
        (async () => {
            try {
                // console.log("searchInput right now", searchInput);
                const respBody = await fetch("/findusers/" + searchInput);
                const data = await respBody.json();
                // console.log("data: ", data);
                if (!abort) {
                    setUsers(data);
                } else {
                    // console.log("ignore don't run a state update");
                }
            } catch (err) {
                console.log("err on fetch");
            }
        })(); // this closes the async iife
        return () => {
            // this function runs, whenever there is another useEffect that gets
            // triggered after the initial one
            // console.log("cleanup running");
            abort = true;
        };
    }, [searchInput]);

    return (
        <div id="findUsers" className="flex">
            <h3> Find other people:</h3>
            <input
                placeholder="Enter Name"
                onChange={(e) => {
                    setSearchInput(e.target.value);
                }}
            ></input>
            <ul>
                {users?.map((user, i) => {
                    return (
                        <li key={i}>
                            <Link to={`/user/${user.id}`}>
                                <img
                                    src={
                                        user.profile_picture ||
                                        "/defaultProfilePic.jpg"
                                    }
                                ></img>
                                <p>{`${user.first} ${user.last}`}</p>
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
