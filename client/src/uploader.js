import { Component } from "react";

export default class Uploader extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    submitInUploader(e) {
        // console.log(e.target);
        e.preventDefault();
        fetch("/upload/profile/picture", {
            method: "POST",
            body: new FormData(e.target),
        })
            .then((resp) => resp.json())
            .then((data) => {
                this.props.submitInApp(data.newImage.profile_picture);
            })
            .catch((err) => {
                console.log("err in submitInUploader", err);
            });
    }

    render() {
        return (
            <div className="container flex">
                <div id="uploader" className="flex">
                    <h3>Change your profile picture:</h3>
                    <form
                        onSubmit={(e) => this.submitInUploader(e)}
                        className="flex"
                    >
                        <input
                            className="chooseFile"
                            name="image"
                            type="file"
                            accept="image/*"
                        ></input>
                        <button type="submit">Upload</button>
                    </form>
                </div>
            </div>
        );
    }
}
