import { Component } from "react";

export default class BioEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editorIsVisible: false,
            draftBio: "",
        };
    }

    toggleBioEditor() {
        this.setState({
            editorIsVisible: !this.setState.editorIsVisible,
        });
    }

    handleChange(e) {
        this.setState({ draftBio: e.target.value });
    }

    submitBio() {
        fetch("/upload/profile/bio", {
            method: "POST",
            body: JSON.stringify({
                bio: this.state.draftBio,
            }),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((resp) => resp.json())
            .then((data) => {
                this.props.submitBioInApp(data.bio);
            })
            .catch((err) => {
                console.log("err in submitBio", err);
            });

        this.setState({
            editorIsVisible: false,
        });
    }
    render() {
        return (
            <div className="bio">
                {(this.state.editorIsVisible && (
                    <div id="bioText">
                        <label>Bio:</label>
                        <textarea
                            onChange={(e) => this.handleChange(e)}
                            rows="5"
                            cols="50"
                            defaultValue={this.props.bio}
                        ></textarea>
                        <button onClick={() => this.submitBio()}>Submit</button>
                    </div>
                )) ||
                    (this.props.bio && (
                        <div id="bioText">
                            <label>Bio:</label>
                            <p>{this.props.bio}</p>
                            <button onClick={() => this.toggleBioEditor()}>
                                Edit Bio
                            </button>
                        </div>
                    )) || (
                        <div id="bioText">
                            <button onClick={() => this.toggleBioEditor()}>
                                Add Bio
                            </button>
                        </div>
                    )}
            </div>
        );
    }
}
