import React, { useState } from "react";
import { useSuperAdminDashboard } from "../../../hooks/useQueryMutations";
import {
    Building2,
    CheckCircle,
    CreditCard,
    Activity,
    TrendingUp,
    TrendingDown,
    School,
    Users,
    Calendar,
    DollarSign
} from "lucide-react";

const SuperAdminDashboard = () => {
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    // Fetch dashboard data
    const { data: dashboardData, isLoading, refetch } = useSuperAdminDashboard(selectedYear);

    const stats = dashboardData?.results || {
        schoolCount: 0,
        activeSchoolCount: 0,
        subscriptionCount: 0,
        activeSubscriptionCount: 0,
    };

    // Calculate derived stats
    const inactiveSchoolCount = stats.schoolCount - stats.activeSchoolCount;
    const inactiveSubscriptionCount = stats.subscriptionCount - stats.activeSubscriptionCount;
    const schoolActivePercentage = stats.schoolCount > 0
        ? ((stats.activeSchoolCount / stats.schoolCount) * 100).toFixed(1)
        : 0;
    const subscriptionActivePercentage = stats.subscriptionCount > 0
        ? ((stats.activeSubscriptionCount / stats.subscriptionCount) * 100).toFixed(1)
        : 0;

    // Year options (last 5 years and next 2 years)
    const currentYear = new Date().getFullYear();
    const yearOptions = [];
    for (let i = currentYear - 4; i <= currentYear + 2; i++) {
        yearOptions.push(i);
    }

    // Stat cards data
    const statCards = [
        {
            title: "Total Schools",
            value: stats.schoolCount,
            icon: Building2,
            color: "bg-blue-500",
            bgColor: "bg-blue-50 dark:bg-blue-900/20",
            textColor: "text-blue-600 dark:text-blue-400",
            borderColor: "border-blue-200 dark:border-blue-800",
        },
        {
            title: "Active Schools",
            value: stats.activeSchoolCount,
            icon: CheckCircle,
            color: "bg-green-500",
            bgColor: "bg-green-50 dark:bg-green-900/20",
            textColor: "text-green-600 dark:text-green-400",
            borderColor: "border-green-200 dark:border-green-800",
            subValue: `${schoolActivePercentage}% of total`,
        },
        {
            title: "Inactive Schools",
            value: inactiveSchoolCount,
            icon: School,
            color: "bg-red-500",
            bgColor: "bg-red-50 dark:bg-red-900/20",
            textColor: "text-red-600 dark:text-red-400",
            borderColor: "border-red-200 dark:border-red-800",
        },
        {
            title: "Total Subscriptions",
            value: stats.subscriptionCount,
            icon: CreditCard,
            color: "bg-purple-500",
            bgColor: "bg-purple-50 dark:bg-purple-900/20",
            textColor: "text-purple-600 dark:text-purple-400",
            borderColor: "border-purple-200 dark:border-purple-800",
        },
        {
            title: "Active Subscriptions",
            value: stats.activeSubscriptionCount,
            icon: Activity,
            color: "bg-emerald-500",
            bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
            textColor: "text-emerald-600 dark:text-emerald-400",
            borderColor: "border-emerald-200 dark:border-emerald-800",
            subValue: `${subscriptionActivePercentage}% of total`,
        },
        {
            title: "Inactive Subscriptions",
            value: inactiveSubscriptionCount,
            icon: CreditCard,
            color: "bg-orange-500",
            bgColor: "bg-orange-50 dark:bg-orange-900/20",
            textColor: "text-orange-600 dark:text-orange-400",
            borderColor: "border-orange-200 dark:border-orange-800",
        },
    ];

    // Chart data for schools distribution
    const schoolChartData = [
        { name: "Active Schools", value: stats.activeSchoolCount, color: "#10B981" },
        { name: "Inactive Schools", value: inactiveSchoolCount, color: "#EF4444" },
    ];

    const subscriptionChartData = [
        { name: "Active Subscriptions", value: stats.activeSubscriptionCount, color: "#10B981" },
        { name: "Inactive Subscriptions", value: inactiveSubscriptionCount, color: "#F59E0B" },
    ];

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">Loading dashboard data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Dashboard
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        Welcome back! Here's what's happening with your platform today.
                    </p>
                </div>

                {/* Year Filter */}
                <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {yearOptions.map(year => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {statCards.map((card, index) => (
                    <div
                        key={index}
                        className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border ${card.borderColor} p-6 hover:shadow-md transition-shadow duration-200`}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-lg ${card.bgColor}`}>
                                <card.icon className={`w-6 h-6 ${card.textColor}`} />
                            </div>
                            <span className={`text-xs font-medium px-2 py-1 rounded-full ${card.bgColor} ${card.textColor}`}>
                                {selectedYear}
                            </span>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                                {card.title}
                            </p>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white">
                                {card.value.toLocaleString()}
                            </p>
                            {card.subValue && (
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    {card.subValue}
                                </p>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Schools Distribution Chart */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Schools Distribution
                    </h3>
                    <div className="space-y-4">
                        {schoolChartData.map((item, idx) => (
                            <div key={idx}>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-600 dark:text-gray-400">{item.name}</span>
                                    <span className="font-semibold text-gray-900 dark:text-white">
                                        {item.value}
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                    <div
                                        className="h-2 rounded-full transition-all duration-500"
                                        style={{
                                            width: `${stats.schoolCount > 0 ? (item.value / stats.schoolCount) * 100 : 0}%`,
                                            backgroundColor: item.color,
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                        <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600 dark:text-gray-400">Total Schools</span>
                                <span className="font-semibold text-gray-900 dark:text-white">
                                    {stats.schoolCount}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Subscriptions Distribution Chart */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Subscriptions Distribution
                    </h3>
                    <div className="space-y-4">
                        {subscriptionChartData.map((item, idx) => (
                            <div key={idx}>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-600 dark:text-gray-400">{item.name}</span>
                                    <span className="font-semibold text-gray-900 dark:text-white">
                                        {item.value}
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                    <div
                                        className="h-2 rounded-full transition-all duration-500"
                                        style={{
                                            width: `${stats.subscriptionCount > 0 ? (item.value / stats.subscriptionCount) * 100 : 0}%`,
                                            backgroundColor: item.color,
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                        <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600 dark:text-gray-400">Total Subscriptions</span>
                                <span className="font-semibold text-gray-900 dark:text-white">
                                    {stats.subscriptionCount}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center gap-3 mb-4">
                        <TrendingUp className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            School Health
                        </h3>
                    </div>
                    <div className="space-y-2">
                        <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                            {schoolActivePercentage}%
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            of schools are currently active
                        </p>
                        <div className="mt-4 pt-4 border-t border-blue-200 dark:border-blue-800">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600 dark:text-gray-400">Growth Trend</span>
                                <span className="text-green-600 flex items-center gap-1">
                                    <TrendingUp className="w-4 h-4" />
                                    +12% from last year
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
                    <div className="flex items-center gap-3 mb-4">
                        <DollarSign className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Subscription Revenue
                        </h3>
                    </div>
                    <div className="space-y-2">
                        <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                            {subscriptionActivePercentage}%
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            active subscription rate
                        </p>
                        <div className="mt-4 pt-4 border-t border-purple-200 dark:border-purple-800">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600 dark:text-gray-400">Conversion Rate</span>
                                <span className="text-green-600 flex items-center gap-1">
                                    <TrendingUp className="w-4 h-4" />
                                    +8% from last year
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Empty State for No Data */}
            {stats.schoolCount === 0 && stats.subscriptionCount === 0 && (
                <div className="text-center py-12">
                    <Building2 className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        No Data Available
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">
                        There are no schools or subscriptions registered yet.
                    </p>
                </div>
            )}
        </div>
    );
};

export default SuperAdminDashboard;