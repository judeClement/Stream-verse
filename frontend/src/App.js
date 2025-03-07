import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Home from './components/Home';
import WatchingPage from './components/WatchingPage';
import Profile from './components/Profile';
import PrivateRoute from './components/PrivateRoute';
import AdminDashboard from './components/AdminDashboard';

const App = () => (
    <Router>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            {/* Secure Admin Dashboard */}
            <Route
                path="/admin/dashboard"
                element={
                    <PrivateRoute adminOnly={true}>
                        <AdminDashboard />
                    </PrivateRoute>
                }
            />            <Route
                path="/watch"
                element={
                    <PrivateRoute>
                        <WatchingPage />
                    </PrivateRoute>
                }
            />
            <Route
                path="/profile"
                element={
                    <PrivateRoute>
                        <Profile />
                    </PrivateRoute>
                }
            />
        </Routes>
    </Router>
);

export default App;
