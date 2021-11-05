import React from "react";

import LoginForm from "./LoginForm";
import SignUpForm from "./SignUpForm";

const UserForm = ({ setLoggedIn, setToken }) => {
    return (
        <div className="container">
            <LoginForm setLoggedIn={setLoggedIn} setToken={setToken} />
            <SignUpForm />
        </div>
    );
};

export default UserForm;
