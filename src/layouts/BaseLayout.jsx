import { useQueryClient } from "@tanstack/react-query";
import { useNavigate, useLocation, Outlet } from "react-router-dom";

const BaseLayout = ({ title, menu }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const queryClient = useQueryClient();

    const handleLogout = async () => {
        // 🔐 remove auth data
        localStorage.removeItem("token");
        localStorage.removeItem("role");

        // 🧠 clear all queries
        await queryClient.clear();

        // 🚀 redirect
        navigate("/", { replace: true });
    };

    return (
        <div className="flex h-screen bg-gray-100">

            {/* 🧭 Sidebar */}
            <aside className="w-64 bg-gray-900 text-white flex flex-col">
                <div className="p-4 text-xl font-bold border-b border-gray-700">
                    {title}
                </div>

                <nav className="flex-1 p-2">
                    {menu.map((item) => (
                        <div
                            key={item.path}
                            onClick={() => navigate(item.path)}
                            className={`p-2 rounded cursor-pointer ${location.pathname === item.path
                                ? "bg-gray-700"
                                : "hover:bg-gray-700"
                                }`}
                        >
                            {item.name}
                        </div>
                    ))}
                </nav>
            </aside>

            {/* 🧩 Main */}
            <div className="flex flex-col flex-1">

                {/* 🔝 Topbar */}
                <header className="h-14 bg-white shadow flex items-center justify-between px-4">
                    <div className="font-semibold text-gray-700">
                        {title}
                    </div>

                    <button
                        onClick={handleLogout}
                        className="px-3 py-1 bg-red-500 text-white rounded"
                    >
                        Logout
                    </button>
                </header>

                {/* 📄 Content */}
                <main className="flex-1 p-4 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default BaseLayout;