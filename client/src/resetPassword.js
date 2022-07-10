import { Component } from "react";
import { Link } from "react-router-dom";

export default class ResetPassword extends Component {
    constructor() {
        super();
        this.state = {
            error: false,
            view: 1,
        };
    }
    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value,
        });
    }

    sendCode() {
        fetch("/sendCode", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(this.state),
        })
            .then((resp) => resp.json())
            .then((data) => {
                // console.log("data from POST /sendCode: ", data);
                if (data.error) {
                    this.setState({ error: true });
                } else {
                    this.setState({ view: 2, error: false });
                }
            })
            .catch((err) => {
                this.setState({ error: true });
                console.log("err in POST sendCode: ", err);
            });
    }
    resetPassword() {
        fetch("/reset", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(this.state),
        })
            .then((resp) => resp.json())
            .then((data) => {
                // console.log("data from POST /reset: ", data);
                if (data.error) {
                    this.setState({ error: true });
                } else {
                    this.setState({ view: 3, error: false });
                }
            })
            .catch((err) => {
                this.setState({ error: true });
                console.log("err in POST reset: ", err);
            });
    }
    determineViewToRender() {
        // this method determines what the render!
        if (this.state.view === 1) {
            return (
                <div id="resetPassword">
                    <img className="logo" src="/logo.png" alt="logo" />
                    <h1>Reset your password</h1>
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
                        <button onClick={() => this.sendCode()}>Reset</button>
                        <Link className="link" to="/">
                            Register
                        </Link>
                        <Link className="link" to="/login">
                            Login
                        </Link>
                    </div>
                </div>
            );
        } else if (this.state.view === 2) {
            return (
                <div id="resetPassword">
                    <img className="logo" src="/logo.png" alt="logo" />
                    <h1>Reset your password</h1>
                    {this.state.error && (
                        <p className="error">
                            Something went wrong! Please try again.
                        </p>
                    )}
                    <div className="form">
                        <input
                            type="text"
                            name="resetCode"
                            placeholder="reset code"
                            onChange={(e) => this.handleChange(e)}
                        ></input>
                        <input
                            type="password"
                            name="password"
                            placeholder="new password"
                            onChange={(e) => this.handleChange(e)}
                        ></input>
                        <button onClick={() => this.resetPassword()}>
                            Reset
                        </button>
                    </div>
                </div>
            );
        } else if (this.state.view === 3) {
            return (
                <div id="resetPassword">
                    <img className="logo" src="/logo.png" alt="logo" />
                    <h1>Password reset successfull!</h1>
                    <Link className="link" to="/login">
                        Login
                    </Link>
                </div>
            );
        }
    }

    render() {
        return <div>{this.determineViewToRender()}</div>;
    }
}
