const Settings = {
    toastSetting() {
        return {
            duration: 4000,
            style: {
                border: "2px solid #ff4500",
                padding: "16px",
                color: "#713200",
            },
        };
    },
    avatarUrl() {
        return (
            "https://www.redditstatic.com/avatars/defaults/v2/avatar_default_" +
            Math.floor(Math.random() * 8) +
            ".png"
        );
    },
    url() {
        return "http://localhost:8080";
    },
};

export default Settings;
