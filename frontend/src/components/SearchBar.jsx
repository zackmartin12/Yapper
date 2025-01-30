import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

function SearchBar() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const dropdownRef = useRef(null);

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

    useEffect(() => {
        const debounceTimeout = setTimeout(() => {
            if (query) {
                fetch(`/api/users/search/${encodeURIComponent(query)}`)
                    .then((response) => {
                        if (!response.ok) {
                            throw new Error("Failed to fetch results");
                        }
                        return response.json();
                    })
                    .then((data) => {
                        setResults(data.length > 0 ? data : []);
                        setDropdownVisible(true);
                    })
                    .catch((err) => {
                        alrt(err.message);
                        setResults([]);
                        setDropdownVisible(false);
                    });
            } else {
                setResults([]);
                setDropdownVisible(false);
            }
        }, 200);

        return () => clearTimeout(debounceTimeout);
    }, [query]);

    function handleChange(e) {
        const value = e.target.value;
        setQuery(value);
    }

    return (
        <>
            <div className="relative">
                <input
                    type="text"
                    className="bg-black hover:bg-zinc-900 placeholder:text-zinc-50/50 text-white rounded-full border border-zinc-50/20 focus:outline-none focus:border focus:border-sky-500 px-4 py-2 w-full max-w-xl"
                    value={query}
                    onChange={handleChange}
                    placeholder="Search..."
                />
                {dropdownVisible && results.length > 0 && (
                    <div ref={dropdownRef} className="absolute mt-2 bg-black shadow-lg rounded-lg border border-zinc-50/20 w-full max-w-xl">
                        {results.map((user) => (
                            <Link key={user.user_id} to={`/profile?id=${user.user_id}`} onClick={() => setDropdownVisible(false)}>
                                <div className="px-4 py-2 hover:bg-zinc-800">
                                    {`${user.first_name} ${user.last_name} @${user.username}`}
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
                {dropdownVisible && query && results.length === 0 && (
                    <div ref={dropdownRef} className="absolute mt-2 bg-black shadow-lg rounded-lg border border-zinc-50/20 w-full max-w-xl">
                        <div className="px-4 py-2 text-gray-500">No results found</div>
                    </div>
                )}
            </div>
        </>
    );
}

export default SearchBar;
