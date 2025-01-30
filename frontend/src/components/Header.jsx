import { Link } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import HeaderProfile from "../components/HeaderProfile";

function Header({ authUser }) {
    return (
        <>
            <header className="bg-black border-b border-zinc-50/20 w-full fixed top-0 z-50">
                <div className="relative flex items-center justify-between w-full p-4">
                    <Link to="/">
                        <div className="text-4xl font-bold px-4 py-2">yapper</div>
                    </Link>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-lg px-2">
                        <SearchBar />
                    </div>
                    <HeaderProfile authUser={authUser} />
                </div>
            </header>
        </>
    );
}

export default Header;
