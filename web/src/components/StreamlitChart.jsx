import React, { useState } from 'react';

export default function StreamlitChart({ type, data, height = 260 }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // Parse data
  let points = [];
  try {
    if (typeof data === 'string') {
      const trimmed = data.trim();
      if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          points = parsed.map((item, idx) => {
            if (typeof item === 'number') {
              return { label: `${idx + 1}`, value: item };
            }
            if (typeof item === 'object' && item !== null) {
              const label = item.label || item.LABEL || item.x || item.X || item.name || item.NAME || `${idx + 1}`;
              const val = Number(item.value ?? item.VALUE ?? item.y ?? item.Y ?? item.val ?? item.VAL ?? 0);
              return { label, value: val };
            }
            return { label: `${idx + 1}`, value: Number(item) || 0 };
          });
        }
      } else if (trimmed.includes(',')) {
        points = trimmed.split(',').map((v, idx) => ({
          label: `${idx + 1}`,
          value: parseFloat(v.trim()) || 0,
        }));
      }
    } else if (Array.isArray(data)) {
      points = data.map((item, idx) => {
        if (typeof item === 'number') return { label: `${idx + 1}`, value: item };
        if (typeof item === 'object' && item !== null) {
          const label = item.label || item.LABEL || item.x || item.X || item.name || item.NAME || `${idx + 1}`;
          const val = Number(item.value ?? item.VALUE ?? item.y ?? item.Y ?? item.val ?? item.VAL ?? 0);
          return { label, value: val };
        }
        return { label: `${idx + 1}`, value: Number(item) || 0 };
      });
    }
  } catch {
    points = [];
  }

  if (points.length === 0) {
    // Default fallback demo data if data is empty or invalid
    points = [
      { label: 'Jan', value: 12 },
      { label: 'Feb', value: 28 },
      { label: 'Mar', value: 19 },
      { label: 'Apr', value: 45 },
      { label: 'May', value: 33 },
      { label: 'Jun', value: 62 },
    ];
  }

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

  // Build Line / Area paths
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

  // Bar dimensions
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

        {/* Horizontal Grid lines */}
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

        {/* Bottom X-Axis Labels */}
        {points.map((p, idx) => {
          let x = type === 'bar_chart'
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

        {/* AREA CHART */}
        {type === 'area_chart' && (
          <>
            <path d={areaPath} fill="url(#areaGrad)" />
            <path d={linePath} fill="none" stroke="#ff4b4b" strokeWidth="2.5" />
          </>
        )}

        {/* LINE CHART */}
        {type === 'line_chart' && (
          <path d={linePath} fill="none" stroke="#ff4b4b" strokeWidth="2.5" />
        )}

        {/* BAR CHART */}
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

        {/* SCATTER / POINTS for line and area */}
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

        {/* Hover Tooltip */}
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
