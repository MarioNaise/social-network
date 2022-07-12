// export default function Presentational(props) {
//     console.log("props: ", props);
//     return <h2> Hello {props.first}</h2>;
// }

export default function ProfilePicture({ first, last, imageUrl }) {
    imageUrl = imageUrl || "defaultProfilePic.jpg";

    return (
        <div id="profilePicture">
            <h1> Hello {first + " " + last}</h1>
            <img className="profilePic" src={imageUrl} alt={first + last} />
        </div>
    );
}
