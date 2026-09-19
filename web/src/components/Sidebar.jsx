import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import WidgetRenderer from './WidgetRenderer';

export default function Sidebar({ isOpen, onToggle, nodes, state, onValueChange, onEvent, isRunning }) {
  return (
    <>
      <button
        className="st-sidebar-toggle"
        onClick={onToggle}
        title={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
      >
        {isOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
      </button>

      <aside className={`st-sidebar ${isOpen ? '' : 'collapsed'}`}>
        {nodes && nodes.map((child, idx) => (
          <WidgetRenderer
            key={idx}
            node={child}
            state={state}
            onValueChange={onValueChange}
            onEvent={onEvent}
            isRunning={isRunning}
          />
        ))}
      </aside>
    </>
  );
}
