import React, { useState, useEffect } from "react";
import UserService from "../../services/UserService";
import Message from "../Message";

const defaultInputString = { username: "", password: "", repassword: "" };
const defaultErrorMsg = "Invalid information, check your input!";

const SignUpForm = () => {
    const [input, setInput] = useState(defaultInputString);
    const [showMessage, setShowMessage] = useState(false);
    const [message, setMessage] = useState(defaultErrorMsg);

    useEffect(() => {
        const timerId = setTimeout(() => setShowMessage(false), 5000);
        //Clean up callback
        return () => clearTimeout(timerId);
    }, [showMessage]);

    const registerUser = async () => {
        const data = await UserService.registerUser(input);
        setMessage(data);
        setShowMessage(true);
        setInput(defaultInputString);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (input.password === input.repassword) {
            registerUser();
        } else {
            setMessage(defaultErrorMsg);
            setShowMessage(true);
        }
    };

    const handleChange = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    return (
        <>
            {showMessage && <Message msg={message} />}
            <div className="container">
                <div className="form signup">
                    <form id="signup" onSubmit={handleSubmit}>
                        <h1 id="signup-title">Sign up here!</h1>
                        <input
                            type="text"
                            className="form-input"
                            name="username"
                            value={input.username || ""}
                            placeholder="User Name"
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="password"
                            className="form-input"
                            name="password"
                            value={input.password || ""}
                            placeholder="Password"
                            onChange={handleChange}
                            required
                            autoComplete="off"
                        />
                        <input
                            type="password"
                            className="form-input"
                            name="repassword"
                            value={input.repassword || ""}
                            placeholder="Re-enter Password"
                            onChange={handleChange}
                            required
                            autoComplete="off"
                        />
                        <button
                            type="submit"
                            id="signup-button"
                            className="user-form-button"
                        >
                            Create
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default SignUpForm;
