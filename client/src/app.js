import { Component } from "react";
import ProfilePicture from "./profilepicture.js";
import Uploader from "./uploader.js";

export default class App extends Component {
    constructor() {
        super();
        this.state = {
            first: "",
            last: "",
            imageUrl: "",
            uploaderIsVisible: false,
        };
    }

    componentDidMount() {
        // HERE is where we want to make a fetch request to "GET" info
        // about logged in or newly registered user
        // first name, last name, profile picture url (we dont have yet)
        // when we have the info from the server, add it to the state of this
        // component with this.setState
        fetch("/user/info")
            .then((resp) => resp.json())
            .then((data) => {
                // console.log("data.profile fetch user/info: ", data.profile);
                this.setState({
                    first: data.profile.first,
                    last: data.profile.last,
                    imageUrl: data.profile.profile_picture,
                });
            })
            .catch((err) => {
                console.log("err in fetch user/info: ", err);
            });
    }

    toggleModal() {
        this.setState({
            uploaderIsVisible: !this.state.uploaderIsVisible,
        });
    }

    submitInApp(e) {
        fetch("/upload/profile/picture", {
            method: "POST",
            body: new FormData(e.target),
        })
            .then((resp) => resp.json())
            .then((data) => {
                // console.log("data uploader.js", data.newImage);
                // this.setState didnt work, error -> "_this3.setState is not a function"????????????????????????
                location.reload();
            })
            .catch((err) => {
                console.log("err in submitInApp", err);
            });
    }

    render() {
        return (
            <div id="app">
                <img className="logo" src="/logo.png" alt="logo" />
                <ProfilePicture
                    first={this.state.first}
                    last={this.state.last}
                    imageUrl={this.state.imageUrl}
                />
                <p className="pointer" onClick={() => this.toggleModal()}>
                    Click here to change your profile picture!
                </p>

                {this.state.uploaderIsVisible && (
                    <Uploader submitInApp={this.submitInApp} />
                )}
                <a href="/logout">Logout</a>
            </div>
        );
    }
}
