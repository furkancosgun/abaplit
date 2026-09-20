import { useCallback } from 'react';
import { resolveBinding, getBoundValue } from '../core/binding';

export function useBoundInput(node, state, { onValueChange, onEvent, defaultValue = '', transformChange } = {}) {
  const { value, label, on_change, on_submit } = node;
  const bound = resolveBinding(value, state);
  const isBound = Boolean(bound.isBound && !bound.error);

  const rawValue = isBound ? bound.value : value;
  const currentValue = rawValue !== undefined && rawValue !== null ? rawValue : defaultValue;
  const boundLabel = getBoundValue(label, state);

  const handleChange = useCallback(
    (nextVal, eventVal = nextVal) => {
      const transformed = transformChange ? transformChange(nextVal) : nextVal;
      if (isBound && onValueChange) {
        onValueChange(bound.key, transformed);
      }
      if (on_change && onEvent) {
        onEvent(on_change, eventVal);
      }
    },
    [isBound, bound.key, onValueChange, on_change, onEvent, transformChange]
  );

  const handleKeyDown = useCallback(
    (e, submitValue = currentValue) => {
      if (e.key === 'Enter' && on_submit && onEvent) {
        onEvent(on_submit, submitValue);
      }
    },
    [on_submit, onEvent, currentValue]
  );

  const getProp = useCallback(
    (propName, fallback) => {
      const boundProp = getBoundValue(node[propName], state);
      return boundProp !== undefined && boundProp !== null ? boundProp : fallback;
    },
    [node, state]
  );

  return {
    value: currentValue,
    label: boundLabel,
    isBound,
    bindingKey: bound.key,
    handleChange,
    handleKeyDown,
    getProp,
  };
}
