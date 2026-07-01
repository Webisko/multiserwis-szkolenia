import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = "/";
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 text-white font-sans">
          <div className="max-w-md w-full bg-slate-800 rounded-lg shadow-2xl p-8 border-t-4 border-yellow-500 text-center">
            <div className="inline-flex p-4 bg-yellow-500/10 rounded-full text-yellow-500 mb-6">
              <AlertTriangle size={48} />
            </div>
            
            <h1 className="text-2xl font-bold font-heading mb-3">
              Coś poszło nie tak
            </h1>
            
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">
              Wystąpił nieoczekiwany błąd aplikacji. Spróbuj odświeżyć stronę lub wrócić do panelu głównego.
            </p>

            {process.env.NODE_ENV === "development" && this.state.error && (
              <div className="text-left bg-slate-950 p-4 rounded text-xs font-mono text-red-400 mb-6 overflow-auto max-h-40 border border-slate-700">
                {this.state.error.toString()}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={this.handleReload}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-yellow-500 hover:bg-yellow-600 text-slate-950 font-bold rounded-sm transition-colors cursor-pointer"
              >
                <RefreshCw size={16} />
                Odśwież stronę
              </button>
              <button
                onClick={this.handleGoHome}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-sm transition-colors cursor-pointer"
              >
                <Home size={16} />
                Strona Główna
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.children;
  }
}
