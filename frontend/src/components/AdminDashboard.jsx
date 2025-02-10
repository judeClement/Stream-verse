import React, { useState } from 'react';
import { Menu, Users, ClipboardList, Film } from 'lucide-react';
import Navbar from './Navbar';
import UserManagement from './UserManagement';
import ActivityLogs from './ActivityLogs';
import MovieManagement from './MovieManagement';

const AdminDashboard = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isSidebarSlim, setIsSidebarSlim] = useState(false);
    const [activeComponent, setActiveComponent] = useState('UserManagement');

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const toggleSlimSidebar = () => {
        setIsSidebarSlim(!isSidebarSlim);
    };

    const renderComponent = () => {
        switch (activeComponent) {
            case 'UserManagement':
                return <UserManagement />;
            case 'ActivityLogs':
                return <ActivityLogs />;
            case 'MovieManagement':
                return <MovieManagement />;
            default:
                return <UserManagement />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />

            <div className="flex"style={{ marginTop: '4.5rem' }}>
                {/* Sidebar */}
                <div
                    className={`bg-gray-200 text-black transition-all duration-300 ${
                        isSidebarOpen ? (isSidebarSlim ? 'w-20' : 'w-64') : 'w-0'
                    } min-h-screen overflow-hidden`}
                >
                    <div className="p-4">
                        <ul className="w-full">
                            <li className="mb-2">
                                <button
                                    className="flex items-center w-full text-left hover:bg-gray-300 p-2 rounded"
                                    onClick={() => setActiveComponent('UserManagement')}
                                >
                                    <Users size={24} />
                                    {!isSidebarSlim && <span className="ml-2">User Management</span>}
                                </button>
                            </li>
                            <li className="mb-2">
                                <button
                                    className="flex items-center w-full text-left hover:bg-gray-300 p-2 rounded"
                                    onClick={() => setActiveComponent('ActivityLogs')}
                                >
                                    <ClipboardList size={24} />
                                    {!isSidebarSlim && <span className="ml-2">Activity Logs</span>}
                                </button>
                            </li>
                            <li>
                                <button
                                    className="flex items-center w-full text-left hover:bg-gray-300 p-2 rounded"
                                    onClick={() => setActiveComponent('MovieManagement')}
                                >
                                    <Film size={24} />
                                    {!isSidebarSlim && <span className="ml-2">Movie Management</span>}
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 p-4">
                    {/* Buttons moved to the right side */}
                    <div className="flex justify-end space-x-4 mb-4">
                        <button className="p-2 bg-gray-300 hover:bg-gray-400 rounded" onClick={toggleSidebar}>
                            <Menu size={24} />
                        </button>
                        <button className="p-2 bg-gray-300 hover:bg-gray-400 rounded" onClick={toggleSlimSidebar}>
                            {isSidebarSlim ? 'Expand Sidebar' : 'Toggle Slim'}
                        </button>
                    </div>
                    
                    {renderComponent()}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
