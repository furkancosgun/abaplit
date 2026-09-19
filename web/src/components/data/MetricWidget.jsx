import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { resolveBinding } from '../../core/binding';
import ErrorDisplay from '../common/ErrorDisplay';

export default function MetricWidget({ node, state }) {
  const { label, value, delta } = node;
  const bound = resolveBinding(value, state);

  if (bound.error) {
    return <ErrorDisplay error={bound.error} title="Binding Error (Metric)" />;
  }

  const metricValue = bound.isBound ? bound.value : value;
  const isPositive = delta && !delta.startsWith('-');

  return (
    <div className="st-metric">
      <span className="st-metric-label">{label}</span>
      <span className="st-metric-value">{metricValue}</span>
      {delta && (
        <span className={`st-metric-delta ${isPositive ? 'positive' : 'negative'}`}>
          {isPositive ? <ArrowUpRight size={15} /> : <ArrowDownRight size={15} />}
          {delta}
        </span>
      )}
    </div>
  );
}
