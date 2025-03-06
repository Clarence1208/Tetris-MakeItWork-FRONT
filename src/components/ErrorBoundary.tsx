import React, {Component, ErrorInfo, ReactNode} from 'react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null
        };
    }

    static getDerivedStateFromError(error: Error): State {
        // Update state so the next render will show the fallback UI
        return {
            hasError: true,
            error,
            errorInfo: null
        };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        // Log the error to an error reporting service
        console.error('Error caught by ErrorBoundary:', error, errorInfo);
        this.setState({
            error,
            errorInfo
        });
    }

    render(): ReactNode {
        if (this.state.hasError) {
            return (
                <div className="error-boundary p-4 bg-red-100 border border-red-400 text-red-700 rounded mb-4">
                    <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
                    <details className="whitespace-pre-wrap">
                        <summary className="cursor-pointer font-semibold mb-2">Show error details</summary>
                        <p className="mt-2">{this.state.error && this.state.error.toString()}</p>
                        <div className="mt-2 text-sm">
                            {this.state.errorInfo && this.state.errorInfo.componentStack}
                        </div>
                    </details>
                    <button
                        className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                        onClick={() => window.location.reload()}
                    >
                        Reload Page
                    </button>
                </div>
            );
        }

        // If there's no error, render children normally
        return this.props.children;
    }
}

export default ErrorBoundary; 