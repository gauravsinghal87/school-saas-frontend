import { useQueryClient } from "@tanstack/react-query";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { useState } from "react";
import { useUser } from "../context/UserContext";
import BaseNavbar from "../components/common/BaseNavbar";
import Sidebar from "../components/common/BaseSidebar";
import { MENU_CONFIG } from "../utils/menuConfig";

const BaseLayout = ({ title, menu, role, user }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const queryClient = useQueryClient();
    const { logout } = useUser();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [activeItem, setActiveItem] = useState(null);

    const handleLogout = async () => {
        await logout();
        queryClient.clear();
        navigate("/");
    };

    // Get current path to determine active item
    const getActiveItemFromPath = () => {
        const currentPath = location.pathname;
        const activeMenuItem = menu.find(item => item.path === currentPath);
        return activeMenuItem?.name || null;
    };



    // Handle mobile menu toggle
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    // Handle sidebar item click
    const handleSidebarItemClick = (itemId) => {
        setActiveItem(itemId);
    };


    console.log('menu>>>', MENU_CONFIG[role])
    return (
        <div className="flex h-screen bg-">
            {/* Modern Sidebar */}
            <Sidebar
                role={role}
                activeItem={activeItem || getActiveItemFromPath()}
                onItemClick={handleSidebarItemClick}
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                user={user}
                menuConfig={MENU_CONFIG}
            />

            {/* Main Content Area */}
            <div className="flex flex-col flex-1 ">
                {/* Topbar with mobile menu toggle */}
                <BaseNavbar onMenuToggleonMenuClick={toggleSidebar} />

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto p-4">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default BaseLayout;