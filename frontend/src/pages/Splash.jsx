import { Link } from "react-router-dom";

function Splash() {
    return (
        <>
            <main className="flex items-center justify-center min-h-screen">
                <div className="border-2 border-zinc-50/20 flex flex-col gap-4 items-center p-10 rounded-lg shadow-lg max-w-xs w-full">
                    <div className="text-4xl">Yapper</div>
                    <div className="text-center text-zinc-50/50">Continue below!</div>
                    <div className="flex flex-col w-full space-y-4">
                        <Link to="/login" className="w-full">
                            <button className="bg-white text-black font-semibold px-12 py-2 rounded-full w-full hover:bg-zinc-50/90">Login</button>
                        </Link>
                        <Link to="/register" className="w-full">
                            <button className="bg-sky-500 text-white font-semibold px-12 py-2 rounded-full w-full hover:bg-sky-600">Register</button>
                        </Link>
                    </div>
                </div>
            </main>
        </>
    );
}

export default Splash;
