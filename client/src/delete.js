import { Link } from "react-router-dom";

export default function Delete() {
    return (
        <div className="container flex">
            <div id="deleteProfile" className="innerContainer">
                <h1>Delete your profile</h1>
                <h3>
                    Are you sure you want to delete your profile? <br></br>
                    All your data will be deleted from our servers.
                </h3>
                <Link className="link pointer delete" to="/">
                    Go back
                </Link>
                <a className="link delete pointer" href="/delete/user">
                    Delete my profile
                </a>
            </div>
        </div>
    );
}
