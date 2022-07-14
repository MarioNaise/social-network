import { Component } from "react";
import { BrowserRouter, Route, Switch, Link } from "react-router-dom";
import ProfilePicture from "./profilepicture.js";
import Uploader from "./uploader.js";
import Logo from "./logo";
import Profile from "./profile";
import OtherProfile from "./otherProfile";
import FindUsers from "./findUsers";

export default class App extends Component {
    constructor() {
        super();
        this.state = {
            first: "",
            last: "",
            imageUrl: "",
            bio: "",
            uploaderIsVisible: false,
            profileIsVisible: true,
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
                    bio: data.profile.bio,
                });
            })
            .catch((err) => {
                console.log("err in fetch user/info: ", err);
            });
    }

    closeModal() {
        this.setState({
            uploaderIsVisible: false,
            profileIsVisible: true,
        });
    }

    toggleModal() {
        this.setState({
            uploaderIsVisible: !this.state.uploaderIsVisible,
            profileIsVisible: !this.state.profileIsVisible,
        });
    }

    submitInApp(imageUrl) {
        this.setState({
            imageUrl: imageUrl,
            uploaderIsVisible: false,
            profileIsVisible: true,
        });
    }

    submitBioInApp(bio) {
        // console.log("bio in app: ", bio);
        this.setState({
            bio: bio,
        });
    }

    render() {
        return (
            <div id="app" className="flex">
                <BrowserRouter>
                    <header>
                        <Link to="/">
                            <Logo
                                closeModal={() => {
                                    this.closeModal();
                                }}
                            />
                        </Link>
                        <h1>Hello {this.state.first}!</h1>
                        <ProfilePicture
                            first={this.state.first}
                            last={this.state.last}
                            imageUrl={this.state.imageUrl}
                            toggleModal={() => this.toggleModal()}
                        />
                    </header>
                    <Switch>
                        <Route exact path="/">
                            <nav>
                                <Link className="link pointer" to="/users/find">
                                    Find Users
                                </Link>
                            </nav>

                            {this.state.uploaderIsVisible && (
                                <Uploader
                                    submitInApp={(url) => {
                                        this.submitInApp(url);
                                    }}
                                />
                            )}
                            {this.state.profileIsVisible && (
                                <Profile
                                    first={this.state.first}
                                    last={this.state.last}
                                    imageUrl={this.state.imageUrl}
                                    bio={this.state.bio}
                                    submitBioInApp={(bio) => {
                                        this.submitBioInApp(bio);
                                    }}
                                />
                            )}
                        </Route>
                        <Route path="/users/find">
                            <nav>
                                <Link className="link pointer" to="/">
                                    Profile
                                </Link>
                            </nav>

                            <FindUsers />
                        </Route>
                        <Route path="/user/:otherUserId">
                            <nav>
                                <Link className="link pointer" to="/">
                                    Profile
                                </Link>
                                <Link className="link pointer" to="/users/find">
                                    Find Users
                                </Link>
                            </nav>
                            <OtherProfile />
                        </Route>
                    </Switch>
                </BrowserRouter>
            </div>
        );
    }
}
