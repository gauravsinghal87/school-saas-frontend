const PageLoader = (role = localStorage.getItem('role')) => {
    return (
        <div className="h-screen flex items-center justify-center bg-surface-page">
            <div className="text-center">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                <p className="text-primary">Loading... </p>
            </div>
        </div>
    );
};

export default PageLoader;