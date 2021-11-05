import React from "react";
import leftIcon from "../img/left_icon.png";
import rightIcon from "../img/right_icon.png";

const Navbar = ({ localData, logout, loggedInStatus, changeView }) => {
    const { username } = localData;

    const logoutUser = () => {
        logout();
    };

    const handleClick = (goToView) => {
        changeView(goToView);
    };

    return (
        <div className="Navbar">
            <img
                className="Navbar-img-left"
                src={leftIcon}
                alt="logo"
                onClick={() => handleClick("")}
            />
            <h1 className="Navbar-title">Reddit - Clone ʕ •ᴥ•ʔ</h1>
            <div className="Navbar-right">
                {loggedInStatus ? (
                    <>
                        <h2>{username}</h2>
                        <button
                            type="submit"
                            id="navbar-logout-button"
                            className="navbar-button space-left"
                            onClick={() => logoutUser("")}
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <button
                        type="submit"
                        id="navbar-login-button"
                        className="navbar-button"
                        onClick={() => handleClick("UserForm")}
                    >
                        Login / Register
                    </button>
                )}
                <img className="Navbar-img-right" src={rightIcon} alt="logo" />
            </div>
        </div>
    );
};

export default Navbar;
