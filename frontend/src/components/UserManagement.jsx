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
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold text-black mb-4">User Management</h1>

            <div className="flex justify-between items-center mt-4">
                <input
                    type="text"
                    placeholder="Search by name..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="p-2 border border-gray-700 rounded bg-gray-800 text-white"
                />
                <button
                    onClick={handleSort}
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                >
                    Sort by Name ({sortOrder === 'asc' ? 'Ascending' : 'Descending'})
                </button>
            </div>

            <table className="w-full mt-5 border border-gray-700 text-white">
                <thead>
                    <tr className="bg-gray-800">
                        <th className="p-2">Name</th>
                        <th className="p-2">Email</th>
                        <th className="p-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedUsers.map(user => (
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

            <div className="flex justify-between items-center mt-4 text-white">
                <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 rounded ${currentPage === 1 ? 'bg-gray-600' : 'bg-blue-600 hover:bg-blue-700'}`}
                >
                    Previous
                </button>

                <span className='text-black'>
                    Page {currentPage} of {totalPages}
                </span>

                <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1 rounded ${currentPage === totalPages ? 'bg-gray-600' : 'bg-blue-600 hover:bg-blue-700'}`}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default UserManagement;
