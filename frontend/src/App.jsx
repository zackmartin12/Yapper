import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Splash from './pages/Splash';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Follows from './pages/Follows';

function App() {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/splash" element={<Splash />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/" element={<Home />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/follows" element={<Follows />} />
                </Routes>
            </BrowserRouter>
        </>
    )
}

export default App
