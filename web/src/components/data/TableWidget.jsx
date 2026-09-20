import React from 'react';
import { DataFormatError } from '../../core/errors';
import { resolveDataset } from '../../core/utils';
import ErrorDisplay from '../common/ErrorDisplay';

export default function TableWidget({ node, state }) {
  const { data: rawData, bindingPath, isErrorFallback } = resolveDataset(node.data, state);

  if (isErrorFallback) {
    return <p className="st-text">{String(rawData)}</p>;
  }

  if (!Array.isArray(rawData)) {
    const error = new DataFormatError({
      widget: 'table',
      expected: 'an array of objects (ABAP internal table)',
      received: typeof rawData,
      bindingPath,
    });
    return <ErrorDisplay error={error} title="Data Format Error (Table)" />;
  }

  if (rawData.length === 0) {
    return <div className="st-caption">Empty dataset (0 rows)</div>;
  }

  const firstRow = rawData[0];
  const headers =
    typeof firstRow === 'object' && firstRow !== null ? Object.keys(firstRow) : ['Value'];

  return (
    <div className="st-table-wrapper">
      <table className="st-table">
        <thead>
          <tr>
            {headers.map((header, i) => (
              <th key={i}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rawData.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {headers.map((header, colIndex) => {
                const cellVal = typeof row === 'object' && row !== null ? row[header] : row;
                return (
                  <td key={colIndex}>
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
