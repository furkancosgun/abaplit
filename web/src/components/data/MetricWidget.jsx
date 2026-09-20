import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { resolveBinding, getBoundValue } from '../../core/binding';

export default function MetricWidget({ node, state }) {
  const { label, value, delta } = node;
  const bound = resolveBinding(value, state);
  const isBound = bound.isBound && !bound.error;

  const metricValue = isBound ? bound.value : getBoundValue(value, state);
  const boundLabel = getBoundValue(label, state);
  const boundDelta = getBoundValue(delta, state);
  const isPositive = boundDelta && !String(boundDelta).startsWith('-');

  return (
    <div className="st-metric">
      <span className="st-metric-label">{boundLabel}</span>
      <span className="st-metric-value">{metricValue !== undefined && metricValue !== null ? String(metricValue) : ''}</span>
      {boundDelta && (
        <span className={`st-metric-delta ${isPositive ? 'positive' : 'negative'}`}>
          {isPositive ? <ArrowUpRight size={15} /> : <ArrowDownRight size={15} />}
          {boundDelta}
        </span>
      )}
    </div>
  );
}
