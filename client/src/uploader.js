import { Component } from "react";

export default class Uploader extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {}

    submitInUploader(e) {
        // when you upload the image in uploader, you want to have a fn
        // for uploading your pic (this is it!)
        // inside this fn, make a fetch post to add the image
        // when you get the img back, call the method that lives in app and
        // pass it the url of the img as an argument
        // dont forget to use formdata for sending your img to the db
        // call the fn that lives in app via prop

        // console.log(e.target);
        e.preventDefault();
        this.props.submitInApp(e);
        // dont forget to automatically hide your uploader
        // call the fn in app that is responsible for toggling the uploader
    }

    render() {
        return (
            <div className="uploader">
                <form
                    encType="multipart/form-data"
                    onSubmit={(e) => this.submitInUploader(e)}
                >
                    <div className="form">
                        <input
                            className="chooseFile"
                            name="image"
                            type="file"
                            accept="image/*"
                        ></input>
                        <button type="submit">Submit</button>
                    </div>
                </form>
            </div>
        );
    }
}
