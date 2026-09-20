import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import WidgetRenderer from './components/WidgetRenderer';
import ToastContainer from './components/common/ToastContainer';
import { setBindingValue } from './core/binding';
import { dispatchActions } from './core/actions';

function parseJsonOrPass(value) {
  if (typeof value === 'string') {
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  }
  return value;
}

export default function App() {
  const [appName, setAppName] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('app') || 'zcl_abaplit_demo_000';
  });

  const [state, setState] = useState({});
  const stateRef = useRef(state);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const [viewTree, setViewTree] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isDark, setIsDark] = useState(() => localStorage.getItem('abaplit_theme') === 'dark');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handleLocationChange = () => {
      const params = new URLSearchParams(window.location.search);
      setAppName(params.get('app') || 'zcl_abaplit_demo_000');
    };
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('abaplit_theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('abaplit_theme', 'light');
    }
  }, [isDark]);

  const addToast = useCallback(({ text, duration = 3000 }) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, text, duration }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const executeRun = useCallback(
    async (event = '', customState = null, checkInit = false, eventArgs = []) => {
      setIsRunning(true);
      try {
        const curState = customState !== null ? customState : stateRef.current;
        const normalizedArgs = Array.isArray(eventArgs)
          ? eventArgs.map((v) => (v == null ? '' : String(v)))
          : eventArgs != null
          ? [String(eventArgs)]
          : [];

        const payload = {
          app: appName,
          event: event || '',
          event_args: normalizedArgs,
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
            const parsedState = parseJsonOrPass(data.state);
            stateRef.current = parsedState;
            setState(parsedState);
          }
          if (data.view) {
            setViewTree(parseJsonOrPass(data.view));
          }
          const actionList = data.t_actions || data.T_ACTIONS;
          if (Array.isArray(actionList)) {
            dispatchActions(actionList, { addToast });
          }
        } else {
          console.error('abaplit execution error:', data.message);
        }
      } catch (err) {
        console.error('Request failed:', err);
      } finally {
        setIsRunning(false);
      }
    },
    [appName, addToast]
  );

  useEffect(() => {
    executeRun('', {}, true);
  }, [appName, executeRun]);

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

  const handleValueChange = useCallback((path, val) => {
    const nextState = setBindingValue(stateRef.current, path, val);
    stateRef.current = nextState;
    setState(nextState);
  }, []);

  const handleEvent = useCallback(
    (evt, args) => {
      executeRun(evt, null, false, args);
    },
    [executeRun]
  );

  const { sidebarNodes, mainNodes } = useMemo(() => {
    const side = [];
    const main = [];
    if (viewTree?.children) {
      for (const child of viewTree.children) {
        if (child.type === 'sidebar') {
          side.push(...(child.children || []));
        } else {
          main.push(child);
        }
      }
    }
    return { sidebarNodes: side, mainNodes: main };
  }, [viewTree]);

  const hasSidebar = sidebarNodes.length > 0;

  return (
    <div className="st-app">
      <Header
        isRunning={isRunning}
        onRerun={() => executeRun()}
        isDark={isDark}
        onToggleTheme={() => setIsDark((prev) => !prev)}
        appName={appName}
      />

      {hasSidebar && (
        <Sidebar
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen((prev) => !prev)}
          nodes={sidebarNodes}
          state={state}
          onValueChange={handleValueChange}
          onEvent={handleEvent}
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
            onEvent={handleEvent}
            isRunning={isRunning}
          />
        ))}
      </main>

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
