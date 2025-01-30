import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    function login(e) {
        e.preventDefault();

        if (username.trim() && password.trim()) {
            fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username: username, password: password })
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Failed to login user");
                    }
                    return response.json();
                })
                .then((data) => {
                    navigate("/");
                })
                .catch((err) => {
                    alert(err.message);
                });
        } else {
            alert("Username and Password required");
        }
    }

    return (
        <>
            <main className="flex items-center justify-center min-h-screen">
                <div className="border-2 border-zinc-50/20 flex flex-col gap-4 items-center p-10 rounded-lg shadow-lg max-w-xs w-full">
                    <div className="text-4xl">Yapper</div>
                    <form onSubmit={login} className="flex flex-col w-full space-y-4">
                        <div className="flex flex-col">
                            <label htmlFor="username" className="px-2 py-1">Username</label>
                            <input
                                type="text"
                                placeholder="Enter username"
                                id="username"
                                className="bg-zinc-900 rounded-full px-4 py-2 w-full border border-zinc-900 focus:outline-none focus:border focus:border-sky-500 placeholder:text-zinc-50/50"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="password" className="px-2 py-1">Password</label>
                            <input
                                type="password"
                                placeholder="Enter password"
                                id="password"
                                className="bg-zinc-900 rounded-full px-4 py-2 w-full border border-zinc-900 focus:outline-none focus:border focus:border-sky-500 placeholder:text-zinc-50/50"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <button type="submit" className="bg-white text-black font-semibold px-12 py-2 rounded-full w-full hover:bg-zinc-50/90">
                            Login
                        </button>
                    </form>
                    <Link to="/splash">
                        <button className="p-2 text-sky-500 underline">Go Back</button>
                    </Link>
                </div>
            </main>
        </>
    );
}

export default Login;
