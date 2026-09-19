import React from 'react';
import ErrorDisplay from './ErrorDisplay';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Widget render failure:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorDisplay
          title="Component Render Error"
          error={this.state.error}
        />
      );
    }
    return this.props.children;
  }
}
