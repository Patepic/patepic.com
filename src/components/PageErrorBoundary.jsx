import { Component } from "react";
import { RefreshCw } from "lucide-react";

export class PageErrorBoundary extends Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <div className="min-h-[60vh] max-w-xl mx-auto px-4 flex flex-col items-center justify-center text-center">
        <h1 className="wordmark text-4xl sm:text-5xl text-charcoal-brown">Something went wrong</h1>
        <p className="mt-4 text-charcoal-brown/85">This page didn't load properly. Try reloading it.</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="pill pill-brown h-11 px-6 mt-8 text-sm"
        >
          <RefreshCw className="w-4 h-4" /> Reload
        </button>
      </div>
    );
  }
}
