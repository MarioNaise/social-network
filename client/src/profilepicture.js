// export default function Presentational(props) {
//     console.log("props: ", props);
//     return <h2> Hello {props.first}</h2>;
// }

export default function ProfilePicture({ first, last, imageUrl, toggleModal }) {
    imageUrl = imageUrl || "defaultProfilePic.jpg";

    return (
        <img
            onClick={() => toggleModal()}
            className="profilePic"
            src={imageUrl}
            alt={first + last}
        />
    );
}
