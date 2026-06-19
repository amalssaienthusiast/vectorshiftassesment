// Text node with two special behaviors:
// 1. Auto-resize — node width/height grows as the user types more text
// 2. Dynamic handles — typing {{ variableName }} creates a connection handle on the left

import { useEffect, useRef, useMemo } from 'react';
import { Handle, Position, useUpdateNodeInternals } from 'reactflow';
import { useStore } from '../store';

const MIN_WIDTH = 200;
const MAX_WIDTH = 400;
const MIN_HEIGHT = 80;

export const TextNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);
  const updateNodeInternals = useUpdateNodeInternals();
  const textareaRef = useRef(null);
  const text = data.text ?? '{{input}}';

  // Extract unique variable names from {{ }} patterns in the text.
  // Uses matchAll to avoid stale lastIndex issues with a global regex.
  const variables = useMemo(() => {
    const seen = new Set();
    const matches = [];
    for (const match of text.matchAll(/\{\{\s*(\w+)\s*\}\}/g)) {
      if (!seen.has(match[1])) {
        seen.add(match[1]);
        matches.push(match[1]);
      }
    }
    return matches;
  }, [text]);

  // Tell React Flow to re-register handle positions when handles are added/removed
  useEffect(() => {
    updateNodeInternals(id);
  }, [variables.length, id, updateNodeInternals]);

  // Auto-resize: measure actual text dimensions and apply to the node wrapper
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;

    // Height — reset to auto first so scrollHeight recalculates from content
    el.style.height = 'auto';
    el.style.height = el.scrollHeight + 'px';

    // Width — we can't use scrollWidth because textarea has width:100%.
    // Instead, render the longest line in a hidden span with matching font to measure it.
    const lines = text.split('\n');
    const longestLine = lines.reduce((a, b) => (a.length > b.length ? a : b), '');

    const span = document.createElement('span');
    span.style.cssText = `
      visibility: hidden;
      position: absolute;
      top: -9999px;
      left: -9999px;
      white-space: pre;
      font-size: 12px;
      font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      padding: 0 8px;
      letter-spacing: normal;
    `;
    span.textContent = longestLine || ' ';
    document.body.appendChild(span);
    const measuredTextWidth = span.offsetWidth;
    document.body.removeChild(span);

    const newWidth = Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, measuredTextWidth + 60));

    const parent = el.closest('.base-node');
    if (parent) {
      parent.style.width = newWidth + 'px';
      parent.style.minHeight = Math.max(MIN_HEIGHT, el.scrollHeight + 60) + 'px';
    }
  }, [text]);

  const handleChange = (e) => {
    updateNodeField(id, 'text', e.target.value);
  };

  return (
    <div className="base-node">
      <div className="base-node-header">
        <span className="base-node-icon">📝</span>
        <span className="base-node-title">Text</span>
      </div>
      <div className="base-node-body">
        <label className="base-node-field">
          <span>Text</span>
          <textarea
            ref={textareaRef}
            className="text-node-textarea"
            value={text}
            onChange={handleChange}
            rows={1}
          />
        </label>
      </div>
      {/* One handle per unique variable, spaced evenly along the left edge */}
      {variables.map((v, i) => (
        <Handle
          key={v}
          type="target"
          position={Position.Left}
          id={`${id}-${v}`}
          style={{ top: `${((i + 1) / (variables.length + 1)) * 100}%` }}
          className="handle-with-label"
          data-label={v}
        />
      ))}
      <Handle
        type="source"
        position={Position.Right}
        id={`${id}-output`}
      />
    </div>
  );
};
