import React, { useEffect, useState, useCallback } from "react";
import toast, { Toaster } from "react-hot-toast";
import "./styles/App.css";

import Navbar from "./components/Navbar";
import LoginForm from "./components/user/LoginForm";
import SignUpForm from "./components/user/SignUpForm";
import Post from "./components/post/Post";
import PostForm from "./components/post/PostForm";
import PostDetails from "./components/post/PostDetails";
import TimeUtils from "./utils/TimeUtils";
import Settings from "./utils/Settings";

const serverURL = Settings.url();
const toastSettings = Settings.toastSetting();
const defaultLocalData = { username: "", token: "", loginTime: "" };

function App() {
    const [localData, setLocalData] = useState(defaultLocalData);
    const [posts, setPosts] = useState([]);
    const [detailsPost, setDetailsPost] = useState({});
    const [loggedIn, setLoggedIn] = useState(false);
    const [view, setView] = useState("");

    const logout = async () => {
        await fetch(serverURL + "/user/logout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                token: localData.token,
            },
        });
        updateState();
    };

    const updateState = () => {
        setLoggedIn(false);
        setLocalData(defaultLocalData);
        setView("");
        localStorage.removeItem("LocalData");
    };

    const addLoggedInUserData = (data) => {
        // Add time limit to token
        data.loginTime = new Date();
        localStorage.setItem("LocalData", JSON.stringify(data));
        setLocalData(data);
        setView("");
    };

    const successLoggedIn = () => {
        setLoggedIn(true);
    };

    const detailsPostView = (post) => {
        setDetailsPost(post);
    };

    const changeView = (goToView) => {
        if (goToView === "UserForm" && !loggedIn) {
            setDetailsPost({});
            setView("UserForm");
        } else if (goToView === "DetailsView") {
            setView("DetailsView");
        } else {
            setDetailsPost({});
            setView("");
        }
        checkTokenTime();
    };

    const fetchAll = useCallback(() => {
        fetch(serverURL + "/post/all", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => {
                if (res.status !== 200) {
                    return [];
                } else {
                    return res.json();
                }
            })
            .then((data) => {
                setPosts(data);
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    }, []);

    const checkTokenTime = useCallback(() => {
        // Check if token is still valid
        let data = JSON.parse(localStorage.getItem("LocalData"));
        // Token will live for one hour,
        // to test this change > 59 to >= 1, login and wait one minute
        if (data !== null && TimeUtils.tokenLife(data.loginTime) > 59) {
            logout();
            toast.error("Token is no longer valid, you have been logged out!", toastSettings);
            return false;
        }
        return true;
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        let data = JSON.parse(localStorage.getItem("LocalData"));

        if (data !== null && checkTokenTime()) {
            setLocalData(data);
            setLoggedIn(true);
        }

        fetchAll();
    }, [fetchAll, checkTokenTime]);

    const EmptyPostList = () => {
        return (
            <h1 style={{ width: "100%", textAlign: "center", marginTop: "10px" }}>
                Nothing to show here! ʕ •ᴥ•ʔ
            </h1>
        );
    };

    const Posts = () => {
        return (
            <div className="container">
                <h1>All Posts</h1>
                {posts
                    .sort((a, b) => b.create_date.localeCompare(a.create_date))
                    .map((post, index) => (
                        <Post
                            key={index}
                            post={post}
                            localData={localData}
                            setDetailsPost={detailsPostView}
                            changeCurrentView={changeView}
                            loggedIn={loggedIn}
                            fetchAll={fetchAll}
                        />
                    ))}
            </div>
        );
    };

    const getCurrentView = () => {
        switch (view) {
            case "UserForm":
                return (
                    <>
                        <div className="user-form">
                            <LoginForm
                                setLoggedIn={successLoggedIn}
                                setLoggedInUserData={addLoggedInUserData}
                            />
                            <SignUpForm />
                        </div>
                    </>
                );
            case "DetailsView":
                return (
                    <div className="container post-details-container">
                        <PostDetails
                            post={detailsPost}
                            localData={localData}
                            loggedIn={loggedIn}
                            changeView={changeView}
                            fetchAll={fetchAll}
                        />
                    </div>
                );
            default:
                return (
                    <>
                        {loggedIn && <PostForm localData={localData} fetchAll={fetchAll} />}
                        <div>
                            <Posts />
                            {posts.length === 0 && <EmptyPostList />}
                        </div>
                    </>
                );
        }
    };

    const PropsNavbar = () => {
        return (
            <Navbar
                localData={localData}
                logout={logout}
                loggedInStatus={loggedIn}
                changeView={changeView}
            />
        );
    };

    return (
        <>
            <Toaster position="top-center" reverseOrder={false} />
            <PropsNavbar />
            <div className="app">{getCurrentView()}</div>
        </>
    );
}

export default App;
