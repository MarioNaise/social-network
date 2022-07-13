import { Component } from "react";

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

                {(this.props.bio && (
                    <p id="bio">
                        <label>Bio:</label>
                        <section>{this.props.bio}</section>
                        <button>Edit Bio</button>
                    </p>
                )) || <button>Add Bio</button>}
            </div>
        );
    }
}
