import { Component } from "react";
import { Link } from "react-router-dom";
import Logo from "./logo";

export default class Login extends Component {
    constructor() {
        super();
        this.state = {
            error: false,
        };
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value,
        });
    }
    handleSubmit() {
        fetch("/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(this.state),
        })
            .then((resp) => resp.json())
            .then((data) => {
                // console.log("data from POST /login: ", data);
                if (data.error) {
                    this.setState({ error: data.error });
                    // console.log(this.state.error);
                } else {
                    location.replace("/");
                }
            })
            .catch((err) => {
                this.setState({ error: true });
                console.log("err in POST login: ", err);
            });
    }

    render() {
        return (
            <div id="login">
                <Logo />
                <h1>Login:</h1>
                {this.state.error && (
                    <p className="error">
                        Something went wrong! Please try again.
                    </p>
                )}

                <div className="form">
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
                    <button onClick={() => this.handleSubmit()}>Login</button>

                    <Link className="link pointer" to="/">
                        Register
                    </Link>
                    <Link className="link pointer" to="/password/reset">
                        Reset your password
                    </Link>
                </div>
            </div>
        );
    }
}
