import React from "react";
import { Compass, RotateCw } from "lucide-react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught runtime error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col items-center justify-center p-6 text-center">
          <div className="h-16 w-16 rounded-3xl bg-rose-600/20 border border-rose-500/30 text-rose-400 flex items-center justify-center mb-4">
            <Compass className="h-8 w-8 animate-spin-slow" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Render Error Caught</h2>
          <p className="text-xs text-rose-300 max-w-lg mx-auto mb-4 bg-rose-950/60 p-3 rounded-xl border border-rose-500/30 font-mono text-left whitespace-pre-wrap break-all">
            {this.state.error?.toString() || "Unknown error"}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-violet-600 to-cyan-500 text-white text-xs font-bold shadow-lg shadow-violet-600/30 flex items-center gap-2 cursor-pointer"
          >
            <RotateCw className="h-4 w-4" />
            <span>Reload Page</span>
          </button>
        </div>
      );
    }


    return this.props.children;
  }
}

export default ErrorBoundary;
