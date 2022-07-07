import { Component } from "react";

export default class Registration extends Component {
    constructor() {
        super();
        this.state = {
            error: false,
        };
    }

    handleChange(e) {
        this.setState(
            {
                [e.target.name]: e.target.value,
            } //,
            // () => {
            //     console.log("this.state", this.state);
            // }
        );
    }
    handleSubmit() {
        fetch("/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(this.state),
        })
            .then((resp) => resp.json())
            .then((data) => {
                // console.log("data from POST / register: ", data);
                if (data.error) {
                    this.setState({ error: data.error });
                    // console.log(this.state.error);
                } else {
                    location.reload();
                }
            })
            .catch((err) => {
                console.log();
                this.setState({ error: true });
            });
    }
    // TODO:
    // 1. render 4 input fields + button ✅
    // 2. capture the users input and store it state ✅
    // 3. when the user submits, we want to send that data to the server
    // 4. if smth goes wrong, contitionally render an err msg
    // 5. if everything goes well, show them the logo
    render() {
        return (
            <div>
                <h1>Welcome to my social network</h1>

                {this.state.error && (
                    <p className="error">
                        Something went wrong! Please try again.
                    </p>
                )}
                <input
                    type="text"
                    name="first"
                    placeholder="first name"
                    onChange={(e) => this.handleChange(e)}
                ></input>
                <input
                    type="text"
                    name="last"
                    placeholder="last name"
                    onChange={(e) => this.handleChange(e)}
                ></input>
                <input
                    type="email"
                    name="email"
                    placeholder="e-mail"
                    onChange={(e) => this.handleChange(e)}
                ></input>
                <input
                    type="password"
                    name="password"
                    placeholder="password"
                    onChange={(e) => this.handleChange(e)}
                ></input>
                <button onClick={() => this.handleSubmit()}>Submit</button>
            </div>
        );
    }
}
