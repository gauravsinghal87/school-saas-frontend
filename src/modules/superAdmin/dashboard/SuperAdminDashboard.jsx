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

    // Stat cards data with theme colors
    const statCards = [
        {
            title: "Total Schools",
            value: stats.schoolCount,
            icon: Building2,
            color: "primary",
        },
        {
            title: "Active Schools",
            value: stats.activeSchoolCount,
            icon: CheckCircle,
            color: "success",
            subValue: `${schoolActivePercentage}% of total`,
        },
        {
            title: "Inactive Schools",
            value: inactiveSchoolCount,
            icon: School,
            color: "error",
        },
        {
            title: "Total Subscriptions",
            value: stats.subscriptionCount,
            icon: CreditCard,
            color: "info",
        },
        {
            title: "Active Subscriptions",
            value: stats.activeSubscriptionCount,
            icon: Activity,
            color: "success",
            subValue: `${subscriptionActivePercentage}% of total`,
        },
        {
            title: "Inactive Subscriptions",
            value: inactiveSubscriptionCount,
            icon: CreditCard,
            color: "warning",
        },
    ];

    const getColorStyles = (color) => {
        const styles = {
            primary: {
                bg: "bg-primary/10",
                text: "text-primary",
                border: "border-primary/20",
                iconBg: "bg-primary/15",
                gradient: "from-primary/5 to-transparent"
            },
            success: {
                bg: "bg-success/10",
                text: "text-success",
                border: "border-success/20",
                iconBg: "bg-success/15",
                gradient: "from-success/5 to-transparent"
            },
            error: {
                bg: "bg-error/10",
                text: "text-error",
                border: "border-error/20",
                iconBg: "bg-error/15",
                gradient: "from-error/5 to-transparent"
            },
            warning: {
                bg: "bg-warning/10",
                text: "text-warning",
                border: "border-warning/20",
                iconBg: "bg-warning/15",
                gradient: "from-warning/5 to-transparent"
            },
            info: {
                bg: "bg-info/10",
                text: "text-info",
                border: "border-info/20",
                iconBg: "bg-info/15",
                gradient: "from-info/5 to-transparent"
            }
        };
        return styles[color] || styles.primary;
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-2 border-primary border-t-transparent mx-auto"></div>
                    <p className="mt-4 text-text-secondary">Loading dashboard data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6 bg-surface-page min-h-screen">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-text-heading">
                        Dashboard
                    </h1>
                    <p className="text-text-secondary mt-1">
                        Welcome back! Here's what's happening with your platform today.
                    </p>
                </div>

                {/* Year Filter */}
                <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-text-secondary" />
                    <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                        className="px-3 py-2 border border-border rounded-lg bg-surface-card text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                        {yearOptions.map(year => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {statCards.map((card, index) => {
                    const styles = getColorStyles(card.color);
                    return (
                        <div
                            key={index}
                            className={`bg-surface-card rounded-xl shadow-sm border ${styles.border} p-6 hover:shadow-md transition-shadow duration-200`}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className={`p-3 rounded-lg ${styles.iconBg}`}>
                                    <card.icon className={`w-6 h-6 ${styles.text}`} />
                                </div>
                                <span className={`text-xs font-medium px-2 py-1 rounded-full ${styles.bg} ${styles.text}`}>
                                    {selectedYear}
                                </span>
                            </div>

                            <div>
                                <p className="text-sm text-text-secondary mb-1">
                                    {card.title}
                                </p>
                                <p className="text-3xl font-bold text-text-primary">
                                    {card.value.toLocaleString()}
                                </p>
                                {card.subValue && (
                                    <p className="text-xs text-text-secondary mt-1">
                                        {card.subValue}
                                    </p>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Schools Distribution Chart */}
                <div className="bg-surface-card rounded-xl shadow-sm border border-border p-6">
                    <h3 className="text-lg font-semibold text-text-heading mb-4">
                        Schools Distribution
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-text-secondary">Active Schools</span>
                                <span className="font-semibold text-text-primary">
                                    {stats.activeSchoolCount}
                                </span>
                            </div>
                            <div className="w-full bg-border rounded-full h-2">
                                <div
                                    className="h-2 rounded-full transition-all duration-500 bg-success"
                                    style={{
                                        width: `${stats.schoolCount > 0 ? (stats.activeSchoolCount / stats.schoolCount) * 100 : 0}%`,
                                    }}
                                />
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-text-secondary">Inactive Schools</span>
                                <span className="font-semibold text-text-primary">
                                    {inactiveSchoolCount}
                                </span>
                            </div>
                            <div className="w-full bg-border rounded-full h-2">
                                <div
                                    className="h-2 rounded-full transition-all duration-500 bg-error"
                                    style={{
                                        width: `${stats.schoolCount > 0 ? (inactiveSchoolCount / stats.schoolCount) * 100 : 0}%`,
                                    }}
                                />
                            </div>
                        </div>
                        <div className="pt-4 mt-4 border-t border-border">
                            <div className="flex justify-between text-sm">
                                <span className="text-text-secondary">Total Schools</span>
                                <span className="font-semibold text-text-primary">
                                    {stats.schoolCount}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Subscriptions Distribution Chart */}
                <div className="bg-surface-card rounded-xl shadow-sm border border-border p-6">
                    <h3 className="text-lg font-semibold text-text-heading mb-4">
                        Subscriptions Distribution
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-text-secondary">Active Subscriptions</span>
                                <span className="font-semibold text-text-primary">
                                    {stats.activeSubscriptionCount}
                                </span>
                            </div>
                            <div className="w-full bg-border rounded-full h-2">
                                <div
                                    className="h-2 rounded-full transition-all duration-500 bg-success"
                                    style={{
                                        width: `${stats.subscriptionCount > 0 ? (stats.activeSubscriptionCount / stats.subscriptionCount) * 100 : 0}%`,
                                    }}
                                />
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-text-secondary">Inactive Subscriptions</span>
                                <span className="font-semibold text-text-primary">
                                    {inactiveSubscriptionCount}
                                </span>
                            </div>
                            <div className="w-full bg-border rounded-full h-2">
                                <div
                                    className="h-2 rounded-full transition-all duration-500 bg-warning"
                                    style={{
                                        width: `${stats.subscriptionCount > 0 ? (inactiveSubscriptionCount / stats.subscriptionCount) * 100 : 0}%`,
                                    }}
                                />
                            </div>
                        </div>
                        <div className="pt-4 mt-4 border-t border-border">
                            <div className="flex justify-between text-sm">
                                <span className="text-text-secondary">Total Subscriptions</span>
                                <span className="font-semibold text-text-primary">
                                    {stats.subscriptionCount}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className={`bg-gradient-to-br from-primary/5 to-transparent rounded-xl p-6 border border-primary/20`}>
                    <div className="flex items-center gap-3 mb-4">
                        <TrendingUp className="w-8 h-8 text-primary" />
                        <h3 className="text-lg font-semibold text-text-heading">
                            School Health
                        </h3>
                    </div>
                    <div className="space-y-2">
                        <p className="text-3xl font-bold text-primary">
                            {schoolActivePercentage}%
                        </p>
                        <p className="text-sm text-text-secondary">
                            of schools are currently active
                        </p>
                        <div className="mt-4 pt-4 border-t border-primary/20">
                            <div className="flex justify-between text-sm">
                                <span className="text-text-secondary">Growth Trend</span>
                                <span className="text-success flex items-center gap-1">
                                    <TrendingUp className="w-4 h-4" />
                                    +12% from last year
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={`bg-gradient-to-br from-info/5 to-transparent rounded-xl p-6 border border-info/20`}>
                    <div className="flex items-center gap-3 mb-4">
                        <DollarSign className="w-8 h-8 text-info" />
                        <h3 className="text-lg font-semibold text-text-heading">
                            Subscription Revenue
                        </h3>
                    </div>
                    <div className="space-y-2">
                        <p className="text-3xl font-bold text-info">
                            {subscriptionActivePercentage}%
                        </p>
                        <p className="text-sm text-text-secondary">
                            active subscription rate
                        </p>
                        <div className="mt-4 pt-4 border-t border-info/20">
                            <div className="flex justify-between text-sm">
                                <span className="text-text-secondary">Conversion Rate</span>
                                <span className="text-success flex items-center gap-1">
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
                <div className="text-center py-12 bg-surface-card rounded-xl border border-border">
                    <Building2 className="w-16 h-16 mx-auto text-text-secondary mb-4" />
                    <h3 className="text-lg font-medium text-text-heading mb-2">
                        No Data Available
                    </h3>
                    <p className="text-text-secondary">
                        There are no schools or subscriptions registered yet.
                    </p>
                </div>
            )}
        </div>
    );
};

export default SuperAdminDashboard;