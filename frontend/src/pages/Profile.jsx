import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Yap from "../components/Yap";
import { Link } from "react-router-dom";

function Profile() {
    const [searchParams] = useSearchParams();
    const userId = parseInt(searchParams.get("id"), 10);
    const [authUser, setAuthUser] = useState(null);
    const [user, setUser] = useState(null);
    const [followingCount, setFollowingCount] = useState(0);
    const [followerCount, setFollowerCount] = useState(0);
    const [followingStatus, setFollowingStatus] = useState(false);
    const [editing, setEditing] = useState(false);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [username, setUsername] = useState("");
    const [yaps, setYaps] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetch("/api/auth/current")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch authenticated user");
                }
                return response.json();
            })
            .then((data) => {
                setAuthUser(data);
            })
            .catch((err) => {
                alert(err.message);
                navigate("/splash");
            });
    }, [navigate]);

    useEffect(() => {
        if (!userId || !authUser) {
            return;
        }

        Promise.all([
            fetch(`/api/users/${userId}`).then((res) => {
                if (!res.ok) {
                    throw new Error("Failed to fetch user");
                }
                return res.json();
            }),
            fetch(`/api/following/${userId}/count`).then((res) => {
                if (!res.ok) {
                    throw new Error("Failed to fetch following count");
                }
                return res.json();
            }),
            fetch(`/api/follower/${userId}/count`).then((res) => {
                if (!res.ok) {
                    throw new Error("Failed to fetch follower count");
                }
                return res.json();
            }),
            fetch(`/api/following/${authUser.user_id}/${userId}`).then((res) => {
                if (!res.ok) {
                    throw new Error("Failed to fetch follow status");
                }
                return res.json();
            }),
            fetch(`/api/yaps/${userId}`).then((res) => {
                if (!res.ok) {
                    throw new Error("Failed to fetch yaps");
                }
                return res.json();
            })
        ])
            .then(([userData, followingCountData, followerCountData, followStatus, yapsData]) => {
                setUser(userData);
                setFollowingCount(followingCountData);
                setFollowerCount(followerCountData);
                setFollowingStatus(followStatus);
                setYaps(yapsData);
            })
            .catch((err) => {
                alert(err.message)
            })
            .finally(() => {
                setLoading(false)
            });
    }, [userId, authUser]);

    function handleFollow() {
        followingStatus ? unfollowUser() : followUser();
    };

    function followUser() {
        fetch(`/api/following/${authUser.user_id}/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ targetUserId: userId })
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to follow user");
                }
                return response.json();
            })
            .then((data) => {
                setFollowingStatus(true);
                setFollowerCount(data);
            })
            .catch((err) => {
                alert(err.message)
            });
    };

    function unfollowUser() {
        fetch(`/api/following/${authUser.user_id}/${userId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            }
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to unfollow user");
                }
                return response.json();
            })
            .then((data) => {
                setFollowingStatus(false);
                setFollowerCount(data);
            })
            .catch((err) => {
                alert(err.message)
            });
    };

    function handleViewEdit() {
        setEditing(true);
    };

    function handleEdit(e) {
        e.preventDefault();

        if (!firstName.trim() && !lastName.trim() && !username.trim()) {
            return;
        }
    
        fetch(`/api/users/${userId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ firstName: firstName, lastName: lastName, username: username })
        })
            .then((response) => {
                if (!response.ok) {
                    return response.json().then((err) => {
                        throw new Error(err.error || "Failed to update user");
                    });
                }
                return response.json();
            })
            .then(() => {
                window.location.reload();
            })
            .catch((err) => {
                alert(err.message);
            });
    }

    function closeEdit() {
        setEditing(false);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    const isCurrentUserProfile = authUser && authUser.user_id === userId;

    return (
        <>
            <Header authUser={authUser} />
            <main className="flex justify-center min-h-screen mt-20">
                <div className="flex flex-col items-center p-10 rounded-lg shadow-lg max-w-xl w-full">
                    <section className="relative border border-zinc-50/20 w-full rounded-lg p-4 flex">
                        <div className="flex flex-col gap-2">
                            <div>
                                <div className="font-semibold">{user.first_name + " " + user.last_name}</div>
                                <div className="text-zinc-50/50">@{user.username}</div>
                            </div>
                            <div className="flex gap-2">
                                <Link to={`/follows?id=${user.user_id}&tab=following`}>
                                    <div className="hover:underline">{followingCount} Following</div>
                                </Link>
                                <Link to={`/follows?id=${user.user_id}&tab=followers`}>
                                    <div className="hover:underline">{followerCount} Followers</div>
                                </Link>
                            </div>
                        </div>
                        <div className="absolute top-4 right-4">
                            {!isCurrentUserProfile ? (
                                <button onClick={handleFollow} className="w-28 bg-white text-black font-semibold rounded-full p-2 hover:bg-zinc-50/90">
                                    {followingStatus ? "Unfollow" : "Follow"}
                                </button>
                            ) : (
                                <button onClick={handleViewEdit} className="w-28 border-2 border-white text-white font-semibold hover:bg-zinc-900 rounded-full p-2">
                                    Edit profile
                                </button>
                            )}
                        </div>
                    </section>
                    <section className="w-full max-w-xl mt-4">
                        <div className="text-3xl font-bold mb-2 p-2">Yaps</div>
                        <div className="flex flex-col gap-4">
                            {yaps.length > 0 ? (
                                yaps.map((yap) => (
                                    <Yap key={yap.yap_id} authUser={authUser} yap={yap} />
                                ))
                            ) : (
                                <div className="p-2"><span className="font-semibold">@{user.username}</span> hasn't posted any yaps yet.</div>
                            )}
                        </div>
                    </section>
                </div>
            </main>

            {editing && (
                <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
                    <div className="bg-black border border-zinc-50/20 flex flex-col gap-4 items-center p-10 rounded-lg shadow-lg max-w-xs w-full">
                        <div className="text-3xl font-bold">Edit Profile</div>
                        <form onSubmit={handleEdit} className="flex flex-col w-full space-y-4">
                            <div className="flex flex-col">
                                <label htmlFor="firstName" className="px-2 py-1">First Name</label>
                                <input 
                                    type="text" 
                                    placeholder="Enter first name" 
                                    id="firstName"
                                    className="bg-zinc-900 rounded-full px-4 py-2 w-full border border-zinc-900 focus:outline-none focus:border focus:border-sky-500 placeholder:text-zinc-50/50" 
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
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
                                />
                            </div>
                            <button type="submit" className="bg-white text-black px-12 py-2 rounded-full w-full font-semibold hover:bg-zinc-50/90">
                                Confirm
                            </button>
                        </form>
                        <button onClick={closeEdit} className="p-2 text-sky-500 underline">Close</button>
                    </div>
                </div>
            )}
        </>
    );
}

export default Profile;
