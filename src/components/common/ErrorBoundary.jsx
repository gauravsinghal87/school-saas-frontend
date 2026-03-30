import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  // Triggered when error occurs
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  // For logging
  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);

    // 🔥 Optional: send to backend
    // fetch("/api/log-error", {
    //   method: "POST",
    //   body: JSON.stringify({ error, errorInfo })
    // });
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-screen bg-bg text-text">
          <h1 className="text-2xl font-bold mb-4">
            Something went wrong 😢
          </h1>

          <button
            onClick={this.handleReload}
            className="bg-primary text-white px-4 py-2 rounded"
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;