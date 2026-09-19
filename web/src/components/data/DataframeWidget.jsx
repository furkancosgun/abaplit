import React, { useState, useMemo } from 'react';
import { ArrowUpDown, Search } from 'lucide-react';
import { resolveBinding } from '../../core/binding';
import { DataFormatError } from '../../core/errors';
import ErrorDisplay from '../common/ErrorDisplay';

export default function DataframeWidget({ node, state }) {
  const { data } = node;
  const bound = resolveBinding(data, state);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState(null);
  const [sortAsc, setSortAsc] = useState(true);

  if (bound.error) {
    return <ErrorDisplay error={bound.error} title="Binding Error (Dataframe)" />;
  }

  const rawData = bound.isBound ? bound.value : data;

  if (!Array.isArray(rawData)) {
    const error = new DataFormatError({
      widget: 'dataframe',
      expected: 'an array of objects (ABAP internal table)',
      received: typeof rawData,
      bindingPath: bound.key,
    });
    return <ErrorDisplay error={error} title="Data Format Error (Dataframe)" />;
  }

  const headers = useMemo(() => {
    if (rawData.length === 0) return [];
    const first = rawData[0];
    return typeof first === 'object' && first !== null ? Object.keys(first) : ['Value'];
  }, [rawData]);

  const filteredData = useMemo(() => {
    let list = [...rawData];

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter((row) => {
        if (typeof row !== 'object' || row === null) {
          return String(row).toLowerCase().includes(q);
        }
        return Object.values(row).some((v) => String(v ?? '').toLowerCase().includes(q));
      });
    }

    if (sortColumn) {
      list.sort((a, b) => {
        const valA = a?.[sortColumn] ?? '';
        const valB = b?.[sortColumn] ?? '';
        if (typeof valA === 'number' && typeof valB === 'number') {
          return sortAsc ? valA - valB : valB - valA;
        }
        return sortAsc
          ? String(valA).localeCompare(String(valB))
          : String(valB).localeCompare(String(valA));
      });
    }

    return list;
  }, [rawData, searchTerm, sortColumn, sortAsc]);

  const handleSort = (col) => {
    if (sortColumn === col) {
      setSortAsc(!sortAsc);
    } else {
      setSortColumn(col);
      setSortAsc(true);
    }
  };

  return (
    <div className="st-dataframe-container">
      <div className="st-dataframe-toolbar">
        <div className="st-dataframe-search">
          <Search size={14} className="st-search-icon" />
          <input
            type="text"
            className="st-search-input"
            placeholder="Filter dataframe..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <span className="st-dataframe-count">
          {filteredData.length} of {rawData.length} rows
        </span>
      </div>

      <div className="st-table-wrapper">
        <table className="st-table st-dataframe-table">
          <thead>
            <tr>
              {headers.map((h, i) => (
                <th key={i} onClick={() => handleSort(h)} className="st-sortable-th">
                  <div className="st-th-content">
                    <span>{h}</span>
                    <ArrowUpDown size={12} className={sortColumn === h ? 'active' : ''} />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row, rIdx) => (
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
    </div>
  );
}
