import React, { useState } from 'react';

export default function Tabs({ node, renderChildren }) {
  const [activeTab, setActiveTab] = useState(0);
  const tabNodes = node.children || [];

  const tabTitles = node.titles
    ? node.titles.split(',').map((t) => t.trim())
    : tabNodes.map((_, i) => `Tab ${i + 1}`);

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
