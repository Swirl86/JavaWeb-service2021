import React, { useEffect, useState } from "react";

const Message = ({ msg }) => {
    const [message, setMessage] = useState("Invalid information, check your input!");

    useEffect(() => {
        setMessage(msg);
    }, [msg]);

    return (
        <div className="message" style={{ color: "red" }}>
            <strong>{message}</strong>
        </div>
    );
};

export default Message;
