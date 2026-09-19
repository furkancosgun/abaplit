import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import WidgetRenderer from './components/WidgetRenderer';
import ToastContainer from './components/common/ToastContainer';
import { setBindingValue } from './core/binding';
import { dispatchActions } from './core/actions';

export default function App() {
  const [appName, setAppName] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('app') || 'zcl_abaplit_demo_000';
  });

  const [state, setState] = useState({});
  const stateRef = React.useRef(state);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const [viewTree, setViewTree] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('abaplit_theme') === 'dark';
  });
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [toasts, setToasts] = useState([]);

  // Sync with URL popstate
  useEffect(() => {
    const handleLocationChange = () => {
      const params = new URLSearchParams(window.location.search);
      const curApp = params.get('app') || 'zcl_abaplit_demo_000';
      setAppName(curApp);
    };
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  // Sync theme
  useEffect(() => {
    if (isDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('abaplit_theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('abaplit_theme', 'light');
    }
  }, [isDark]);

  // Execute roundtrip
  const executeRun = useCallback(async (event = '', customState = null, checkInit = false, eventArgs = []) => {
    setIsRunning(true);
    try {
      const curState = customState !== null ? customState : stateRef.current;

      const payload = {
        app: appName,
        event: event || '',
        event_args: Array.isArray(eventArgs) ? eventArgs : [eventArgs],
        check_init: checkInit,
        state: typeof curState === 'string' ? curState : JSON.stringify(curState || {}),
      };

      const endpoint = window.location.pathname || '/';

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        if (data.state) {
          const parsedState = typeof data.state === 'string' ? JSON.parse(data.state) : data.state;
          stateRef.current = parsedState;
          setState(parsedState);
        }
        if (data.view) {
          const parsedView = typeof data.view === 'string' ? JSON.parse(data.view) : data.view;
          setViewTree(parsedView);
        }
        const actionList = data.t_actions || data.T_ACTIONS;
        if (actionList && Array.isArray(actionList)) {
          dispatchActions(actionList, {
            addToast: ({ text, duration }) => {
              const id = Date.now() + Math.random();
              setToasts((prev) => [...prev, { id, text, duration }]);
              setTimeout(() => {
                setToasts((prev) => prev.filter((t) => t.id !== id));
              }, duration || 3000);
            },
          });
        }
      } else {
        console.error('abaplit execution error:', data.message);
      }
    } catch (err) {
      console.error('Request failed:', err);
    } finally {
      setIsRunning(false);
    }
  }, [appName]);

  // Initial load
  useEffect(() => {
    executeRun('', {}, true);
  }, [appName]);

  // Keyboard shortcut 'R' for rerun
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.key === 'r' || e.key === 'R') && !['INPUT', 'TEXTAREA'].includes(e.target.tagName)) {
        e.preventDefault();
        executeRun();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [executeRun]);

  const handleValueChange = (path, val) => {
    const nextState = setBindingValue(stateRef.current, path, val);
    stateRef.current = nextState;
    setState(nextState);
  };

  // Separate sidebar children from main content
  let sidebarNodes = [];
  let mainNodes = [];

  if (viewTree && viewTree.children) {
    for (const child of viewTree.children) {
      if (child.type === 'sidebar') {
        sidebarNodes = child.children || [];
      } else {
        mainNodes.push(child);
      }
    }
  }

  const hasSidebar = sidebarNodes.length > 0;

  return (
    <div className="st-app">
      <Header
        isRunning={isRunning}
        onRerun={() => executeRun()}
        isDark={isDark}
        onToggleTheme={() => setIsDark(!isDark)}
        appName={appName}
      />

      {hasSidebar && (
        <Sidebar
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
          nodes={sidebarNodes}
          state={state}
          onValueChange={handleValueChange}
          onEvent={(evt, args) => executeRun(evt, null, false, args)}
          isRunning={isRunning}
        />
      )}

      <main className={`st-main ${hasSidebar ? 'with-sidebar' : ''}`}>
        {mainNodes.map((child, idx) => (
          <WidgetRenderer
            key={idx}
            node={child}
            state={state}
            onValueChange={handleValueChange}
            onEvent={(evt, args) => executeRun(evt, null, false, args)}
            isRunning={isRunning}
          />
        ))}
      </main>

      <ToastContainer
        toasts={toasts}
        onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))}
      />
    </div>
  );
}
