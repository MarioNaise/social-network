import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function FindUsers() {
    const [users, setUsers] = useState([]);
    const [searchInput, setSearchInput] = useState("");
    const [recent, setRecent] = useState(null);

    useEffect(() => {
        let abort = false;
        (async () => {
            try {
                // console.log("searchInput right now", searchInput);
                const respBody = await fetch("/findusers/" + searchInput);
                const data = await respBody.json();
                // console.log("data: ", data);
                if (!abort) {
                    setUsers(data.users);
                    if (data.recent === true) {
                        setRecent(true);
                    } else {
                        setRecent(false);
                    }
                } else {
                    // console.log("ignore don't run a state update");
                }
            } catch (err) {
                console.log("err on fetch", err);
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
        <section className="container flex">
            <div id="findUsers" className="flex innerContainer">
                <h1> Find other people:</h1>
                <input
                    placeholder="Enter Name"
                    onChange={(e) => {
                        setSearchInput(e.target.value);
                    }}
                ></input>
                {recent && <h3>Recetly joined:</h3>}
                {!recent && <h3>Search results:</h3>}
                <div className="grid">
                    {users?.map((user, i) => {
                        return (
                            <div key={i} className="flex user">
                                <Link to={`/user/${user.id}`}>
                                    <img
                                        src={
                                            user.profile_picture ||
                                            "/defaultProfilePic.jpg"
                                        }
                                    ></img>
                                    <p>{`${user.first} ${user.last}`}</p>
                                </Link>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
