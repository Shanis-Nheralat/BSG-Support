import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      errorId: null
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Generate a unique error ID for tracking
    const errorId = Date.now().toString(36) + Math.random().toString(36).substr(2);
    
    console.error('Team Efficiency Calculator Error:', error);
    console.error('Error Info:', errorInfo);
    
    this.setState({
      error,
      errorInfo,
      errorId
    });

    // In production, you would send this to your error tracking service
    // Example: Sentry, LogRocket, or custom logging service
    if (process.env.NODE_ENV === 'production') {
      // logErrorToService(error, errorInfo, errorId);
    }
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white p-6 text-center">
              <AlertTriangle className="h-12 w-12 mx-auto mb-3" />
              <h1 className="text-2xl font-bold">Something went wrong</h1>
              <p className="text-red-100 mt-2">
                The Team Efficiency Calculator encountered an unexpected error
              </p>
            </div>

            {/* Error Details */}
            <div className="p-6">
              <div className="space-y-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h3 className="font-semibold text-red-800 mb-2">Error Details</h3>
                  <p className="text-red-700 text-sm">
                    {this.state.error?.message || 'An unexpected error occurred'}
                  </p>
                  {this.state.errorId && (
                    <p className="text-red-600 text-xs mt-2">
                      Error ID: {this.state.errorId}
                    </p>
                  )}
                </div>

                {/* Development Error Stack */}
                {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
                  <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <summary className="font-medium text-gray-700 cursor-pointer">
                      Technical Details (Development)
                    </summary>
                    <pre className="text-xs text-gray-600 mt-2 overflow-auto max-h-32">
                      {this.state.error && this.state.error.stack}
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </details>
                )}

                {/* Suggested Actions */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-800 mb-2">What you can do:</h3>
                  <ul className="text-blue-700 text-sm space-y-1">
                    <li>• Try refreshing the page</li>
                    <li>• Clear your browser cache</li>
                    <li>• Check your internet connection</li>
                    <li>• Try again in a few minutes</li>
                  </ul>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mt-6">
                <button
                  onClick={this.handleReload}
                  className="flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reload Page
                </button>
                
                <button
                  onClick={this.handleReset}
                  className="flex items-center justify-center px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Try Again
                </button>
              </div>

              {/* Support Information */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <p className="text-gray-600 text-sm text-center">
                  If the problem persists, please contact{' '}
                  <a 
                    href="mailto:support@bsgsupport.com" 
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    support@bsgsupport.com
                  </a>
                </p>
                {this.state.errorId && (
                  <p className="text-gray-500 text-xs text-center mt-1">
                    Please include Error ID: {this.state.errorId}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;