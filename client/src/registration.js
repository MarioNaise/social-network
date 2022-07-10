import { Component } from "react";
import { Link } from "react-router-dom";

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
                this.setState({ error: true });
                console.log("err in POST register: ", err);
            });
    }

    render() {
        return (
            <div id="register">
                <h1>Welcome to</h1>
                <img className="logo" src="/logo.png" alt="logo" />
                <h1>Register</h1>

                {this.state.error && (
                    <p className="error">
                        Something went wrong! Please try again.
                    </p>
                )}
                <div className="form">
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
                        placeholder="email"
                        onChange={(e) => this.handleChange(e)}
                    ></input>
                    <input
                        type="password"
                        name="password"
                        placeholder="password"
                        onChange={(e) => this.handleChange(e)}
                    ></input>
                    <button onClick={() => this.handleSubmit()}>
                        Register
                    </button>
                    <Link className="link" to="/login">
                        Login
                    </Link>
                </div>
            </div>
        );
    }
}
