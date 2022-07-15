import { Component } from "react";
import { BrowserRouter, Route, Switch, Link } from "react-router-dom";
import ProfilePicture from "./profilepicture.js";
import Uploader from "./uploader.js";
import Logo from "./logo";
import Profile from "./profile";
import OtherProfile from "./otherProfile";
import FindUsers from "./findUsers";
import Time from "./time";

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
            greetee: "",
        };
    }

    componentDidMount() {
        //////// GREETEE ////////
        const date = new Date();
        const hour = date.getHours();
        const greetee =
            (hour < 12 && "Good Morning,") ||
            (hour < 18 && "Good Afternoon,") ||
            (hour < 24 && "Good Evening, ") ||
            "Hello";
        this.setState({
            greetee,
        });

        //////// OWN USER INFO ////////

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
                        <div className="flex">
                            <h1>
                                {this.state.greetee} {this.state.first}!
                            </h1>
                            <Time />
                        </div>
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
                                <div>
                                    <Link
                                        className="link pointer"
                                        to="/users/find"
                                    >
                                        Find Users
                                    </Link>
                                </div>
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
                                <div>
                                    <Link className="link pointer" to="/">
                                        Profile
                                    </Link>
                                </div>
                            </nav>

                            <FindUsers />
                        </Route>
                        <Route path="/user/:viewedUserId">
                            <nav>
                                <div>
                                    <Link className="link pointer" to="/">
                                        Profile
                                    </Link>
                                </div>
                                <div>
                                    <Link
                                        className="link pointer"
                                        to="/users/find"
                                    >
                                        Find Users
                                    </Link>
                                </div>
                            </nav>
                            <OtherProfile />
                        </Route>
                    </Switch>
                </BrowserRouter>
                <footer className="flexStart">
                    <p>© Edwin Harmuth</p>
                </footer>
            </div>
        );
    }
}
