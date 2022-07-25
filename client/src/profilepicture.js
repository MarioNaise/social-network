import { Link } from "react-router-dom";

export default function ProfilePicture({ first, last, imageUrl, toggleModal }) {
    imageUrl = imageUrl || "defaultProfilePic.jpg";

    return (
        <div>
            <Link to="/">
                <img
                    onClick={() => toggleModal()}
                    className="profilePic"
                    src={imageUrl || "defaultProfilePic.jpg"}
                    alt={first + last}
                />
            </Link>
        </div>
    );
}
