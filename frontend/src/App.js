import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Home from './components/Home';
import WatchingPage from './components/WatchingPage';

const App = () => (
    <Router>
        <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/login" element={<Login/>} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/watch" element={<WatchingPage/>} />
        </Routes>
    </Router>
);

export default App;
