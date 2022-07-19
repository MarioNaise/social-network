import { Component } from "react";
import BioEditor from "./bioEditor";

export default class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <section className="container flex">
                <div id="profile" className="flexStart innerContainer">
                    <h1>
                        {this.props.first} {this.props.last}
                    </h1>

                    <img
                        src={this.props.imageUrl || "defaultProfilePic.jpg"}
                        alt={this.props.first + this.props.last}
                    />
                    <BioEditor
                        bio={this.props.bio}
                        submitBioInApp={(bio) => {
                            this.props.submitBioInApp(bio);
                        }}
                    />
                    <a className="link logout pointer" href="/logout">
                        Logout
                    </a>
                </div>
            </section>
        );
    }
}
