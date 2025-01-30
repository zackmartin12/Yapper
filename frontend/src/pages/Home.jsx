import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Yap from "../components/Yap";

function Home() {
    const [authUser, setAuthUser] = useState(null);
    const [yapInputText, setYapInputText] = useState("");
    const [yaps, setYaps] = useState([]);
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
                navigate("/splash");
            });
    }, [navigate]);

    function createYap(e) {
        e.preventDefault();

        if (yapInputText.trim()) {
            fetch("/api/yaps", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userId: authUser.user_id, text: yapInputText }),
            })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to add yap");
                }
                return response.json();
            })
            .then((newYap) => {
                setYaps((prevYaps) => [newYap, ...prevYaps]);
                setYapInputText("");
            })
            .catch((err) => {
                alert(err.message)
            });
        } else {
            alert("Yap text cannot be empty!");
        }
    }
    
    useEffect(() => {
        if (authUser) {
            fetch(`/api/yaps/${authUser.user_id}/feed`)
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Failed to fetch feed");
                    }
                    return response.json();
                })
                .then((data) => {
                    setYaps(data);
                })
                .catch((err) => {
                    alert(err.message)
                });
        }
    }, [authUser]);

    return (
        <>
            <Header authUser={authUser}/>
            <main className="flex justify-center min-h-screen mt-20">
                <div className="flex flex-col items-center p-10 rounded-lg shadow-lg max-w-xl w-full">
                    <section className="border border-zinc-50/20 w-full rounded-lg p-4">
                        <form onSubmit={createYap} className="flex flex-col space-y-4">
                            <textarea
                                className="bg-black p-2 w-full resize-none border-zinc-50/20 focus:outline-none focus:border-b focus:border-sky-500 placeholder:text-zinc-50/50"
                                rows="3"
                                placeholder="What's yappening?"
                                value={yapInputText}
                                onChange={(e) => setYapInputText(e.target.value)}
                            ></textarea>
                            <div className="flex justify-end">
                                <button type="submit" className="bg-sky-500 text-white font-semibold hover:bg-sky-600 px-6 py-2 rounded-full">
                                    Yap
                                </button>
                            </div>
                        </form>
                    </section>
                    <section className="w-full max-w-xl mt-4">
                        <div className="text-3xl font-bold mb-2 p-2">Feed</div>
                        <div className="flex flex-col gap-4">
                            {yaps.length > 0 ? (
                                yaps.map((yap) => (
                                    <Yap key={yap.yap_id} authUser={authUser} yap={yap} />
                                ))
                            ) : (
                                <div className="p-2">Your feed is empty, try searching for users to follow.</div>
                            )}
                        </div>
                    </section>
                </div>
            </main>
        </>
    );
}

export default Home;
