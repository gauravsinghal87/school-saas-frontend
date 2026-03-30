const PageLoader = () => {
    return (
        <div className="h-screen flex items-center justify-center bg-gray-100">
            <div className="text-center">
                <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                <p className="text-gray-600">Loading...</p>
            </div>
        </div>
    );
};

export default PageLoader;