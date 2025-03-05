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
<div className="container mx-auto p-6 w-full max-w-7xl bg-white shadow-lg rounded-lg">
    <h2 className="text-2xl font-bold text-green-700 mb-6 text-center md:text-left">User Activity Logs</h2>

    {/* Search and Sort Controls */}
    <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <input
            type="text"
            placeholder="Search by user name..."
            value={searchTerm}
            onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);  // Reset to first page on search
            }}
            className="p-3 border border-gray-300 rounded-lg bg-white text-black w-full md:w-auto shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <button
            onClick={toggleSortOrder}
            className="p-3 bg-green-600 text-white rounded-lg w-full md:w-auto hover:bg-green-700 transition shadow-md"
        >
            Sort by Timestamp ({sortOrder === 'asc' ? 'Ascending' : 'Descending'})
        </button>
    </div>

    {/* Logs Table */}
    <div className="overflow-x-auto">
        <table className="w-full border border-gray-300 text-black text-sm md:text-base shadow-md rounded-lg overflow-hidden">
            <thead>
                <tr className="bg-green-600 text-white">
                    <th className="p-3 text-center">User</th>
                    <th className="p-3 text-center">Email</th>
                    <th className="p-3 text-center">Action</th>
                    <th className="p-3 text-center">Timestamp</th>
                </tr>
            </thead>
            <tbody>
                {currentLogs.length > 0 ? (
                    currentLogs.map(log => (
                        <tr 
                            key={log._id} 
                            className="border-b border-gray-300 bg-gray-100 hover:bg-green-50 transition"
                        >
                            <td className="p-3 text-center break-words max-w-xs">{log.user.name}</td>
                            <td className="p-3 text-center break-words max-w-xs">{log.user.email}</td>
                            <td className="p-3 text-center break-words max-w-xs">{log.action}</td>
                            <td className="p-3 text-center break-words max-w-xs">{new Date(log.timestamp).toLocaleString()}</td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="4" className="p-4 text-center text-gray-600">No logs found.</td>
                    </tr>
                )}
            </tbody>
        </table>
    </div>

    {/* Pagination Controls */}
    <div className="flex flex-col md:flex-row justify-between items-center mt-6 text-black gap-4">
        <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className={`p-3 rounded-lg w-full md:w-auto shadow-md ${currentPage === 1 ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 text-white'}`}
        >
            Previous
        </button>
        <span className='text-green-700 font-semibold text-center'>
            Showing {currentPage} of {totalPages} pages
        </span>
        <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`p-3 rounded-lg w-full md:w-auto shadow-md ${currentPage === totalPages ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 text-white'}`}
        >
            Next
        </button>
    </div>
</div>


    );
};

export default ActivityLogs;
