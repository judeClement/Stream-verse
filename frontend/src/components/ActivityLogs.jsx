import React, { useEffect, useState } from 'react';
import api from '../api';

const ActivityLogs = () => {
    const [logs, setLogs] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('desc');

    const logsPerPage = 10;

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const token = localStorage.getItem('token');
                const { data } = await api.get('/admin/logs', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setLogs(data);
            } catch (error) {
                console.error('Error fetching logs:', error);
            }
        };
        fetchLogs();
    }, []);

    // Filter logs by search term
    const filteredLogs = logs.filter(log =>
        log.user && log.user.name && log.user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    

    // Sort logs by timestamp
    const sortedLogs = filteredLogs.sort((a, b) => {
        return sortOrder === 'asc'
            ? new Date(a.timestamp) - new Date(b.timestamp)
            : new Date(b.timestamp) - new Date(a.timestamp);
    });

    // Pagination logic
    const indexOfLastLog = currentPage * logsPerPage;
    const indexOfFirstLog = indexOfLastLog - logsPerPage;
    const currentLogs = sortedLogs.slice(indexOfFirstLog, indexOfLastLog);
    const totalPages = Math.ceil(sortedLogs.length / logsPerPage);

    // Handle page navigation
    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(prevPage => prevPage + 1);
    };

    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage(prevPage => prevPage - 1);
    };

    // Handle sorting toggle
    const toggleSortOrder = () => {
        setSortOrder(prevOrder => (prevOrder === 'asc' ? 'desc' : 'asc'));
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold text-black mb-4">User Activity Logs</h2>

            {/* Search and Sort Controls */}
            <div className="flex justify-between items-center mb-4">
                <input
                    type="text"
                    placeholder="Search by user name..."
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1);  // Reset to first page on search
                    }}
                    className="p-2 border border-gray-700 rounded bg-gray-900 text-white"
                />
                <button
                    onClick={toggleSortOrder}
                    className="p-2 bg-blue-600 text-white rounded"
                >
                    Sort by Timestamp ({sortOrder === 'asc' ? 'Ascending' : 'Descending'})
                </button>
            </div>

            {/* Logs Table */}
            <table className="w-full border border-gray-700 text-white">
                <thead>
                    <tr className="bg-gray-800">
                        <th className="p-2 text-center">User</th>
                        <th className="p-2 text-center">Email</th>
                        <th className="p-2 text-center">Action</th>
                        <th className="p-2 text-center">Timestamp</th>
                    </tr>
                </thead>
                <tbody>
                    {currentLogs.length > 0 ? (
                        currentLogs.map(log => (
                            <tr key={log._id} className="border-b border-gray-700 text-black">
                                <td className="p-2 text-center">{log.user.name}</td>
                                <td className="p-2 text-center">{log.user.email}</td>
                                <td className="p-2 text-center">{log.action}</td>
                                <td className="p-2 text-center">{new Date(log.timestamp).toLocaleString()}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" className="p-4 text-center text-white">No logs found.</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Pagination Controls */}
            <div className="flex justify-between items-center mt-4 text-white">
                <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className={`p-2 rounded ${currentPage === 1 ? 'bg-gray-600' : 'bg-blue-600'} text-white`}
                >
                    Previous
                </button>
                <span>
                    Showing {currentPage} of {totalPages} pages
                </span>
                <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded ${currentPage === totalPages ? 'bg-gray-600' : 'bg-blue-600'} text-white`}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default ActivityLogs;
