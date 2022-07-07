import Greetee from "./greetee";
import Counter from "./counter";

export default function HelloWorld() {
    const myText = <h1>I love JSX!!!</h1>;
    const cohortName = "Cayenne";
    const classForStyling = "some-class";
    return (
        <div className={classForStyling}>
            <Greetee propName={cohortName} />
            <Greetee propName={"Edwin"} />
            <Greetee />
            {myText}
            <h2
                style={{
                    color: "hotpink",
                    fontFamily: "Impact",
                    fontSize: "6rem",
                }}
            >
                {2 + 2}
            </h2>
            <h2>2+2</h2>
            <Counter favFood="muffin" />
        </div>
    );
}
