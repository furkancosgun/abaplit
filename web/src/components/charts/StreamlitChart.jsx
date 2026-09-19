import React, { useState } from 'react';
import { DataFormatError } from '../../core/errors';
import ErrorDisplay from '../common/ErrorDisplay';

export default function StreamlitChart({ type, data, height = 240, bindingPath }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  if (!Array.isArray(data)) {
    const error = new DataFormatError({
      widget: type,
      expected: 'an array of data points or objects',
      received: data === null ? 'null' : typeof data,
      bindingPath,
    });
    return <ErrorDisplay error={error} title={`Chart Error (${type})`} />;
  }

  if (data.length === 0) {
    return <div className="st-caption">No data points to display in {type}</div>;
  }

  const points = data.map((item, idx) => {
    if (typeof item === 'number') {
      return { label: `${idx + 1}`, value: item };
    }
    if (typeof item === 'object' && item !== null) {
      const label = item.label || item.LABEL || item.x || item.X || item.name || item.NAME || `${idx + 1}`;
      const val = Number(item.value ?? item.VALUE ?? item.y ?? item.Y ?? item.val ?? item.VAL ?? 0);
      return { label: String(label), value: Number.isNaN(val) ? 0 : val };
    }
    return { label: `${idx + 1}`, value: Number(item) || 0 };
  });

  const svgWidth = 600;
  const svgHeight = parseInt(height, 10) || 240;
  const padding = { top: 25, right: 30, bottom: 35, left: 45 };

  const chartW = svgWidth - padding.left - padding.right;
  const chartH = svgHeight - padding.top - padding.bottom;

  const values = points.map((p) => p.value);
  const minVal = Math.min(0, ...values);
  const maxVal = Math.max(...values) * 1.15 || 10;
  const range = maxVal - minVal || 1;

  const getX = (idx) => {
    if (points.length <= 1) return padding.left + chartW / 2;
    return padding.left + (idx / (points.length - 1)) * chartW;
  };

  const getY = (val) => {
    return padding.top + chartH - ((val - minVal) / range) * chartH;
  };

  let linePath = '';
  points.forEach((p, idx) => {
    const x = getX(idx);
    const y = getY(p.value);
    if (idx === 0) {
      linePath += `M ${x} ${y}`;
    } else {
      const prevX = getX(idx - 1);
      const prevY = getY(points[idx - 1].value);
      const cx1 = prevX + (x - prevX) / 2;
      const cy1 = prevY;
      const cx2 = prevX + (x - prevX) / 2;
      const cy2 = y;
      linePath += ` C ${cx1} ${cy1}, ${cx2} ${cy2}, ${x} ${y}`;
    }
  });

  const areaBottomY = getY(Math.max(0, minVal));
  const firstX = getX(0);
  const lastX = getX(points.length - 1);
  const areaPath = `${linePath} L ${lastX} ${areaBottomY} L ${firstX} ${areaBottomY} Z`;

  const barWidth = Math.max(12, Math.min(45, chartW / points.length - 14));

  return (
    <div className="st-chart-container" style={{ height: svgHeight }}>
      <svg
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="st-chart-svg"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ff4b4b" stopOpacity="0.38" />
            <stop offset="100%" stopColor="#ff4b4b" stopOpacity="0.02" />
          </linearGradient>
          <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ff4b4b" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#ff7676" stopOpacity="0.75" />
          </linearGradient>
        </defs>

        {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
          const y = padding.top + chartH * (1 - ratio);
          const val = Math.round(minVal + range * ratio);
          return (
            <g key={i}>
              <line
                x1={padding.left}
                y1={y}
                x2={svgWidth - padding.right}
                y2={y}
                stroke="var(--border-color)"
                strokeDasharray="4 4"
                strokeWidth="1"
                opacity="0.6"
              />
              <text
                x={padding.left - 8}
                y={y + 4}
                textAnchor="end"
                fontSize="11"
                fill="var(--text-muted)"
              >
                {val}
              </text>
            </g>
          );
        })}

        {points.map((p, idx) => {
          const x = type === 'bar_chart'
            ? padding.left + (idx + 0.5) * (chartW / points.length)
            : getX(idx);
          return (
            <text
              key={idx}
              x={x}
              y={svgHeight - 10}
              textAnchor="middle"
              fontSize="11"
              fill="var(--text-muted)"
            >
              {p.label}
            </text>
          );
        })}

        {type === 'area_chart' && (
          <>
            <path d={areaPath} fill="url(#areaGrad)" />
            <path d={linePath} fill="none" stroke="#ff4b4b" strokeWidth="2.5" />
          </>
        )}

        {type === 'line_chart' && (
          <path d={linePath} fill="none" stroke="#ff4b4b" strokeWidth="2.5" />
        )}

        {type === 'bar_chart' && (
          <g>
            {points.map((p, idx) => {
              const xCenter = padding.left + (idx + 0.5) * (chartW / points.length);
              const x = xCenter - barWidth / 2;
              const y = getY(p.value);
              const h = Math.max(2, areaBottomY - y);
              const isHovered = hoveredIndex === idx;
              return (
                <rect
                  key={idx}
                  x={x}
                  y={y}
                  width={barWidth}
                  height={h}
                  rx="4"
                  fill={isHovered ? '#ff3333' : 'url(#barGrad)'}
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  style={{
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                />
              );
            })}
          </g>
        )}

        {(type === 'line_chart' || type === 'area_chart' || type === 'scatter_chart') && (
          <g>
            {points.map((p, idx) => {
              const x = getX(idx);
              const y = getY(p.value);
              const isHovered = hoveredIndex === idx;
              const radius = type === 'scatter_chart' ? 6 : (isHovered ? 6 : 4);
              return (
                <g key={idx}>
                  <circle
                    cx={x}
                    cy={y}
                    r={radius}
                    fill={isHovered ? '#ffffff' : '#ff4b4b'}
                    stroke="#ff4b4b"
                    strokeWidth={isHovered ? 3 : 2}
                    onMouseEnter={() => setHoveredIndex(idx)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    style={{
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  />
                </g>
              );
            })}
          </g>
        )}

        {hoveredIndex !== null && points[hoveredIndex] && (
          <g>
            {(() => {
              const p = points[hoveredIndex];
              const x = type === 'bar_chart'
                ? padding.left + (hoveredIndex + 0.5) * (chartW / points.length)
                : getX(hoveredIndex);
              const y = getY(p.value) - 12;
              return (
                <g transform={`translate(${x}, ${Math.max(20, y)})`}>
                  <rect
                    x="-35"
                    y="-22"
                    width="70"
                    height="22"
                    rx="4"
                    fill="var(--text-color)"
                    opacity="0.9"
                  />
                  <text
                    x="0"
                    y="-7"
                    textAnchor="middle"
                    fill="var(--background-color)"
                    fontSize="11"
                    fontWeight="600"
                  >
                    {p.label}: {p.value}
                  </text>
                </g>
              );
            })()}
          </g>
        )}
      </svg>
    </div>
  );
}
