import React, { useState } from 'react';
import { parseOptions } from '../../core/utils';

export default function Tabs({ node, state, renderChildren }) {
  const [activeTab, setActiveTab] = useState(0);
  const tabNodes = node.children || [];
  const parsedTitles = parseOptions(node.titles, state);
  const tabTitles = parsedTitles.length > 0 ? parsedTitles : tabNodes.map((_, i) => `Tab ${i + 1}`);

  return (
    <div className="st-tabs-container">
      <div className="st-tabs-header">
        {tabTitles.map((title, idx) => (
          <button
            key={idx}
            type="button"
            className={`st-tab-btn ${activeTab === idx ? 'active' : ''}`}
            onClick={() => setActiveTab(idx)}
          >
            {title}
          </button>
        ))}
      </div>
      <div className="st-tab-content">
        {tabNodes[activeTab] && renderChildren(tabNodes[activeTab].children)}
      </div>
    </div>
  );
}
