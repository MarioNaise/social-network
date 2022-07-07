import { Component } from "react";

class NameOfClassComponent extends Component {
    constructor() {
        super(); // <---
        this.state = {}; // <---
    }
    render() {
        return <h1>element created by the class component</h1>;
    }
}

class Counter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            count: 0,
        };
        // this.incrementCount = this.incrementCount.bind(this);
    }
    componentDidMount() {
        console.log("counter just mounted");
    }
    incrementCount() {
        // console.log("unser wants to increment count");
        // to interact with state in react we use a special function called this.setState
        this.setState({
            count: this.state.count + 1,
        });
    }
    render() {
        console.log("counter props: ", this.props);
        return (
            <div>
                <h1>favFood prop val: {this.props.favFood}</h1>
                <h1>I am the Counter</h1>
                <h2>current count is {this.state.count}</h2>
                {/* <button onClick={this.incrementCount}>
                    Click me to count up:
                </button> */}
                <button onClick={() => this.incrementCount()}>
                    Click me to count up:
                </button>
                <button onClick={() => this.incrementCount()}>
                    Click me to count up:
                </button>
            </div>
        );
    }
}

export default Counter;
