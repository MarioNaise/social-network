export default function Greetee(props) {
    console.log("greetee here: ");
    console.log("props", props);
    return <h2> Hi {props.propName || "stranger!"}</h2>;
}
