import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../../Components/Other/Sidebar/Sidebar';
import AdminHeader from '../../Components/Other/Header/AdminHeader';

export default function AdminLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <div className="min-h-screen bg-gray-50 transition-colors duration-500">
            {/* Sidebar */}
            <Sidebar open={sidebarOpen} />

            <div
                className={`transition-all duration-500 min-h-screen flex flex-col`}
                style={{
                    marginLeft: sidebarOpen ? "80px" : "230px",
                    width: sidebarOpen ? "calc(100% - 80px)" : "calc(100% - 230px)"
                }}
            >
                {/* Header */}
                <AdminHeader
                    active={toggleSidebar}
                    sidebarOpen={!sidebarOpen}
                />
                {/* Page Content */}
                <main className="flex-grow mt-[60px] p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
