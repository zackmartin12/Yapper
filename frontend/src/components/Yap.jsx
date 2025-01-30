import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Yap({ authUser, yap }) {
    const [user, setUser] = useState(null);
    const [likes, setLikes] = useState(0);
    const [liked, setLiked] = useState(false);

    useEffect(() => {
        fetch(`/api/users/${yap.user_id}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch user");
                }
                return response.json();
            })
            .then((data) => {
                setUser(data)
            });
    }, [yap.user_id]);

    useEffect(() => {
        fetch(`/api/likes/${yap.yap_id}/count`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch like count");
                }
                return response.json();
            })
            .then((data) => {
                setLikes(data)
            });
    }, [yap.yap_id]);
    
    useEffect(() => {
        fetch(`/api/likes/${yap.yap_id}/${authUser.user_id}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch like status");
                }
                return response.json();
            })
            .then((data) => {
                setLiked(data)
            });
    }, [yap.yap_id, authUser.user_id]);

    function likeYap(e) {
        e.preventDefault();

        fetch(`/api/likes/${yap.yap_id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId: authUser.user_id }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to like yap");
                }
                return response.json();
            })
            .then((data) => {
                setLiked(true);
                setLikes(data);
            });
    }

    function unlikeYap(e) {
        e.preventDefault();

        fetch(`/api/likes/${yap.yap_id}/${authUser.user_id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to unlike yap");
                }
                return response.json();
            })
            .then((data) => {
                setLiked(false);
                setLikes(data);
            });
    }

    if (!user) {
        return <div className="p-2">Loading...</div>;
    }

    return (
        <>
            <div className="border border-zinc-50/20 w-full max-w-xl rounded-lg p-4 hover:bg-zinc-900 flex flex-col gap-2">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 w-full">
                    <Link to={`/profile?id=${user.user_id}`}>
                        <div className="flex flex-col md:flex-row md:items-center gap-1">
                            <div className="font-semibold hover:underline">{user.first_name + " " + user.last_name}</div>
                            <div className="text-zinc-50/50">@{user.username}</div>
                        </div>
                    </Link>
                    <div className="text-zinc-50/50 text-sm">
                        {new Date(yap.datetime).toLocaleString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                            hour12: true,
                        })}
                    </div>
                </div>
                <div className="break-words w-full">{yap.text}</div>
                <div className="flex justify-end">
                    <button
                        onClick={liked ? unlikeYap : likeYap}
                        className={`px-4 py-2 rounded-lg transition duration-150 ${liked ? "text-red-500" : "text-zinc-50/50"}`}
                    >
                        &hearts; {likes}
                    </button>
                </div>
            </div>
        </>
    );
}

export default Yap;
