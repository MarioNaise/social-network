import { useParams } from "react-router";

export default function OtherProfile() {
    const { userId } = useParams();
    return (
        <div id="otherProfile">
            <h1>Hello {userId}</h1>
        </div>
    );
}
