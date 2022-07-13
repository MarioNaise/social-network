import { Component } from "react";
import BioEditor from "./bioEditor";

export default class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div className="profile">
                <h3>
                    {this.props.first} {this.props.last}
                </h3>

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
            </div>
        );
    }
}
