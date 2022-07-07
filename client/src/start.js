import ReactDOM from "react-dom";
import Welcome from "./welcome.js";

fetch("/user/id.json")
    .then((response) => response.json())
    .then((data) => {
        if (!data.userId) {
            ReactDOM.render(<Welcome />, document.querySelector("main"));
        } else {
            ReactDOM.render(
                <div>
                    <img src="/logo.jpeg" alt="logo" />
                    <a href="/logout">Logout</a>
                </div>,
                document.querySelector("main")
            );
        }
    });
