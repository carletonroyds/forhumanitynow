import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';

const App = React.lazy(() => import('./App'));

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <Suspense fallback={<div style={{ padding: 16 }}>Loading…</div>}>
    <App />
  </Suspense>
);