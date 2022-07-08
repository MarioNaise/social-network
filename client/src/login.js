import { Component } from "react";

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
                    location.reload();
                }
            })
            .catch((err) => {
                this.setState({ error: true });
            });
    }

    render() {
        return (
            <div id="login">
                <h1>Login</h1>
                <img className="logo" src="/logo.png" alt="logo" />
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
                </div>
            </div>
        );
    }
}
