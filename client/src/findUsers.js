import { useState, useEffect } from "react";

export default function FindUsers() {
    const [users, setUsers] = useState([]);
    const [searchInput, setSearchInput] = useState("");

    useEffect(() => {
        let abort = false;
        (async () => {
            try {
                console.log("searchInput right now", searchInput);
                const respBody = await fetch("/findusers/" + searchInput);
                const data = await respBody.json();
                console.log("data: ", data);
                if (!abort) {
                    setUsers(data);
                    console.log("users: ", users);
                } else {
                    console.log("ignore don't run a state update");
                }
            } catch (err) {
                console.log("err on fetch");
            }
        })(); // this closes the async iife
        return () => {
            // this function runs, whenever there is another useEffect that gets
            // triggered after the initial one
            console.log("cleanup running");
            abort = true;
        };
    }, [searchInput]);

    return (
        <div id="findUser">
            <h3> Find other people:</h3>
            <input
                placeholder="Enter Name"
                onChange={(e) => setSearchInput(e.target.value)}
            ></input>
        </div>
    );
}
