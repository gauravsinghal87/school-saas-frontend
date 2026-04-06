import React from "react";
import { AlertCircle, RefreshCw, ChevronDown, ChevronUp } from "lucide-react";
import Button from "./Button";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  toggleDetails = () => {
    this.setState(prev => ({ showDetails: !prev.showDetails }));
  };

  render() {
    if (this.state.hasError) {
      const { error, errorInfo, showDetails } = this.state;

      return (
        <div className="min-h-screen bg-surface-page flex items-center  flex-col justify-center p-4 gap-6">
          <div className="max-w-lg  w-full bg-surface-card rounded-2xl border border-border shadow-lg p-6">
            {/* Icon */}
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-error/10 rounded-full">
                <AlertCircle className="w-8 h-8 text-error" />
              </div>
            </div>

            {/* Title */}
            <h1 className="text-xl font-bold text-text-heading text-center mb-2">
              Something went wrong
            </h1>

            {/* Error Message */}
            <div className="bg-error/5 border border-error/20 rounded-lg p-3 mb-4">
              <p className="text-error text-sm text-center font-mono break-all">
                {error?.message || "An unexpected error occurred"}
              </p>
            </div>

            {/* Toggle Details */}
            <button
              onClick={this.toggleDetails}
              className="inline-flex items-center justify-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors w-full mb-4"
            >
              {showDetails ? (
                <>
                  <ChevronUp className="w-4 h-4" />
                  Hide details
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" />
                  Show technical details
                </>
              )}
            </button>

            {/* Technical Details */}
            {showDetails && errorInfo?.componentStack && (
              <div className="bg-surface-page rounded-lg border border-border p-3 mb-4">
                <p className="text-text-secondary text-xs font-semibold mb-2">Component Stack:</p>
                <pre className="text-xs text-text-secondary font-mono overflow-x-auto whitespace-pre-wrap break-all max-h-48">
                  {errorInfo.componentStack}
                </pre>
              </div>
            )}

          </div>

          {/* Reload Button */}
          <Button
            onClick={this.handleReload}
            className="w-full inline-flex items-center justify-center gap-2 bg-primary text-white rounded-lg py-2 hover:bg-primary/90 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Reload Page
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

