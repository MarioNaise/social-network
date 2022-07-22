import { useState } from "react";

export default function Time() {
    const [time, setTime] = useState("");

    setTimeout(() => {
        const dateTime = new Date();
        setTime(dateTime.toLocaleTimeString().slice(0, 8));
    }, 1000);
    return (
        <p id="time" className="flex">
            {time}
        </p>
    );
}
