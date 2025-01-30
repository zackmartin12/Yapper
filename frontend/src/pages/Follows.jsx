import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Header from "../components/Header";

function Follows() {
    const [searchParams] = useSearchParams();
    const userId = parseInt(searchParams.get("id"), 10);
    const tab = searchParams.get("tab"); 
    const [viewFollowing, setViewFollowing] = useState(tab !== "followers");
    const [viewFollowers, setViewFollowers] = useState(tab === "followers");
    const [authUser, setAuthUser] = useState(null);
    const [user, setUser] = useState(null);
    const [followingCount, setFollowingCount] = useState(0);
    const [followerCount, setFollowerCount] = useState(0);
    const [following, setFollowing] = useState([]);
    const [followers, setFollowers] = useState([]);
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
            fetch(`/api/following/${userId}`).then((res) => {
                if (!res.ok) {
                    throw new Error("Failed to fetch following");
                }
                return res.json();
            }),
            fetch(`/api/follower/${userId}`).then((res) => {
                if (!res.ok) {
                    throw new Error("Failed to fetch followers");
                }
                return res.json();
            })
        ])
            .then(([userData, followingCountData, followerCountData, followingData, followerData]) => {
                setUser(userData);
                setFollowingCount(followingCountData);
                setFollowerCount(followerCountData);
                setFollowing(followingData);
                setFollowers(followerData);
            })
            .catch((err) => {
                alert(err.message)
            })
            .finally(() => {
                setLoading(false)
            });
    }, [userId, authUser]);

    function handleViewFollowing() {
        setViewFollowing(true);
        setViewFollowers(false);
        navigate(`/follows?id=${userId}&tab=following`, { replace: true });
    }
    
    function handleViewFollowers() {
        setViewFollowing(false);
        setViewFollowers(true);
        navigate(`/follows?id=${userId}&tab=followers`, { replace: true });
    }

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <Header authUser={authUser}/>
            <main className="flex justify-center min-h-screen mt-20">
                <div className="flex flex-col rounded-lg shadow-lg max-w-xl w-full border border-zinc-50/20">
                    <section className="sticky top-0 z-10 w-full pt-2">
                        <div className="flex gap-4 w-full p-4">
                            <Link to={`/profile?id=${userId}`} className="text-xl hover:bg-zinc-800 rounded-lg px-2 flex items-center justify-center h-8 w-8">
                                ←
                            </Link>
                            <div>
                                <div className="font-semibold">{user.first_name + " " + user.last_name}</div>
                                <div className="text-zinc-50/50">@{user.username}</div>
                            </div>
                        </div>
                        <div className="flex w-full border-b border-zinc-50/20">
                            <div 
                                onClick={handleViewFollowing} 
                                className={`flex-1 text-lg font-semibold p-3 text-center cursor-pointer hover:bg-zinc-800 ${
                                    viewFollowing ? "text-white" : "text-zinc-50/50"
                                }`}
                            >
                                Following ({followingCount})
                            </div>
                            <div 
                                onClick={handleViewFollowers} 
                                className={`flex-1 text-lg font-semibold p-3 text-center cursor-pointer hover:bg-zinc-800 ${
                                    viewFollowers ? "text-white" : "text-zinc-50/50"
                                }`}
                            >
                                Followers ({followerCount})
                            </div>
                        </div>
                    </section>
                    <section className="w-full overflow-y-auto">
                        {viewFollowing && (
                            <div className="flex flex-col w-full">
                                {following.length > 0 ? (
                                    following.map((followedUser) => (
                                        <div key={followedUser.user_id} className="flex flex-col w-full p-4 hover:bg-zinc-900">
                                            <Link to={`/profile?id=${followedUser.user_id}`}>
                                                <div className="flex gap-2">
                                                    <div className="font-semibold text-white hover:underline">{`${followedUser.first_name} ${followedUser.last_name}`}</div>
                                                    <div className="text-zinc-50/50">@{followedUser.username}</div>
                                                </div>
                                            </Link>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-zinc-50/50 text-center p-4">No followed users yet</div>
                                )}
                            </div>
                        )}
                        {viewFollowers && (
                            <div className="flex flex-col w-full">
                                {followers.length > 0 ? (
                                    followers.map((follower) => (
                                        <div key={follower.user_id} className="flex flex-col w-full p-4 hover:bg-zinc-900">
                                            <Link to={`/profile?id=${follower.user_id}`}>
                                                <div className="flex gap-2">
                                                    <div className="font-semibold text-white hover:underline">{`${follower.first_name} ${follower.last_name}`}</div>
                                                    <div className="text-zinc-50/50">@{follower.username}</div>
                                                </div>
                                            </Link>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-zinc-50/50 text-center p-4">No followers yet</div>
                                )}
                            </div>
                        )}
                    </section>
                </div>
            </main>
        </>
    );
}

export default Follows;