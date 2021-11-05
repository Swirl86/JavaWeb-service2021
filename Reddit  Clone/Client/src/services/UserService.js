const serverURL = "http://localhost:8080/user";

const UserService = {
    registerUser: async (input) => {
        try {
            const res = await fetch(serverURL + "/register", {
                method: "POST",
                responseType: "text",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: input.username,
                    password: input.password,
                }),
            });
            const data = await res.text();
            return data;
        } catch (error) {
            return error;
        }
    },
    loginUser: async (credentials) => {
        try {
            const res = await fetch(serverURL + "/login", {
                method: "POST",
                responseType: "text",
                headers: {
                    "Content-Type": "application/json",
                    username: credentials.name,
                    password: credentials.password,
                },
            });
            const data = await res.json();
            return data.status === 406 ? "error" : data;
        } catch (error) {
            return "error";
        }
    },
};

export default UserService;
