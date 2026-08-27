import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';

const ErrorFallback = ({ error }) => (
  <div style={{ padding: '2em', color: '#c0392b' }}>
    <h2>Something went wrong.</h2>
    <p> please contact lyna on discord .... :( </p>
    <p>{error.message}</p>
  </div>
);

const ErrorBoundary = ({ children }) => (
  <ReactErrorBoundary FallbackComponent={ErrorFallback}>{children}</ReactErrorBoundary>
);

export default ErrorBoundary;
