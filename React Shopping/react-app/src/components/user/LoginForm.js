import React, { useState, useEffect } from "react";
import UserService from "../services/UserService";
import Message from "../Message";

const defaultErrorMsg = "Invalid information, check your input!";

const LoginForm = ({ setLoggedIn, setToken }) => {
    const [input, setInput] = useState({ name: "", password: "" });
    const [showMessage, setShowMessage] = useState(false);
    const [message, setMessage] = useState(defaultErrorMsg);

    useEffect(() => {
        const timerId = setTimeout(() => setShowMessage(false), 5000);
        //Clean up callback
        return () => clearTimeout(timerId);
    }, [showMessage]);

    const loginUser = async (credentials) => {
        const data = await UserService.loginUser(credentials);
        if (data !== "error") {
            setToken(data);
            setLoggedIn();
        } else {
            setMessage(defaultErrorMsg);
            setShowMessage(true);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.name || !input.password) return;
        await loginUser(input);
    };

    const handleChange = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    return (
        <>
            {showMessage && <Message msg={message} />}
            <div className="container">
                <div className="login">
                    <form id="login" onSubmit={handleSubmit}>
                        <h1 id="login-title">Sign in here!</h1>
                        <input
                            type="text"
                            className="input"
                            name="name"
                            value={input.name || ""}
                            placeholder="User Name"
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="password"
                            className="input"
                            name="password"
                            value={input.password || ""}
                            placeholder="Password"
                            onChange={handleChange}
                            required
                            autoComplete="off"
                        />

                        <button type="submit" id="login-button">
                            Login
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default LoginForm;
