import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function Register() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const navigate = useNavigate();

    function register(e) {
        e.preventDefault();

        if (!firstName.trim() || !lastName.trim() || !username.trim() || !password.trim() || !confirmPassword.trim()) {
            alert("All fields are required.");
            return;
        }

        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        fetch("/api/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ firstName: firstName, lastName: lastName, username: username, password: password })
        })
            .then((response) => {
                if (!response.ok) {
                    return response.json().then((err) => {
                        throw new Error(err.error || "Failed to register user");
                    });
                }
                return response.json();
            })
            .then(() => {
                navigate("/splash");
            })
            .catch((err) => {
                alert(err.message);
            });
    }

    return (
        <>
            <main className="flex items-center justify-center min-h-screen">
                <div className="border-2 border-zinc-50/20 flex flex-col gap-4 items-center p-10 rounded-lg shadow-lg max-w-xs w-full">
                    <div className="text-4xl">Yapper</div>
                    <form onSubmit={register} className="flex flex-col w-full space-y-4">
                        <div className="flex flex-col">
                            <label htmlFor="firstName" className="px-2 py-1">First Name</label>
                            <input 
                                type="text" 
                                placeholder="Enter first name" 
                                id="firstName"
                                className="bg-zinc-900 rounded-full px-4 py-2 w-full border border-zinc-900 focus:outline-none focus:border focus:border-sky-500 placeholder:text-zinc-50/50" 
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)} 
                                required
                            />
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="lastName" className="px-2 py-1">Last Name</label>
                            <input 
                                type="text" 
                                placeholder="Enter last name" 
                                id="lastName"
                                className="bg-zinc-900 rounded-full px-4 py-2 w-full border border-zinc-900 focus:outline-none focus:border focus:border-sky-500 placeholder:text-zinc-50/50" 
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)} 
                                required
                            />
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="username" className="px-2 py-1">Username</label>
                            <input 
                                type="text" 
                                placeholder="Enter username" 
                                id="username"
                                className="bg-zinc-900 rounded-full px-4 py-2 w-full border border-zinc-900 focus:outline-none focus:border focus:border-sky-500 placeholder:text-zinc-50/50" 
                                value={username}
                                onChange={(e) => setUsername(e.target.value)} 
                                required
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
                                required
                            />
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="confirmPassword" className="px-2 py-1">Confirm Password</label>
                            <input 
                                type="password" 
                                placeholder="Reenter password" 
                                id="confirmPassword" 
                                className="bg-zinc-900 rounded-full px-4 py-2 w-full border border-zinc-900 focus:outline-none focus:border focus:border-sky-500 placeholder:text-zinc-50/50"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)} 
                                required
                            />
                        </div>
                        <button type="submit" className="bg-sky-500 text-white font-semibold px-12 py-2 rounded-full w-full hover:bg-sky-600">
                            Register
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

export default Register;
