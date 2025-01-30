import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";

function HeaderProfile({ authUser }) {
    const [user, setUser] = useState(null);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!authUser) return;

        fetch(`/api/users/${authUser.user_id}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch user");
                }
                return response.json();
            })
            .then((data) => {
                setUser(data);
            })
            .catch((err) => {
                alert(err.message)
            });
    }, [authUser]);

    function logout(e) {
        e.preventDefault();

        fetch("/api/auth/logout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to log out user");
                }
                return response.json();
            })
            .then(() => {
                setDropdownVisible(false);
                navigate("/splash");
            })
            .catch((err) => {
                setError(err.message);
            });
    }

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownVisible(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    if (!authUser || !user) {
        return null;
    }

    function toggleDropdown() {
        setDropdownVisible((prev) => !prev);
    };

    return (
        <>
            <div className="relative">
                <div onClick={toggleDropdown} className="cursor-pointer font-semibold hover:bg-zinc-800 hover:rounded-full px-4 py-2">
                    @{user.username}
                </div>
                {dropdownVisible && (
                    <div ref={dropdownRef} className="absolute right-0 mt-2 bg-black shadow-lg rounded-lg border border-zinc-50/20 w-32">
                        <Link to={`/profile?id=${user.user_id}`} onClick={() => setDropdownVisible(false)}>
                            <div className="px-4 py-2 hover:bg-zinc-800 rounded-t-lg w-full text-center">View Profile</div>
                        </Link>
                        <div>
                            <button onClick={logout} className="hover:bg-zinc-800 hover:text-red-500 rounded-b-lg px-4 py-2 w-full text-center">
                                Logout
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export default HeaderProfile;
