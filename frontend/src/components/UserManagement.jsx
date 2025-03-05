import React, { useEffect, useState } from 'react';
import api from '../api';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');

    const USERS_PER_PAGE = 10;

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem('token');
                const { data } = await api.get('/admin/users', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUsers(data);
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
            setUsers(users.filter(user => user._id !== userId));
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const handleSort = () => {
        setSortOrder(prevOrder => (prevOrder === 'asc' ? 'desc' : 'asc'));
    };

    const filteredUsers = users
        .filter(user => user.name.toLowerCase().includes(searchTerm.toLowerCase()))
        .sort((a, b) => {
            if (sortOrder === 'asc') {
                return a.name.localeCompare(b.name);
            } else {
                return b.name.localeCompare(a.name);
            }
        });

    const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);
    const paginatedUsers = filteredUsers.slice((currentPage - 1) * USERS_PER_PAGE, currentPage * USERS_PER_PAGE);

    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    return (
<div className="container mx-auto p-6 w-full max-w-7xl bg-white shadow-lg rounded-lg">
    <h1 className="text-2xl font-bold text-green-700 mb-6 text-center md:text-left">User Management</h1>

    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <input
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={handleSearch}
            className="p-2 border border-gray-300 rounded bg-white text-black w-full md:w-auto focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <button
            onClick={handleSort}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-all w-full md:w-auto"
        >
            Sort by Name ({sortOrder === 'asc' ? 'Ascending' : 'Descending'})
        </button>
    </div>

    <div className="overflow-x-auto mt-6">
        <table className="w-full border border-gray-300 text-black text-sm md:text-base bg-white rounded-lg">
            <thead>
                <tr className="bg-green-100 text-green-800">
                    <th className="p-3">Name</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Actions</th>
                </tr>
            </thead>
            <tbody>
                {paginatedUsers.map(user => (
                    <tr key={user._id} className="border-b border-gray-200 hover:bg-green-50 transition-all">
                        <td className="p-3 text-center break-words">{user.name}</td>
                        <td className="p-3 text-center break-words">{user.email}</td>
                        <td className="p-3 text-center">
                            <button
                                onClick={() => handleDelete(user._id)}
                                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-all"
                            >
                                Delete
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>

    <div className="flex flex-col md:flex-row justify-between items-center mt-6 text-black gap-4">
        <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded w-full md:w-auto ${currentPage === 1 ? 'bg-gray-300 text-gray-600' : 'bg-green-600 text-white hover:bg-green-700 transition-all'}`}
        >
            Previous
        </button>

        <span className="text-center font-medium">
            Page {currentPage} of {totalPages}
        </span>

        <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded w-full md:w-auto ${currentPage === totalPages ? 'bg-gray-300 text-gray-600' : 'bg-green-600 text-white hover:bg-green-700 transition-all'}`}
        >
            Next
        </button>
    </div>
</div>

    );
};

export default UserManagement;
