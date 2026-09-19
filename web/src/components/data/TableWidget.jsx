import React from 'react';
import { resolveBinding } from '../../core/binding';
import { DataFormatError } from '../../core/errors';
import ErrorDisplay from '../common/ErrorDisplay';

export default function TableWidget({ node, state }) {
  const { data } = node;
  const bound = resolveBinding(data, state);

  if (bound.error) {
    return <ErrorDisplay error={bound.error} title="Binding Error (Table)" />;
  }

  const rawData = bound.isBound ? bound.value : data;

  if (!Array.isArray(rawData)) {
    const error = new DataFormatError({
      widget: 'table',
      expected: 'an array of objects (ABAP internal table)',
      received: typeof rawData,
      bindingPath: bound.key,
    });
    return <ErrorDisplay error={error} title="Data Format Error (Table)" />;
  }

  if (rawData.length === 0) {
    return <div className="st-caption">Empty dataset (0 rows)</div>;
  }

  const firstRow = rawData[0];
  const headers = typeof firstRow === 'object' && firstRow !== null
    ? Object.keys(firstRow)
    : ['Value'];

  return (
    <div className="st-table-wrapper">
      <table className="st-table">
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th key={i}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rawData.map((row, rIdx) => (
            <tr key={rIdx}>
              {headers.map((h, cIdx) => {
                const cellVal = typeof row === 'object' && row !== null ? row[h] : row;
                return (
                  <td key={cIdx}>
                    {cellVal !== undefined && cellVal !== null ? String(cellVal) : ''}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
