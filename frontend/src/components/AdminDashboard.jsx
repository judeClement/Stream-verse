import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import Navbar from './Navbar';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        console.log("Fetched Users:", users);  // This will log the updated users after deletion
    }, [users]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem('token'); // Retrieve token
                if (!token) {
                    console.error("No token found");
                    return;
                }
    
                const { data } = await api.get('/admin/users', {
                    headers: { Authorization: `Bearer ${token}` }, // Include token
                });
    
                setUsers(data);
                console.log(data);

            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
    
        fetchUsers();
    }, []);
    

    const handleDelete = async (userId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this user?");
        if (!confirmDelete) return;

        try {
            const token = localStorage.getItem('token');
            await api.delete(`/admin/users/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            // Remove deleted user from UI without refreshing the page
            setUsers(users.filter(user => user._id !== userId));
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    return (
        <div>
        <Navbar/>
        <div className="container mx-auto mt-10 p-4">
            <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
            <table className="w-full mt-5 border border-gray-700 text-white">
                <thead>
                    <tr className="bg-gray-800">
                        <th className="p-2">Name</th>
                        <th className="p-2">Email</th>
                        <th className="p-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user._id} className="border-b border-gray-700 text-black">
                            <td className="p-2 text-center">{user.name}</td>
                            <td className="p-2 text-center">{user.email}</td>
                            <td className="p-2 text-center">
                                <button
                                    onClick={() => handleDelete(user._id)}
                                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        </div>
    );
};

export default AdminDashboard;
